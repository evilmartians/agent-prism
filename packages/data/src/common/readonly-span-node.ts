import type { DeepReadonly, TraceSpan } from "@evilmartians/agent-prism-types";

/**
 * A span as a read-only helper sees it: any `TraceSpan`, mutable or
 * `DeepReadonly`, whose children are spans of the same type. Helpers that
 * return spans from their input take `Span extends ReadonlySpanNode<Span>`, so
 * they hand back the type they were given.
 */
export type ReadonlySpanNode<Span> = DeepReadonly<
  Omit<TraceSpan, "children">
> & {
  readonly children?: readonly Span[] | undefined;
};
