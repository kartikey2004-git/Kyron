import { z } from "zod";
import { lazyConfig, parseEnv } from "./env";

// config which controls application logging and OpenTelemetry trace exporting.

const schema = z.object({
  // Controls how much information the server logger outputs.

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),

  // Endpoint where OpenTelemetry traces are sent.
  OTEL_EXPORTER_OTLP_ENDPOINT: z
    .string()
    .min(1)
    .default("http://localhost:4318"),
});

export const getObservabilityConfig = lazyConfig(() => {
  // Validate the environment variables against the schema before using them.

  const env = parseEnv(schema);

  return {
    logLevel: env.LOG_LEVEL,
    otlpEndpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT,
  };
});
