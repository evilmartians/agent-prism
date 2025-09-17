import type { InputOutputData } from "@evilmartians/agent-prism-types";

import {
  INPUT_OUTPUT_ATTRIBUTES,
  OPENINFERENCE_ATTRIBUTES,
  OPENINFERENCE_MAPPINGS,
  OPENTELEMETRY_GENAI_ATTRIBUTES,
  OPENTELEMETRY_GENAI_MAPPINGS,
  STANDARD_OPENTELEMETRY_ATTRIBUTES,
  STANDARD_OPENTELEMETRY_PATTERNS,
  type OpenTelemetryDocument,
  type OpenTelemetrySpan,
  type OpenTelemetryStandard,
  type TraceSpan,
  type TraceSpanCategory,
  type TraceSpanStatus,
} from "@evilmartians/agent-prism-types";

import { SpanAdapter } from "../common/adapter";

export class OpenTelemetrySpanAdapter extends SpanAdapter<
  OpenTelemetryDocument,
  OpenTelemetrySpan
> {
  convertDocumentsToSpans(
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
    return this.convertSpansToSpanTree(allSpans);
  }

  convertSpansToSpanTree = (spans: OpenTelemetrySpan[]): TraceSpan[] => {
    const spanMap = new Map<string, TraceSpan>();
    const rootSpans: TraceSpan[] = [];

    // First pass: create all span objects
    spans.forEach((span) => {
      const convertedSpan = this.convertOTelSpanToTraceSpan(span);
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
  };

  convertOTelSpanToTraceSpan = (
    span: OpenTelemetrySpan,
    children: TraceSpan[] = [],
  ): TraceSpan => {
    const duration = this.getSpanDuration(span);
    const status = this.getSpanStatus(span);
    const spanType = this.getSpanCategory(span);
    const tokensCount = this.getSpanTokensCount(span);
    const cost = this.getSpanCost(span);
    const ioData = this.getSpanInputOutput(span);
    const title = this.generateSpanTitle(span);

    return {
      id: span.spanId,
      title,
      type: spanType,
      status,
      attributes: span.attributes,
      duration,
      tokensCount,
      raw: JSON.stringify(span, null, 2),
      cost,
      startTime: this.convertNanoTimestampToDate(span.startTimeUnixNano),
      endTime: this.convertNanoTimestampToDate(span.endTimeUnixNano),
      children,
      input: ioData.input,
      output: ioData.output,
    };
  };

  convertNanoTimestampToDate(nanoString: string): Date {
    const nanoseconds = BigInt(nanoString);
    const milliseconds = Number(nanoseconds / 1_000_000n);

    return new Date(milliseconds);
  }

  generateSpanTitle(span: OpenTelemetrySpan): string {
    const { name } = span;

    // For LLM operations, use model name
    const model = this.getAttributeValue(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL,
    );

    if (model) {
      return `${model} - ${name}`;
    }

    // For vector DB operations, use collection name
    const collection = this.getAttributeValue(
      span,
      STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_COLLECTION,
    );
    const operation = this.getAttributeValue(
      span,
      STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_OPERATION,
    );

    if (collection && operation) {
      return `${collection} - ${operation}`;
    }

    // For HTTP operations, use method and URL
    const method = this.getAttributeValue(
      span,
      STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD,
    );
    const url = this.getAttributeValue(
      span,
      STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_URL,
    );

    if (method && url) {
      return `${method} ${url}`;
    }

    return name;
  }

  getSpanDuration(span: OpenTelemetrySpan): number {
    // Convert string nanosecond timestamps to BigInt for precise arithmetic
    const startNano = BigInt(span.startTimeUnixNano);
    const endNano = BigInt(span.endTimeUnixNano);

    // Calculate duration in nanoseconds
    const durationNano = endNano - startNano;

    // Divide by 1_000_000 to get milliseconds
    return Number(durationNano / BigInt(1_000_000));
  }

  getSpanCost(span: OpenTelemetrySpan): number {
    const inputCost = this.getAttributeValue(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_COST,
    );

    const outputCost = this.getAttributeValue(
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
      const fallbackCost = this.getAttributeValue(span, "gen_ai.usage.cost");

      if (typeof fallbackCost === "number") {
        totalCost = fallbackCost;
      }
    }

    return totalCost;
  }

  getSpanTokensCount(span: OpenTelemetrySpan): number {
    const totalTokens = this.getAttributeValue(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_TOTAL_TOKENS,
    );
    const inputTokens = this.getAttributeValue(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_TOKENS,
    );
    const outputTokens = this.getAttributeValue(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_OUTPUT_TOKENS,
    );

    if (typeof totalTokens === "number") {
      return totalTokens;
    }

    const input = typeof inputTokens === "number" ? inputTokens : 0;
    const output = typeof outputTokens === "number" ? outputTokens : 0;

    return input + output;
  }

  getAttributeValue(
    span: OpenTelemetrySpan,
    key: string,
  ): string | number | boolean | undefined {
    const attr = span.attributes.find((a) => a.key === key);

    if (!attr) {
      return undefined;
    }

    const { value } = attr;

    if (value.stringValue !== undefined) {
      return value.stringValue;
    }

    if (value.intValue !== undefined) {
      return parseFloat(value.intValue);
    }

    if (value.boolValue !== undefined) {
      return value.boolValue;
    }

    return undefined;
  }

  getSpanInputOutput(span: OpenTelemetrySpan): InputOutputData {
    const input = this.getAttributeValue(
      span,
      INPUT_OUTPUT_ATTRIBUTES.INPUT_VALUE,
    );
    const output = this.getAttributeValue(
      span,
      INPUT_OUTPUT_ATTRIBUTES.OUTPUT_VALUE,
    );

    return {
      input: typeof input === "string" ? input : undefined,
      output: typeof output === "string" ? output : undefined,
    };
  }

  getSpanStatus(span: OpenTelemetrySpan): TraceSpanStatus {
    switch (span.status.code) {
      case "STATUS_CODE_OK":
        return "success";
      case "STATUS_CODE_ERROR":
        return "error";
      default:
        return "warning";
    }
  }

  getSpanCategory(span: OpenTelemetrySpan): TraceSpanCategory {
    const standard = this.getSpanStandard(span);

    switch (standard) {
      case "opentelemetry_genai": {
        const category = this.categorizeOpenTelemetryGenAI(span);
        return category !== "unknown"
          ? category
          : this.categorizeStandardOpenTelemetry(span);
      }

      case "openinference": {
        const category = this.categorizeOpenInference(span);
        return category !== "unknown"
          ? category
          : this.categorizeStandardOpenTelemetry(span);
      }

      case "standard":
      default: {
        return this.categorizeStandardOpenTelemetry(span);
      }
    }
  }

  getSpanStandard(span: OpenTelemetrySpan): OpenTelemetryStandard {
    // Check for OpenTelemetry GenAI attributes
    if (
      this.getAttributeValue(
        span,
        OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME,
      ) ||
      this.getAttributeValue(span, OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM)
    ) {
      return "opentelemetry_genai";
    }

    // Check for OpenInference attributes
    if (
      this.getAttributeValue(span, OPENINFERENCE_ATTRIBUTES.SPAN_KIND) ||
      this.getAttributeValue(span, OPENINFERENCE_ATTRIBUTES.LLM_MODEL)
    ) {
      return "openinference";
    }

    // Default to standard OpenTelemetry
    return "standard";
  }

  categorizeOpenTelemetryGenAI(span: OpenTelemetrySpan): TraceSpanCategory {
    const operationName = this.getAttributeValue(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME,
    );

    if (typeof operationName === "string") {
      const category = OPENTELEMETRY_GENAI_MAPPINGS[operationName];

      if (category) return category;
    }

    return "unknown";
  }

  categorizeOpenInference(span: OpenTelemetrySpan): TraceSpanCategory {
    const spanKind = this.getAttributeValue(
      span,
      OPENINFERENCE_ATTRIBUTES.SPAN_KIND,
    );

    if (typeof spanKind === "string") {
      const category = OPENINFERENCE_MAPPINGS[spanKind];

      if (category) return category;
    }

    return "unknown";
  }

  categoryMappers = {
    isHttpCall: (span: OpenTelemetrySpan): boolean => {
      return (
        this.getAttributeValue(
          span,
          STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD,
        ) !== undefined
      );
    },

    isDatabaseCall: (span: OpenTelemetrySpan): boolean => {
      return (
        this.getAttributeValue(
          span,
          STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM,
        ) !== undefined
      );
    },

    isFunctionCall: (span: OpenTelemetrySpan): boolean => {
      const name = span.name.toLowerCase();

      return (
        STANDARD_OPENTELEMETRY_PATTERNS.FUNCTION_KEYWORDS.some((keyword) =>
          name.includes(keyword),
        ) ||
        this.getAttributeValue(
          span,
          STANDARD_OPENTELEMETRY_ATTRIBUTES.FUNCTION_NAME,
        ) !== undefined
      );
    },

    isLLMCall: (span: OpenTelemetrySpan): boolean => {
      const name = span.name.toLowerCase();

      return STANDARD_OPENTELEMETRY_PATTERNS.LLM_KEYWORDS.some((keyword) =>
        name.includes(keyword),
      );
    },

    isChainOperation: (span: OpenTelemetrySpan): boolean => {
      const name = span.name.toLowerCase();

      return STANDARD_OPENTELEMETRY_PATTERNS.CHAIN_KEYWORDS.some((keyword) =>
        name.includes(keyword),
      );
    },

    isAgentOperation: (span: OpenTelemetrySpan): boolean => {
      const name = span.name.toLowerCase();

      return STANDARD_OPENTELEMETRY_PATTERNS.AGENT_KEYWORDS.some((keyword) =>
        name.includes(keyword),
      );
    },

    isRetrievalOperation: (span: OpenTelemetrySpan): boolean => {
      const name = span.name.toLowerCase();

      return STANDARD_OPENTELEMETRY_PATTERNS.RETRIEVAL_KEYWORDS.some(
        (keyword) => name.includes(keyword),
      );
    },
  };

  categorizeStandardOpenTelemetry = (
    span: OpenTelemetrySpan,
  ): TraceSpanCategory => {
    const mappers = this.categoryMappers;

    // Priority order for detection
    if (mappers.isLLMCall(span)) return "llm_call";
    if (mappers.isAgentOperation(span)) return "agent_invocation";
    if (mappers.isChainOperation(span)) return "chain_operation";
    if (mappers.isRetrievalOperation(span)) return "retrieval";
    if (mappers.isFunctionCall(span)) return "tool_execution";
    if (mappers.isHttpCall(span)) return "tool_execution";
    if (mappers.isDatabaseCall(span)) return "tool_execution";

    return "unknown";
  };
}

export const openTelemetrySpanAdapter = new OpenTelemetrySpanAdapter();
