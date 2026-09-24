import type {
  InputOutputData,
  LangfuseDocument,
  LangfuseObservation,
  TokenType,
  TokenUsage,
  TraceSpan,
  TraceSpanCategory,
  TraceReasoning,
  TraceSpanStatus,
  TraceTodo,
} from "@evilmartians/agent-prism-types";

import type { SpanAdapter } from "../types";

import { addReportedTotal, addTokenUsage } from "../common/token-usage.js";
import { getLangfuseAttributes } from "./utils/get-langfuse-attributes.js";

/**
 * Langfuse usage keys that name one of the canonical token types; any other key
 * is kept as is. Langfuse splits reasoning out of output, so it is folded back
 * in: `output` then matches the provider's own count, and the reasoning share is
 * reported on `TraceSpan.reasoning` instead.
 */
const LANGFUSE_TOKEN_TYPES: Record<string, TokenType> = {
  input_cached_tokens: "cache_read",
  cache_read_input_tokens: "cache_read",
  cache_creation_input_tokens: "cache_write",
  output_reasoning_tokens: "output",
};

const toTokenType = (key: string): TokenType =>
  LANGFUSE_TOKEN_TYPES[key] ?? key;

export const langfuseSpanAdapter: SpanAdapter<
  LangfuseDocument,
  LangfuseObservation
> = {
  convertRawDocumentsToSpans(documents: LangfuseDocument[]): TraceSpan[] {
    // Handle both single document and array of documents
    const docArray = Array.isArray(documents) ? documents : [documents];

    // Extract all spans from all documents, resource spans and scope spans
    const allObservations: LangfuseObservation[] = [];

    docArray.forEach((document) => {
      document.observations.forEach((observation) => {
        allObservations.push(observation);
      });
    });

    // Convert the flat array of spans to a tree structure
    return this.convertRawSpansToSpanTree(allObservations);
  },
  convertRawSpansToSpanTree(spans: LangfuseObservation[]): TraceSpan[] {
    const spanMap = new Map<string, TraceSpan>();
    const rootSpans: TraceSpan[] = [];

    // First pass: create all span objects
    spans.forEach((span) => {
      const convertedSpan = this.convertRawSpanToTraceSpan(span);
      spanMap.set(convertedSpan.id, convertedSpan);
    });

    // Second pass: build parent-child relationships
    spans.forEach((span) => {
      const convertedSpan = spanMap.get(span.id)!;
      const parentSpanId = span.parentObservationId;

      if (parentSpanId) {
        const parent = spanMap.get(parentSpanId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(convertedSpan);
        }
      } else {
        rootSpans.push(convertedSpan);
      }
    });

    return rootSpans;
  },
  convertRawSpanToTraceSpan(
    span: LangfuseObservation,
    children: TraceSpan[] = [],
  ): TraceSpan {
    const ioData = this.getSpanInputOutput(span);

    return {
      id: span.id,
      title: span.name,
      type: this.getSpanCategory(span),
      status: this.getSpanStatus(span),
      attributes: getLangfuseAttributes(span),
      raw: [JSON.stringify(span, null, 2)],
      startTime: new Date(span.startTime),
      // Langfuse leaves endTime null while an observation is still running.
      endTime: new Date(span.endTime ?? span.startTime),
      children,
      input: ioData.input,
      output: ioData.output,
      tokenUsage: this.getTokenUsage(span),
      reasoning: this.getTraceReasoning(span),
      todos: this.getTraceTodos(span),
    };
  },
  getTokenUsage(span: LangfuseObservation): TokenUsage | undefined {
    // The flat input/output/total fields are sums Langfuse derives from the
    // details, so they are read only when an observation comes without them.
    const usageDetails: Record<string, number | null | undefined> =
      span.usageDetails ?? {
        input: span.inputUsage,
        output: span.outputUsage,
        total: span.totalUsage,
      };
    const costDetails: Record<string, number | null | undefined> =
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
      usageDetails.total ?? undefined,
      costDetails.total ?? undefined,
    );

    return Object.keys(usage).length > 0 ? usage : undefined;
  },
  getTraceReasoning(span: LangfuseObservation): TraceReasoning | undefined {
    const tokens = span.usageDetails?.output_reasoning_tokens;

    // Langfuse records how many tokens went to reasoning, but not the text.
    return tokens ? { content: "", tokens } : undefined;
  },
  getTraceTodos(): TraceTodo[] | undefined {
    return undefined;
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
      default:
        return "success";
    }
  },
  getSpanCategory(span: LangfuseObservation): TraceSpanCategory {
    switch (span.type) {
      case "SPAN":
        return "span";
      case "TOOL":
        return "tool_execution";
      case "GENERATION":
        return "llm_call";
      case "EVENT":
        return "event";
      case "AGENT":
        return "agent_invocation";
      case "CHAIN":
        return "chain_operation";
      case "RETRIEVER":
        return "retrieval";
      case "EMBEDDING":
        return "embedding";
      case "GUARDRAIL":
        return "guardrail";
      case "UNKNOWN":
        return "unknown";
      default:
        return "unknown";
    }
  },
};
