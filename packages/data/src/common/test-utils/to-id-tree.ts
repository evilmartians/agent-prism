import type { DeepReadonly, TraceSpan } from "@evilmartians/agent-prism-types";

type IdTree = { children: IdTree[]; id: string };

/**
 * Reduces a span tree to its ids, so a test can assert the shape of the tree
 * an adapter built in one comparison.
 */
export const toIdTree = (spans: readonly DeepReadonly<TraceSpan>[]): IdTree[] =>
  spans.map(({ children = [], id }) => ({ children: toIdTree(children), id }));

/**
 * A root with a single child, as `toIdTree` reduces it: what the span-tree
 * builders should return for a root and its child, orphans dropped.
 */
export const ROOT_WITH_CHILD: IdTree[] = [
  { children: [{ children: [], id: "child" }], id: "root" },
];
