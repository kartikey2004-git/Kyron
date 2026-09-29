import { trace, SpanStatusCode, type Attributes } from "@opentelemetry/api";

const tracer = trace.getTracer("kyron");

// Runs fn() inside a new active span named `name`, recording exceptions and
// setting an OK/ERROR status so failed spans are filterable in Tempo/Grafana
// without inspecting every trace by hand.
export async function withSpan<T>(
  name: string,
  fn: () => Promise<T>,
  attributes: Attributes = {}
): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    span.setAttributes(attributes);

    try {
      const result = await fn();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}
