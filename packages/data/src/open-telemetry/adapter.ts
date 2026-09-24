import type {
  InputOutputData,
  TokenUsage,
  TraceReasoning,
  TraceTodo,
} from "@evilmartians/agent-prism-types";

import {
  INPUT_OUTPUT_ATTRIBUTES,
  OPENTELEMETRY_GENAI_ATTRIBUTES,
  type OpenTelemetryDocument,
  type OpenTelemetrySpan,
  type TraceSpan,
  type TraceSpanCategory,
  type TraceSpanStatus,
} from "@evilmartians/agent-prism-types";

import type { SpanAdapter } from "../types";

import { addReportedTotal, addTokenUsage } from "../common/token-usage.js";
import { categorizeOpenInference } from "./utils/categorize-open-inference.js";
import { categorizeOpenTelemetryGenAI } from "./utils/categorize-open-telemetry-gen-ai.js";
import { categorizeStandardOpenTelemetry } from "./utils/categorize-standard-open-telemetry.js";
import { convertNanoTimestampToDate } from "./utils/convert-nano-timestamp-to-date.js";
import { generateOpenTelemetrySpanTitle } from "./utils/generate-open-telemetry-span-title.js";
import { getOpenTelemetryAttributeValue } from "./utils/get-open-telemetry-attribute-value.js";
import { getOpenTelemetrySpanStandard } from "./utils/get-open-telemetry-span-standard.js";

const getNumberAttribute = (
  span: OpenTelemetrySpan,
  key: string,
): number | undefined => {
  const value = getOpenTelemetryAttributeValue(span, key);

  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
};

export const openTelemetrySpanAdapter: SpanAdapter<
  OpenTelemetryDocument,
  OpenTelemetrySpan
> = {
  convertRawDocumentsToSpans(
    documents: OpenTelemetryDocument | OpenTelemetryDocument[],
  ): TraceSpan[] {
    const docArray = Array.isArray(documents) ? documents : [documents];

    // Extract all spans from all documents, resource spans and scope spans
    const allSpans: OpenTelemetrySpan[] = [];

    docArray.forEach((document) => {
      document.resourceSpans.forEach((resourceSpan) => {
        resourceSpan.scopeSpans.forEach((scopeSpan) => {
          allSpans.push(...scopeSpan.spans);
        });
      });
    });

    // Convert the flat array of spans to a tree structure
    return this.convertRawSpansToSpanTree(allSpans);
  },

  convertRawSpansToSpanTree(spans: OpenTelemetrySpan[]): TraceSpan[] {
    const spanMap = new Map<string, TraceSpan>();
    const rootSpans: TraceSpan[] = [];

    // First pass: create all span objects
    spans.forEach((span) => {
      const convertedSpan = this.convertRawSpanToTraceSpan(span);
      spanMap.set(convertedSpan.id, convertedSpan);
    });

    // Second pass: build parent-child relationships
    spans.forEach((span) => {
      const convertedSpan = spanMap.get(span.spanId)!;
      const parentSpanId = span.parentSpanId;

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
    span: OpenTelemetrySpan,
    children: TraceSpan[] = [],
  ): TraceSpan {
    const ioData = this.getSpanInputOutput(span);

    return {
      id: span.spanId,
      title: generateOpenTelemetrySpanTitle(span),
      type: this.getSpanCategory(span),
      status: this.getSpanStatus(span),
      attributes: span.attributes,
      raw: [JSON.stringify(span, null, 2)],
      startTime: convertNanoTimestampToDate(span.startTimeUnixNano),
      endTime: convertNanoTimestampToDate(span.endTimeUnixNano),
      children,
      input: ioData.input,
      output: ioData.output,
      tokenUsage: this.getTokenUsage(span),
      reasoning: this.getTraceReasoning(span),
      todos: this.getTraceTodos(span),
    };
  },

  getTokenUsage(span: OpenTelemetrySpan): TokenUsage | undefined {
    const input = getNumberAttribute(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_TOKENS,
    );
    const output = getNumberAttribute(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_OUTPUT_TOKENS,
    );
    const inputCost = getNumberAttribute(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_COST,
    );
    const outputCost = getNumberAttribute(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_OUTPUT_COST,
    );

    // Per the GenAI semantic conventions, cache counts are part of
    // input_tokens; they are taken out of it so no token is counted twice.
    const cacheRead = getNumberAttribute(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_CACHE_READ_INPUT_TOKENS,
    );
    const cacheWrite = getNumberAttribute(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_CACHE_CREATION_INPUT_TOKENS,
    );

    let usage: TokenUsage = {};

    if (input !== undefined || inputCost !== undefined) {
      const uncachedInput = (input ?? 0) - (cacheRead ?? 0) - (cacheWrite ?? 0);

      usage = addTokenUsage(
        usage,
        "input",
        Math.max(uncachedInput, 0),
        inputCost,
      );
    }

    // Reasoning tokens stay inside output; getTraceReasoning reports them.
    if (output !== undefined || outputCost !== undefined) {
      usage = addTokenUsage(usage, "output", output ?? 0, outputCost);
    }

    if (cacheRead !== undefined) {
      usage = addTokenUsage(usage, "cache_read", cacheRead);
    }

    if (cacheWrite !== undefined) {
      usage = addTokenUsage(usage, "cache_write", cacheWrite);
    }

    usage = addReportedTotal(
      usage,
      getNumberAttribute(
        span,
        OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_TOTAL_TOKENS,
      ),
      getNumberAttribute(span, OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST),
    );

    return Object.keys(usage).length > 0 ? usage : undefined;
  },

  getTraceReasoning(span: OpenTelemetrySpan): TraceReasoning | undefined {
    const tokens = getNumberAttribute(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_REASONING_OUTPUT_TOKENS,
    );

    // The semantic conventions carry the reasoning token count, not the text.
    return tokens !== undefined ? { content: "", tokens } : undefined;
  },

  getTraceTodos(): TraceTodo[] | undefined {
    return undefined;
  },

  getSpanInputOutput(span: OpenTelemetrySpan): InputOutputData {
    const input = getOpenTelemetryAttributeValue(
      span,
      INPUT_OUTPUT_ATTRIBUTES.INPUT_VALUE,
    );
    const output = getOpenTelemetryAttributeValue(
      span,
      INPUT_OUTPUT_ATTRIBUTES.OUTPUT_VALUE,
    );

    return {
      input: typeof input === "string" ? input : undefined,
      output: typeof output === "string" ? output : undefined,
    };
  },

  getSpanStatus(span: OpenTelemetrySpan): TraceSpanStatus {
    switch (span.status.code) {
      case "STATUS_CODE_OK":
        return "success";
      case "STATUS_CODE_ERROR":
        return "error";
      default:
        return "warning";
    }
  },

  getSpanCategory(span: OpenTelemetrySpan): TraceSpanCategory {
    const standard = getOpenTelemetrySpanStandard(span);

    switch (standard) {
      case "opentelemetry_genai": {
        const category = categorizeOpenTelemetryGenAI(span);
        return category !== "unknown"
          ? category
          : categorizeStandardOpenTelemetry(span);
      }

      case "openinference": {
        const category = categorizeOpenInference(span);
        return category !== "unknown"
          ? category
          : categorizeStandardOpenTelemetry(span);
      }

      case "standard":
      default: {
        return categorizeStandardOpenTelemetry(span);
      }
    }
  },
};
