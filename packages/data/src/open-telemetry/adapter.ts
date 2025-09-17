import type { InputOutputData } from "@evilmartians/agent-prism-types";

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

import { categorizeOpenInference } from "./utils/categorize-open-inference";
import { categorizeOpenTelemetryGenAI } from "./utils/categorize-open-telemetry-gen-ai";
import { categorizeStandardOpenTelemetry } from "./utils/categorize-standard-open-telemetry";
import { convertNanoTimestampToDate } from "./utils/convert-nano-timestamp-to-date";
import { generateOpenTelemetrySpanTitle } from "./utils/generate-open-telemetry-span-title";
import { getOpenTelemetryAttributeValue } from "./utils/get-open-telemetry-attribute-value";
import { getOpenTelemetrySpanStandard } from "./utils/get-open-telemetry-span-standard";

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
    const duration = this.getSpanDuration(span);
    const status = this.getSpanStatus(span);
    const type = this.getSpanCategory(span);
    const tokensCount = this.getSpanTokensCount(span);
    const cost = this.getSpanCost(span);
    const ioData = this.getSpanInputOutput(span);
    const title = generateOpenTelemetrySpanTitle(span);

    return {
      id: span.spanId,
      title,
      type,
      status,
      attributes: span.attributes,
      duration,
      tokensCount,
      raw: JSON.stringify(span, null, 2),
      cost,
      startTime: convertNanoTimestampToDate(span.startTimeUnixNano),
      endTime: convertNanoTimestampToDate(span.endTimeUnixNano),
      children,
      input: ioData.input,
      output: ioData.output,
    };
  },

  getSpanDuration(span: OpenTelemetrySpan): number {
    // Convert string nanosecond timestamps to BigInt for precise arithmetic
    const startNano = BigInt(span.startTimeUnixNano);
    const endNano = BigInt(span.endTimeUnixNano);

    // Calculate duration in nanoseconds
    const durationNano = endNano - startNano;

    // Divide by 1_000_000 to get milliseconds
    return Number(durationNano / BigInt(1_000_000));
  },

  getSpanCost(span: OpenTelemetrySpan): number {
    const inputCost = getOpenTelemetryAttributeValue(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_COST,
    );

    const outputCost = getOpenTelemetryAttributeValue(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_OUTPUT_COST,
    );

    let totalCost = 0;

    if (typeof inputCost === "number") {
      totalCost += inputCost;
    }

    if (typeof outputCost === "number") {
      totalCost += outputCost;
    }

    // If both are missing, use fallback
    if (totalCost === 0) {
      const fallbackCost = getOpenTelemetryAttributeValue(
        span,
        "gen_ai.usage.cost",
      );

      if (typeof fallbackCost === "number") {
        totalCost = fallbackCost;
      }
    }

    return totalCost;
  },

  getSpanTokensCount(span: OpenTelemetrySpan): number {
    const totalTokens = getOpenTelemetryAttributeValue(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_TOTAL_TOKENS,
    );
    const inputTokens = getOpenTelemetryAttributeValue(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_TOKENS,
    );
    const outputTokens = getOpenTelemetryAttributeValue(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_OUTPUT_TOKENS,
    );

    if (typeof totalTokens === "number") {
      return totalTokens;
    }

    const input = typeof inputTokens === "number" ? inputTokens : 0;
    const output = typeof outputTokens === "number" ? outputTokens : 0;

    return input + output;
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
