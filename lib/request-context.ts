import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

interface RequestContext {
  requestId: string;
  userId?: string;
}

const storage = new AsyncLocalStorage<RequestContext>();

// Wrap a route handler / Inngest function body so every getLogger() call
// made anywhere in its call stack (without threading params manually)
// carries the same requestId. Pass an explicit requestId to correlate with
// an external id (e.g. an Inngest event id).
export function withRequestContext<T>(
  fn: () => Promise<T>,
  context: Partial<RequestContext> = {}
): Promise<T> {
  return storage.run(
    { requestId: context.requestId ?? randomUUID(), userId: context.userId },
    fn
  );
}

export function getRequestContext(): RequestContext | undefined {
  return storage.getStore();
}

// Attach a userId to the active request context once it's known (e.g.
// after loading the session), so subsequent log lines in the same request
// include it without re-fetching the session.
export function setContextUserId(userId: string): void {
  const ctx = storage.getStore();
  if (ctx) ctx.userId = userId;
}
