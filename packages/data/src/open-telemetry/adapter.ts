import type {
  DeepReadonly,
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

import type { SpanAdapter } from "../types.js";

import { reviveAttribute } from "../common/attribute-value.js";
import { buildSpanTree } from "../common/build-span-tree.js";
import { toList } from "../common/to-list.js";
import { addReportedTotal, addTokenUsage } from "../common/token-usage.js";
import { categorizeOpenInference } from "./utils/categorize-open-inference.js";
import { categorizeOpenTelemetryGenAI } from "./utils/categorize-open-telemetry-gen-ai.js";
import { categorizeStandardOpenTelemetry } from "./utils/categorize-standard-open-telemetry.js";
import { convertNanoTimestampToDate } from "./utils/convert-nano-timestamp-to-date.js";
import { generateOpenTelemetrySpanTitle } from "./utils/generate-open-telemetry-span-title.js";
import { getOpenTelemetryAttributeValue } from "./utils/get-open-telemetry-attribute-value.js";
import { getOpenTelemetrySpanStandard } from "./utils/get-open-telemetry-span-standard.js";

type ReadonlyOpenTelemetrySpan = DeepReadonly<OpenTelemetrySpan>;

const getNumberAttribute = (
  span: ReadonlyOpenTelemetrySpan,
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
    documents:
      | DeepReadonly<OpenTelemetryDocument>
      | readonly DeepReadonly<OpenTelemetryDocument>[],
  ): TraceSpan[] {
    const allSpans: ReadonlyOpenTelemetrySpan[] = [];

    toList(documents).forEach((document) => {
      document.resourceSpans.forEach((resourceSpan) => {
        resourceSpan.scopeSpans.forEach((scopeSpan) => {
          allSpans.push(...scopeSpan.spans);
        });
      });
    });

    return this.convertRawSpansToSpanTree(allSpans);
  },

  convertRawSpansToSpanTree(
    spans: readonly ReadonlyOpenTelemetrySpan[],
  ): TraceSpan[] {
    return buildSpanTree(spans, {
      convert: (span) => this.convertRawSpanToTraceSpan(span),
      getId: (span) => span.spanId,
      getParentId: (span) => span.parentSpanId,
    });
  },

  convertRawSpanToTraceSpan(span: ReadonlyOpenTelemetrySpan): TraceSpan {
    const ioData = this.getSpanInputOutput(span);

    return {
      attributes: span.attributes.flatMap(reviveAttribute),
      children: [],
      endTime: convertNanoTimestampToDate(span.endTimeUnixNano),
      id: span.spanId,
      input: ioData.input,
      output: ioData.output,
      raw: [JSON.stringify(span, null, 2)],
      reasoning: this.getTraceReasoning(span),
      startTime: convertNanoTimestampToDate(span.startTimeUnixNano),
      status: this.getSpanStatus(span),
      title: generateOpenTelemetrySpanTitle(span),
      todos: this.getTraceTodos(span),
      tokenUsage: this.getTokenUsage(span),
      type: this.getSpanCategory(span),
    };
  },

  getSpanCategory(span: ReadonlyOpenTelemetrySpan): TraceSpanCategory {
    const standard = getOpenTelemetrySpanStandard(span);

    if (standard === "openinference") {
      const category = categorizeOpenInference(span);
      return category !== "unknown"
        ? category
        : categorizeStandardOpenTelemetry(span);
    }

    if (standard === "opentelemetry_genai") {
      const category = categorizeOpenTelemetryGenAI(span);
      return category !== "unknown"
        ? category
        : categorizeStandardOpenTelemetry(span);
    }

    return categorizeStandardOpenTelemetry(span);
  },

  getSpanInputOutput(span: ReadonlyOpenTelemetrySpan): InputOutputData {
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

  getSpanStatus(span: ReadonlyOpenTelemetrySpan): TraceSpanStatus {
    switch (span.status.code) {
      case "STATUS_CODE_ERROR":
        return "error";
      case "STATUS_CODE_OK":
        return "success";
      case "STATUS_CODE_UNSET":
      case undefined:
      default:
        return "warning";
    }
  },

  /**
   * Per the GenAI semantic conventions, cache counts are part of input_tokens;
   * they are taken out of it so no token is counted twice. Reasoning tokens
   * stay inside output; getTraceReasoning reports them.
   */
  getTokenUsage(span: ReadonlyOpenTelemetrySpan): TokenUsage | undefined {
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

  /**
   * The semantic conventions carry the reasoning token count, not the text.
   * Non-reasoning calls often report 0, which is no reasoning to show.
   */
  getTraceReasoning(
    span: ReadonlyOpenTelemetrySpan,
  ): TraceReasoning | undefined {
    const tokens = getNumberAttribute(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_REASONING_OUTPUT_TOKENS,
    );

    return tokens !== undefined && tokens > 0
      ? { content: "", tokens }
      : undefined;
  },

  getTraceTodos(): TraceTodo[] | undefined {
    return undefined;
  },
};
