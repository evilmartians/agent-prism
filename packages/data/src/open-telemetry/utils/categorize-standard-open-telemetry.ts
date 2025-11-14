import type {
  OpenTelemetrySpan,
  TraceSpanCategory,
} from "@evilmartians/agent-prism-types";

import { openTelemetryCategoryMappers } from "./open-telemetry-category-mappers.js";

export function categorizeStandardOpenTelemetry(
  span: OpenTelemetrySpan,
): TraceSpanCategory {
  // Priority order for detection
  if (openTelemetryCategoryMappers.isLLMCall(span)) return "llm_call";
  if (openTelemetryCategoryMappers.isAgentOperation(span))
    return "agent_invocation";
  if (openTelemetryCategoryMappers.isChainOperation(span))
    return "chain_operation";
  if (openTelemetryCategoryMappers.isRetrievalOperation(span))
    return "retrieval";
  if (openTelemetryCategoryMappers.isFunctionCall(span))
    return "tool_execution";
  if (openTelemetryCategoryMappers.isHttpCall(span)) return "tool_execution";
  if (openTelemetryCategoryMappers.isDatabaseCall(span))
    return "tool_execution";

  return "unknown";
}
