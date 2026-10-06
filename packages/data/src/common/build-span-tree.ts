import type { TraceSpan } from "@evilmartians/agent-prism-types";

type RawSpanAccessors<TRawSpan> = {
  convert: (span: TRawSpan) => TraceSpan;
  getId: (span: TRawSpan) => string;
  getParentId: (span: TRawSpan) => null | string | undefined;
};

/**
 * Converts raw spans and nests each one under its parent; spans without a
 * parent id become roots, spans whose parent is missing are dropped.
 */
export const buildSpanTree = <TRawSpan>(
  spans: readonly TRawSpan[],
  { convert, getId, getParentId }: Readonly<RawSpanAccessors<TRawSpan>>,
): TraceSpan[] => {
  const spanMap = new Map<string, TraceSpan>();
  const rootSpans: TraceSpan[] = [];

  spans.forEach((span) => {
    const convertedSpan = convert(span);
    spanMap.set(convertedSpan.id, convertedSpan);
  });

  spans.forEach((span) => {
    const convertedSpan = spanMap.get(getId(span));
    if (!convertedSpan) return;
    const parentSpanId = getParentId(span) ?? "";

    if (parentSpanId !== "") {
      const parent = spanMap.get(parentSpanId);
      if (parent) {
        parent.children ??= [];
        parent.children.push(convertedSpan);
      }
    } else {
      rootSpans.push(convertedSpan);
    }
  });

  return rootSpans;
};
