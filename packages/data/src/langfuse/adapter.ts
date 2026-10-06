import type {
  InputOutputData,
  LangfuseDocument,
  LangfuseObservation,
  TokenType,
  TokenUsage,
  TraceReasoning,
  TraceSpan,
  TraceSpanCategory,
  TraceSpanStatus,
  TraceTodo,
} from "@evilmartians/agent-prism-types";

import type { SpanAdapter } from "../types.js";

import { buildSpanTree } from "../common/build-span-tree.js";
import { addReportedTotal, addTokenUsage } from "../common/token-usage.js";
import { getLangfuseAttributes } from "./utils/get-langfuse-attributes.js";

/**
 * Langfuse usage keys that name one of the canonical token types; any other key
 * is kept as is. Langfuse splits reasoning out of output, so it is folded back
 * in: `output` then matches the provider's own count, and the reasoning share is
 * reported on `TraceSpan.reasoning` instead.
 */
const LANGFUSE_TOKEN_TYPES: Record<string, TokenType> = {
  cache_creation_input_tokens: "cache_write",
  cache_read_input_tokens: "cache_read",
  input_cached_tokens: "cache_read",
  output_reasoning_tokens: "output",
};

const toTokenType = (key: string): TokenType =>
  LANGFUSE_TOKEN_TYPES[key] ?? key;

export const langfuseSpanAdapter: SpanAdapter<
  LangfuseDocument,
  LangfuseObservation
> = {
  convertRawDocumentsToSpans(documents: LangfuseDocument[]): TraceSpan[] {
    const docArray = Array.isArray(documents) ? documents : [documents];

    const allObservations: LangfuseObservation[] = [];

    docArray.forEach((document) => {
      document.observations.forEach((observation) => {
        allObservations.push(observation);
      });
    });

    return this.convertRawSpansToSpanTree(allObservations);
  },
  convertRawSpansToSpanTree(spans: LangfuseObservation[]): TraceSpan[] {
    return buildSpanTree(spans, {
      convert: (span) => this.convertRawSpanToTraceSpan(span),
      getId: (span) => span.id,
      getParentId: (span) => span.parentObservationId,
    });
  },
  convertRawSpanToTraceSpan(
    span: LangfuseObservation,
    children: TraceSpan[] = [],
  ): TraceSpan {
    const ioData = this.getSpanInputOutput(span);

    return {
      attributes: getLangfuseAttributes(span),
      children,
      endTime: new Date(span.endTime ?? span.startTime),
      id: span.id,
      input: ioData.input,
      output: ioData.output,
      raw: [JSON.stringify(span, null, 2)],
      reasoning: this.getTraceReasoning(span),
      startTime: new Date(span.startTime),
      status: this.getSpanStatus(span),
      title: span.name,
      todos: this.getTraceTodos(span),
      tokenUsage: this.getTokenUsage(span),
      type: this.getSpanCategory(span),
    };
  },
  getSpanCategory(span: LangfuseObservation): TraceSpanCategory {
    switch (span.type) {
      case "AGENT":
        return "agent_invocation";
      case "CHAIN":
        return "chain_operation";
      case "EMBEDDING":
        return "embedding";
      case "EVENT":
        return "event";
      case "GENERATION":
        return "llm_call";
      case "GUARDRAIL":
        return "guardrail";
      case "RETRIEVER":
        return "retrieval";
      case "SPAN":
        return "span";
      case "TOOL":
        return "tool_execution";
      case "EVALUATOR":
      case undefined:
      case "UNKNOWN":
      default:
        return "unknown";
    }
  },
  getSpanInputOutput(span: LangfuseObservation): InputOutputData {
    return {
      input: typeof span.input === "string" ? span.input : undefined,
      output: typeof span.output === "string" ? span.output : undefined,
    };
  },
  getSpanStatus(span: LangfuseObservation): TraceSpanStatus {
    switch (span.level) {
      case "ERROR":
        return "error";
      case "WARNING":
        return "warning";
      case "DEBUG":
      case "DEFAULT":
      case undefined:
      default:
        return "success";
    }
  },
  /**
   * Reads usageDetails and costDetails. The flat input/output/total fields are
   * sums Langfuse derives from them, so they are read only when an observation
   * comes without the details.
   */
  getTokenUsage(span: LangfuseObservation): TokenUsage | undefined {
    const usageDetails: Record<string, null | number | undefined> =
      span.usageDetails ?? {
        input: span.inputUsage,
        output: span.outputUsage,
        total: span.totalUsage,
      };
    const costDetails: Record<string, null | number | undefined> =
      span.costDetails ?? {
        input: span.inputCost,
        output: span.outputCost,
        total: span.totalCost,
      };

    let usage: TokenUsage = {};

    Object.entries(usageDetails).forEach(([key, tokens]) => {
      if (key !== "total" && typeof tokens === "number") {
        usage = addTokenUsage(usage, toTokenType(key), tokens);
      }
    });

    Object.entries(costDetails).forEach(([key, cost]) => {
      if (key !== "total" && typeof cost === "number") {
        usage = addTokenUsage(usage, toTokenType(key), 0, cost);
      }
    });

    usage = addReportedTotal(
      usage,
      usageDetails["total"] ?? undefined,
      costDetails["total"] ?? undefined,
    );

    return Object.keys(usage).length > 0 ? usage : undefined;
  },
  /** Langfuse records how many tokens went to reasoning, but not the text. */
  getTraceReasoning(span: LangfuseObservation): TraceReasoning | undefined {
    const tokens = span.usageDetails?.output_reasoning_tokens;

    return tokens !== undefined && tokens !== 0
      ? { content: "", tokens }
      : undefined;
  },
  getTraceTodos(): TraceTodo[] | undefined {
    return undefined;
  },
};
