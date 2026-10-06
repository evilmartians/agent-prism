import type {
  InputOutputData,
  TokenUsage,
  TraceReasoning,
  TraceSpan,
  TraceSpanCategory,
  TraceSpanStatus,
  TraceTodo,
} from "@evilmartians/agent-prism-types";

export type SpanAdapter<TRawDocument, TRawSpan> = {
  convertRawDocumentsToSpans(
    documents: TRawDocument | TRawDocument[],
  ): TraceSpan[];

  convertRawSpansToSpanTree(spans: TRawSpan[]): TraceSpan[];

  convertRawSpanToTraceSpan(span: TRawSpan): TraceSpan;

  getSpanCategory(document: TRawSpan): TraceSpanCategory;

  getSpanInputOutput(document: TRawSpan): InputOutputData;

  getSpanStatus(document: TRawSpan): TraceSpanStatus;

  getTokenUsage(document: TRawSpan): TokenUsage | undefined;

  getTraceReasoning(document: TRawSpan): TraceReasoning | undefined;

  getTraceTodos(document: TRawSpan): TraceTodo[] | undefined;
};
