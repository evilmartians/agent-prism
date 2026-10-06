import type { ReadonlySpanNode } from "./readonly-span-node.js";

/**
 * Flattens a tree of TraceSpan objects into a single array
 * @param spans - Array of root spans that may contain children
 * @returns Flattened array of all spans
 */
export const flattenSpans = <Span extends ReadonlySpanNode<Span>>(
  spans: readonly Span[],
): Span[] => {
  const result: Span[] = [];

  const traverse = (items: readonly Span[]) => {
    items.forEach((item) => {
      result.push(item);
      if (item.children) {
        traverse(item.children);
      }
    });
  };

  traverse(spans);
  return result;
};
