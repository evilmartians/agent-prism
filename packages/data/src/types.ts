import type {
  InputOutputData,
  TokenUsage,
  TraceSpan,
  TraceSpanCategory,
  TraceReasoning,
  TraceSpanStatus,
  TraceTodo,
} from "@evilmartians/agent-prism-types";

export interface SpanAdapter<TRawDocument, TRawSpan> {
  convertRawDocumentsToSpans(
    documents: TRawDocument | TRawDocument[],
  ): TraceSpan[];

  convertRawSpansToSpanTree(spans: TRawSpan[]): TraceSpan[];

  convertRawSpanToTraceSpan(span: TRawSpan): TraceSpan;

  getTokenUsage(document: TRawSpan): TokenUsage | undefined;

  getTraceReasoning(document: TRawSpan): TraceReasoning | undefined;

  getTraceTodos(document: TRawSpan): TraceTodo[] | undefined;

  getSpanInputOutput(document: TRawSpan): InputOutputData;

  getSpanStatus(document: TRawSpan): TraceSpanStatus;

  getSpanCategory(document: TRawSpan): TraceSpanCategory;
}
