### Environment Configuration

1. `parseEnv(schema, env)`: runs a Zod schema against `process.env` and throws a readable,
   multi line error if anything is missing or malformed. Each config module defines its own narrow schema instead of one giant app wide schema.

2. `lazyConfig(factory)`: wraps the validation, so it only runs the first time, the config is actually read, then caches the result.

- configuration is only validated when it is actually needed, so unrelated code can be loaded without failing because a required environment variable is missing.

- EncryptionKey token, GithubWebhookSecret, and MetricsToken are loaded independently, so code that only needs one of these values does not have to provide the unrelated secrets just to start up.

- booleanFlag uses because environment variables are always strings, so "1" and "true" are explicitly converted into real booleans. It is used by inngest client configuration

- Per-module schemas keep validation focused, so a missing Token Encryption Key fails with a clear Token Encryption Key is not configured message instead of showing unrelated errors for environment variables that the current code path never uses.

3. z.coerce.number() is used for numeric environment variables because env values are always strings. It converts the string to a number and then validates it, so there is no need for a separate Number() conversion before validation.

### Postgres connection

- `Database url` is required because the application cannot function without a database, so there is no sensible default.

- If the url does not already specify `sslmode`, the code adds `sslmode=require` as a safe default for hosted PostgreSQL.

- This means ssl works without needing to configure it separately in every environment, while still allowing providers that require a different ssl mode to specify one explicitly.

- Used by the database client to create and reuse a single Prisma driver adapter instead of creating a new one on every invocation.

- This keeps database connections and the connection pool shared across requests, which is especially important in serverless style environments where repeatedly creating new connection pools can waste connections and put unnecessary pressure on the database.

### Redis cache connection

- Redis url has a default of redis://localhost:6379, unlike the database url, because Redis is only used as a cache and is not the source of truth.

- That makes it safe to assume a local Redis instance for development instead of requiring the value to be configured in every environment.

- If Redis is unavailable, the application can fall back to its normal data sources rather than failing completely.

- Redis is intentionally treated as an expendable (not considered important) cache rather than a required dependency.

- Retries are kept low with a short, capped backoff so a failed Redis connection gives up quickly instead of making requests wait on repeated cache operations.

- This allows the application to fall back to the source of truth which is database calls without adding unnecessary latency.

- The goal is simple: Redis should improve performance when available, but its failure should never become a reason for the application to stall or go down.

### GitHub OAuth

- `github client id` and `github client secret` are required because GitHub sign-in cannot work without credentials from a registered GitHub OAuth app.

- There are no sensible defaults for these values, so the application should fail clearly when they are missing rather than starting with a broken authentication setup.

- The credentials are passed to the GitHub social provider, which also requests the `repo` scope so the application can access private repositories, read their contents and diffs, and post review comments when authorized.

### Security independent secrets

These secrets are loaded independently, so a missing value only affects the part of the application that actually needs it. This keeps unrelated code paths from failing just because one secret has not been configured.

- **`token encryption key`** is required because it is used to encrypt GitHub OAuth tokens at rest api calls. There is no safe default for an encryption key, so using a shared or predictable fallback would put stored tokens at risk. Failing clearly is safer than silently using an insecure key.

- **`github webhook secret`** is optional at the configuration level but required for GitHub webhooks to work securely. It is used to verify incoming webhook signatures. Keeping it optional here allows the application to start without the secret, while the webhook operation itself fails when the secret is actually needed.

- **`metrics token`** is optional because local and internal deployments may not need authentication on the metrics endpoint. In a real production deployment, the endpoint is expected to require the token so metrics are not exposed publicly without authentication.

The motive is to **validate secrets at the right boundary**: required secrets fail when they are needed, optional secrets don't prevent unrelated parts of the application from starting, and security sensitive production paths fail closed instead of silently becoming insecure.

### Inngest background job runner wiring

- `inngest dev` and `inngest signing key` are optional in the schema because they are only required
  depending on where the application is running.

- Local development can use `inngest dev` without a
  signing key, while a real production deployment must use signed requests.

- The production check is kept where the inngest client is created rather than in the schema.

- This lets local and non production environments use dev mode freely, while production fails clearly if
  dev mode is enabled or the signing key is missing.

This prevents inngest signature verification
from being disabled accidentally in production.

### Rate limiters

The rate limiters are kept separate because they protect different endpoints and workloads.

- **Webhook limits**: allows up to 60 webhook requests per IP every 60 seconds. This provides a basic per IP limit on the GitHub webhook endpoint to prevent excessive request traffic.

- **Repository review limit**: allows up to 20 review triggers for a repository every 300 seconds. Unlike the IP limit, this is applied per repository.
  - This protects the expensive AI review pipeline
    from being flooded by a burst of webhook events, such as repeated force pushes, even when those
    requests come from legitimate GitHub webhook IPs.

- **Inngest limits**: allows up to 120 requests per IP every 60 seconds. Inngest already verifies request signatures, so this acts as an additional layer of protection against excessive requests.
  - Its purpose is to limit the damage from a leaked or misconfigured signing key rather than replace
    signature verification as the main security check.

### Cache TTLs: Per-Feature Dashboard Cache

- Four cache TTLs are independently configurable because different dashboard data changes at different rates.

- Settings rarely change, so they use a longer 10-minute TTL. New reviews can appear frequently, so they use a shorter 2-minute TTL. Repository metadata falls in between with a 5-minute TTL.

- The TTL used as a **fallback**, not the primary cache invalidation mechanism. Most cache refreshes happen through explicit invalidation immediately after a write operation.

- The TTL mainly matters when an invalidation is missed, acting as a safety net that limits how long stale data can remain cached.

### GitHub API REST Call Timeout + Response Caching

The GitHub request timeout defaults to 15 seconds. This is the maximum time allowed for a GitHub API request to process before it is cancelled.

The four cache TTLs follow the same principle: data that changes more frequently gets a shorter cache duration, while relatively stable data can stay cached longer.

- **User repositories**: 10 minutes, since a user's repository list usually does not change frequently.

- **User contributions**: 5 minutes, giving reasonably fresh activity data without repeatedly calling the GitHub API.

- **Repository files**: 2 minutes, since file contents can change as the repository is updated.

- **Pull request diffs**: 1 minute, the shortest TTL because a pull request can change with every new push.

The goal is to balance **API usage and data freshness**.

- Short lived caching reduces repeated GitHub API requests/calls and helps stay within GitHub's rate limits, while still keeping the data reasonably fresh.

- The exact durations are based on how frequently each type of data is expected to change

### Repository Indexing Resource Limits

Indexing a newly connected repository can involve fetching, parsing, chunking, and embedding hundreds or even thousands of files. These limits keep that work from overwhelming GitHub, the application process, the embedding service, or the database.

- **File Fetch Concurrency**: limits how many GitHub file content requests can run at the same time. The default of 8 helps avoid large bursts of requests that could trigger GitHub's secondary rate limits.

> A GitHub secondary rate limit is an safety system designed to prevent server abuse, ensure platform stability, and block automated spamming

- **Embedding Batch Size**: controls how many code chunks are sent to Gemini's embedding API in a single batch. The default of 15 keeps embedding work bounded under restrictions instead of sending an unnecessarily large batch at once.

- **Database Insert Batch Size**: controls how many code chunks are written to Postgres in a single insert. The default of 1,000 reduces the number of database operations while keeping each write at a manageable size.

- **Maximum Parseable File Size**: limits how much code tree-sitter will attempt to parse from a single file. The default of 500,000 characters prevents unusually large files from consuming excessive CPU resources. Since parsing is synchronous, an extremely large file could block the event loop and delay unrelated requests.

- **Maximum Chunk Content Size**: limits how much text, a single AST-derived chunk can contain before it is sent for embedding. The default of 20,000 characters keeps chunks within the embedding model's input limits and avoids relying on unpredictable provider side truncation or errors.

The overall motive is to **put deliberate boundaries around indexing work**. Without these limits, a large repository could create too many concurrent GitHub requests, oversized embedding batches, heavy database writes, or CPU-heavy parsing that affects the rest of the application.

### Gemini AI Review + Embedding Model Configuration

The `google generative ai api key` is required because Gemini cannot be used without a real API credential, so there is no sensible default. The remaining settings have defaults so the application has a predictable configuration while still allowing them to be overridden when needed.

- **Review Model**: defaults to `gemini-2.5-flash`, while the **Embedding Model** defaults to `gemini-embedding-001`. Keeping the model names explicit prevents a provider side-default change from silently changing how reviews or embeddings behave.

- **Review Max Output Tokens**: limits how much output tokens Gemini can generate for a single code review. This keeps unusually long responses from consuming unnecessary context and resources.

- **Review Generate Text Timeout**: limits how long the application waits for a review generation request. This prevents a slow or stuck Gemini request from holding the review process indefinitely.

- **Embedding Output Dimensions**: defaults to 768 and must match the dimensions produced by the selected embedding model. This is part of the contract between the embedding model and the stored vectors, so changing it requires the existing embeddings to be regenerated.

- **Embedding Max Backoff**: sets the maximum delay used when retrying failed or rate limited embedding requests. The retries use exponential backoff with jitter, so concurrent embedding requests do not all retry at the same time and immediately trigger the same rate limit again.

The overall motive is to **keep AI behavior predictable and resource usage bounded**. Model choices are explicit, review generation has output and time limits, and embedding requests have controlled dimensions and retry behavior.

### AI Review Prompt and Context Budgets

These settings control how much information is included in an AI review. The limits keep the prompt within a predictable size while balancing review quality, token usage, and response latency.

- **Maximum Diff Characters**: limits how much of the pull request diff can be included in the review prompt. The default of 60,000 prevents unusually large diffs from consuming too much context.

- **Maximum Context Characters**: limits how much relevant code from the indexed repository can be added alongside the diff. The default of 40,000 keeps the additional context useful without allowing it to grow indefinitely.

- **Review Minimum Length**: sets the minimum response length required for an AI review to be considered valid. The default of 50 acts as a basic sanity check so empty, malformed, or refusal-like responses are not accepted as successful reviews. It is not intended to measure review quality.

- **Review Context Chunk Limit**: limits how many relevant code chunks can be included in a review. The default of 15 balances additional code context against higher token usage and latency.

The overall motive is to **treat prompt size as a controlled budget**. More diff and repository context can improve the review, but it also increases token usage, cost, and latency. Keeping these limits configurable also allows them to be adjusted without changing the code itself.

### Observability: Logging + Tracing

These settings control how the application logs events and where its OpenTelemetry traces are sent.

- **Log Level**: controls how much detail the application logger outputs. It defaults to `info`, which provides normal operational logs without producing excessive detail.
  - Using a fixed set of allowed values also means an invalid log level is caught during configuration validation instead of being handled unpredictably at runtime.

- **OpenTelemetry Exporter Endpoint**: defaults to `http://localhost:4318`, which allows local development to send traces to a local OpenTelemetry collector without additional configuration. In other environments, it can be overridden to point to the actual trace collector.

The overall motive is to **keep observability predictable and easy to configure**: logging verbosity can be adjusted when debugging, while trace destinations can change between local development and deployed environments without changing the application code.

### Site Public Base URL

The `next public app base url` defaults to `http://localhost:3000` and provides the application's public base URL. It is used for generating site metadata and Open Graph URLs, as well as building GitHub callback URLs.

- Unlike most runtime environment variables, this value is exposed to the client and is therefore **added into the application during the build**. Because of this, changing it only when the container starts will not update the value already included in the built client bundle.

The main motive is to **make the application's public URLs environment aware while keeping local development working by default**.

In deployments, the value needs to be set correctly before the application is built; otherwise, the application can continue generating incorrect localhost or old URLs even if the runtime environment variable has been changed.

### Cross-Cutting Observations

- **Consistent Numeric Validation**: numeric environment variables use `z.coerce.number().int().positive()` instead of manually converting values with `Number()` and checking them separately. This keeps validation consistent across the configuration layer and ensures invalid, zero, negative, or non-numeric values are rejected in the same way.

- **Required vs. Optional Configuration**: whether a value is required depends on whether there is a safe fallback, not simply on how important the value is.
  Database credentials, AI credentials, encryption keys, and GitHub OAuth credentials have no safe fallback, so they are required. Other values either have sensible defaults or are only required in specific environments, such as production.

- **Small, Independent Schemas**: configuration is split across multiple small schemas instead of one large environment schema.
  - This keeps unrelated configuration independent, so code that only needs one part of the application does not have to provide secrets or settings belonging to another part. It also makes configuration errors more focused and easier to understand.

- **Defaults Are Practical, Not Measured**: the repository explains the general reasoning behind most configuration values, but it does not provide evidence for why specific numbers were chosen.
  - Values such as request timeouts, concurrency limits, and character budgets appear to be reasonable starting points based on their intended tradeoffs rather than numbers derived from load tests, benchmarks, or incident data.
  - There is no evidence in the repository to justify more precise reasoning, so these values should not be presented as empirically optimized.
