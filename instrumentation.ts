// Next.js auto-loads and calls this at server startup (no next.config flag
// needed on Next.js 15+). Guarded to the Node runtime because this file is
// also evaluated (but not executed) for the Edge runtime, which can't load
// these packages.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { NodeSDK } = await import("@opentelemetry/sdk-node");
  const { getNodeAutoInstrumentations } = await import(
    "@opentelemetry/auto-instrumentations-node"
  );
  const { OTLPTraceExporter } = await import(
    "@opentelemetry/exporter-trace-otlp-http"
  );
  const { resourceFromAttributes } = await import("@opentelemetry/resources");
  const { ATTR_SERVICE_NAME } = await import(
    "@opentelemetry/semantic-conventions"
  );

  const otlpBase =
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "http://localhost:4318";

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: "kyron",
    }),
    traceExporter: new OTLPTraceExporter({
      url: `${otlpBase}/v1/traces`,
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        // Noisy and not useful here — every static asset / wasm grammar
        // read would otherwise become a span.
        "@opentelemetry/instrumentation-fs": { enabled: false },
      }),
    ],
  });

  sdk.start();
}
