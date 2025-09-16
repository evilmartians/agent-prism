import type {
  TraceSpan,
  TraceSpanStatus,
} from "@evilmartians/agent-prism-types";
import type { InputOutputData } from "@evilmartians/agent-prism-types";

// Abstract class for converting data from different sources (OTLP, Langfuse, etc.) to our format (TraceSpan)
export abstract class SpanAdapter<TDocument, TSpan> {
  constructor() {}

  abstract convertDocumentsToSpans(
    documents: TDocument | TDocument[],
  ): TraceSpan[];

  abstract getSpanDuration(document: TSpan): number;

  abstract getSpanCost(document: TSpan): number;

  abstract getSpanTokensCount(document: TSpan): number;

  abstract getSpanInputOutput(document: TSpan): InputOutputData;

  abstract getSpanStatus(document: TSpan): TraceSpanStatus;
}
