import { z } from "zod";
import { lazyConfig, parseEnv } from "./env";

// configures the connection to the application's PostgreSQL database.

const schema = z.object({
  // PostgreSQL connection URL used by Prisma to connect to the database.

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

export const getDatabaseConfig = lazyConfig(() => {
  // Validate the environment variables against the schema before using them.

  const env = parseEnv(schema);

  return {
    // Hosted PostgreSQL databases usually require SSL, so add sslmode=require, when the connection URL does not already specify an SSL mode.

    connectionString: env.DATABASE_URL.includes("sslmode=")
      ? env.DATABASE_URL
      : `${env.DATABASE_URL}?sslmode=require`,
  };
});

// SSL stands for Secure Sockets Layer. It is an older security technology used to create an encrypted link between a web server and a web browser.
