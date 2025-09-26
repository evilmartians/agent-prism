import type { TraceSpan } from "@evilmartians/agent-prism-types";

// Recursive filtering function that preserves a nested structure
export const filterSpansRecursively = (
  spans: TraceSpan[],
  searchValue: string,
): TraceSpan[] => {
  if (!searchValue.trim()) {
    return spans;
  }

  return spans
    .map((span) => {
      // Check if the current span matches
      const currentSpanMatches = span.title
        .toLowerCase()
        .includes(searchValue.toLowerCase());

      // Recursively filter children
      const filteredChildren = span.children
        ? filterSpansRecursively(span.children, searchValue)
        : undefined;

      // Check if any children match
      const hasMatchingChildren =
        filteredChildren && filteredChildren.length > 0;

      // Keep span if it matches or has matching children
      if (currentSpanMatches || hasMatchingChildren) {
        return {
          ...span,
          children: filteredChildren,
        };
      }

      // Filter out this span if neither it nor its children match
      return null;
    })
    .filter((span): span is NonNullable<typeof span> => span !== null);
};
