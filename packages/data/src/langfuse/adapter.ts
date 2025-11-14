import type {
  InputOutputData,
  LangfuseDocument,
  LangfuseObservation,
  TraceSpan,
  TraceSpanCategory,
  TraceSpanStatus,
} from "@evilmartians/agent-prism-types";

import type { SpanAdapter } from "../types";

import { getLangfuseAttributes } from "./utils/get-langfuse-attributes.js";

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
    const duration = this.getSpanDuration(span);
    const status = this.getSpanStatus(span);
    const tokensCount = this.getSpanTokensCount(span);
    const cost = this.getSpanCost(span);
    const ioData = this.getSpanInputOutput(span);
    const type = this.getSpanCategory(span);
    const attributes = getLangfuseAttributes(span);

    return {
      id: span.id,
      title: span.name,
      type,
      status,
      attributes,
      duration,
      tokensCount,
      raw: JSON.stringify(span, null, 2),
      cost,
      startTime: new Date(span.startTime),
      endTime: new Date(span.endTime),
      children,
      input: ioData.input,
      output: ioData.output,
    };
  },
  getSpanDuration(span: LangfuseObservation): number {
    if (!span.endTime || !span.startTime) {
      return 0;
    }
    try {
      return (
        new Date(span.endTime).getTime() - new Date(span.startTime).getTime()
      );
    } catch {
      return 0;
    }
  },
  getSpanCost(span: LangfuseObservation): number {
    return span.costDetails?.total || 0;
  },
  getSpanTokensCount(span: LangfuseObservation): number {
    return span.usageDetails?.total || 0;
  },
  getSpanInputOutput(span: LangfuseObservation): InputOutputData {
    return {
      input: typeof span.input === "string" ? span.input : undefined,
      output: typeof span.output === "string" ? span.output : undefined,
    };
  },
  getSpanStatus(): TraceSpanStatus {
    return "success";
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
