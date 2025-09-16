import type { TraceSpan } from "@evilmartians/agent-prism-types";

/**
 * Flattens a tree of TraceSpan objects into a single array
 * @param spans - Array of root spans that may contain children
 * @returns Flattened array of all spans
 */
export const flattenSpans = (spans: TraceSpan[]): TraceSpan[] => {
  const result: TraceSpan[] = [];

  const traverse = (items: TraceSpan[]) => {
    items.forEach((item) => {
      result.push(item);
      if (item.children?.length) {
        traverse(item.children);
      }
    });
  };

  traverse(spans);
  return result;
};
