import { z } from "zod";
import { lazyConfig, parseEnv } from "./env";

// config defines the application's public base URL. It is used for metadata and for building URLs that point back to the app.

const schema = z.object({
  // Public URL used when generating application and GitHub callback URLs.

  NEXT_PUBLIC_APP_BASE_URL: z.string().min(1).default("http://localhost:3000"),
});

export const getSiteConfig = lazyConfig(() => {
  // Validate the environment variable against the schema before using it

  const env = parseEnv(schema);

  return { baseUrl: env.NEXT_PUBLIC_APP_BASE_URL };
});
