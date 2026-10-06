import type { ReadonlySpanNode } from "./readonly-span-node.js";

/**
 * Keeps the spans whose title contains `searchValue`, case-insensitively, and
 * the ancestors of such spans, preserving the nested structure.
 */
export const filterSpansRecursively = <Span extends ReadonlySpanNode<Span>>(
  spans: readonly Span[],
  searchValue: string,
): Span[] => {
  if (!searchValue.trim()) {
    return [...spans];
  }

  return spans.flatMap((span) => {
    const currentSpanMatches = span.title
      .toLowerCase()
      .includes(searchValue.toLowerCase());

    const filteredChildren = span.children
      ? filterSpansRecursively(span.children, searchValue)
      : undefined;

    const hasMatchingChildren =
      filteredChildren !== undefined && filteredChildren.length > 0;

    return currentSpanMatches || hasMatchingChildren
      ? [{ ...span, children: filteredChildren }]
      : [];
  });
};
