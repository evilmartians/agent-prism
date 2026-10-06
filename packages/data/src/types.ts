import type {
  DeepReadonly,
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
    documents:
      | DeepReadonly<TRawDocument>
      | readonly DeepReadonly<TRawDocument>[],
  ): TraceSpan[];

  convertRawSpansToSpanTree(
    spans: readonly DeepReadonly<TRawSpan>[],
  ): TraceSpan[];

  convertRawSpanToTraceSpan(span: DeepReadonly<TRawSpan>): TraceSpan;

  getSpanCategory(document: DeepReadonly<TRawSpan>): TraceSpanCategory;

  getSpanInputOutput(document: DeepReadonly<TRawSpan>): InputOutputData;

  getSpanStatus(document: DeepReadonly<TRawSpan>): TraceSpanStatus;

  getTokenUsage(document: DeepReadonly<TRawSpan>): TokenUsage | undefined;

  getTraceReasoning(
    document: DeepReadonly<TRawSpan>,
  ): TraceReasoning | undefined;

  getTraceTodos(document: DeepReadonly<TRawSpan>): TraceTodo[] | undefined;
};
