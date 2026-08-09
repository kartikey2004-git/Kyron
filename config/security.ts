import { z } from "zod";
import { lazyConfig, parseEnv } from "./env";

// configuration contain secrets used by different parts of the application, each secret has its own schema so required configuration is not coupled to optional configuration used by other endpoints.

const tokenEncryptionSchema = z.object({
  // Required key used to encrypt and decrypt GitHub tokens stored by the application.

  TOKEN_ENCRYPTION_KEY: z
    .string()
    .min(1, "TOKEN_ENCRYPTION_KEY is not configured"),
});

// Read the key only when encryption or decryption is actually needed , this allows tests and unrelated parts of the application to load without requiring the encryption key during module import.

export const getTokenEncryptionKey = lazyConfig(
  () => parseEnv(tokenEncryptionSchema).TOKEN_ENCRYPTION_KEY
);

const webhookSecretSchema = z.object({
  // secret used to verify incoming GitHub webhook requests.

  GITHUB_WEBHOOK_SECRET: z.string().min(1).optional(),
});

export const getGithubWebhookSecret = lazyConfig(
  () => parseEnv(webhookSecretSchema).GITHUB_WEBHOOK_SECRET
);

const metricsTokenSchema = z.object({
  // token used to authenticate requests to the metrics endpoint.

  METRICS_TOKEN: z.string().min(1).optional(),
});

export const getMetricsToken = lazyConfig(
  () => parseEnv(metricsTokenSchema).METRICS_TOKEN
);
