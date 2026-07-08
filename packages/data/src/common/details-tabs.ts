import type { TraceSpan } from "@evilmartians/agent-prism-types";

/**
 * Tab-decision helpers for DetailsView, extracted so they can be unit-tested.
 * Narrowed to the fields they read; DetailsView passes a full TraceSpan. Each is
 * a presence guard, so a non-Claude span shows no Claude tabs (cross-vendor safe).
 */
type SpanTabData = Pick<TraceSpan, "attributes" | "input" | "output">;

export function hasThinkingContent(data: SpanTabData): boolean {
  return (
    data.attributes?.some((attr) => attr.key === "claude_code.thinking") ??
    false
  );
}

/**
 * Context tab presence. Kept claude_code-only on purpose: an upstream guard also
 * fired on `gen_ai.usage.input_tokens`, which would grow a Context tab on any plain
 * OTLP/Langfuse LLM span. We key on the Claude context attributes the transcoder
 * emits (cumulative_tokens / context_fill_percent) so it stays vendor-safe.
 */
export function hasContextContent(data: SpanTabData): boolean {
  return (
    data.attributes?.some(
      (attr) =>
        attr.key === "claude_code.cumulative_tokens" ||
        attr.key === "claude_code.context_fill_percent",
    ) ?? false
  );
}
