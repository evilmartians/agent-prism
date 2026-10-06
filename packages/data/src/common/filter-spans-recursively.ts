import type { TraceSpan } from "@evilmartians/agent-prism-types";

/**
 * Keeps the spans whose title contains `searchValue`, case-insensitively, and
 * the ancestors of such spans, preserving the nested structure.
 */
export const filterSpansRecursively = (
  spans: TraceSpan[],
  searchValue: string,
): TraceSpan[] => {
  if (!searchValue.trim()) {
    return spans;
  }

  return spans
    .map((span) => {
      const currentSpanMatches = span.title
        .toLowerCase()
        .includes(searchValue.toLowerCase());

      const filteredChildren = span.children
        ? filterSpansRecursively(span.children, searchValue)
        : undefined;

      const hasMatchingChildren =
        filteredChildren && filteredChildren.length > 0;

      if (currentSpanMatches || hasMatchingChildren) {
        return {
          ...span,
          children: filteredChildren,
        };
      }

      return null;
    })
    .filter((span): span is NonNullable<typeof span> => span !== null);
};
