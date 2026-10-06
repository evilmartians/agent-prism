import type {
  DeepReadonly,
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
import { toList } from "../common/to-list.js";
import { addReportedTotal, addTokenUsage } from "../common/token-usage.js";
import { getLangfuseAttributes } from "./utils/get-langfuse-attributes.js";

type Details = Readonly<Record<string, null | number | undefined>>;

type DetailsEntry = readonly [string, null | number | undefined];

type ReadonlyObservation = DeepReadonly<LangfuseObservation>;

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
  convertRawDocumentsToSpans(
    documents:
      | DeepReadonly<LangfuseDocument>
      | readonly DeepReadonly<LangfuseDocument>[],
  ): TraceSpan[] {
    return this.convertRawSpansToSpanTree(
      toList(documents).flatMap((document) => document.observations),
    );
  },
  convertRawSpansToSpanTree(
    spans: readonly ReadonlyObservation[],
  ): TraceSpan[] {
    return buildSpanTree(spans, {
      convert: (span) => this.convertRawSpanToTraceSpan(span),
      getId: (span) => span.id,
      getParentId: (span) => span.parentObservationId,
    });
  },
  convertRawSpanToTraceSpan(span: ReadonlyObservation): TraceSpan {
    const ioData = this.getSpanInputOutput(span);

    return {
      attributes: getLangfuseAttributes(span),
      children: [],
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
  getSpanCategory(span: ReadonlyObservation): TraceSpanCategory {
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
  getSpanInputOutput(span: ReadonlyObservation): InputOutputData {
    return {
      input: typeof span.input === "string" ? span.input : undefined,
      output: typeof span.output === "string" ? span.output : undefined,
    };
  },
  getSpanStatus(span: ReadonlyObservation): TraceSpanStatus {
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
  getTokenUsage(span: ReadonlyObservation): TokenUsage | undefined {
    const usageDetails: Details = span.usageDetails ?? {
      input: span.inputUsage,
      output: span.outputUsage,
      total: span.totalUsage,
    };
    const costDetails: Details = span.costDetails ?? {
      input: span.inputCost,
      output: span.outputCost,
      total: span.totalCost,
    };

    let usage: TokenUsage = {};

    Object.entries(usageDetails).forEach(([key, tokens]: DetailsEntry) => {
      if (key !== "total" && typeof tokens === "number") {
        usage = addTokenUsage(usage, toTokenType(key), tokens);
      }
    });

    Object.entries(costDetails).forEach(([key, cost]: DetailsEntry) => {
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
  getTraceReasoning(span: ReadonlyObservation): TraceReasoning | undefined {
    const tokens = span.usageDetails?.output_reasoning_tokens;

    return typeof tokens === "number" && tokens !== 0
      ? { content: "", tokens }
      : undefined;
  },
  getTraceTodos(): TraceTodo[] | undefined {
    return undefined;
  },
};
