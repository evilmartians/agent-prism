import type { TraceSpan } from "@evilmartians/agent-prism-types";

type IdTree = { children: IdTree[]; id: string };

/**
 * Reduces a span tree to its ids, so a test can assert the shape of the tree
 * an adapter built in one comparison.
 */
export const toIdTree = (spans: TraceSpan[]): IdTree[] =>
  spans.map(({ children = [], id }) => ({ children: toIdTree(children), id }));

/**
 * The tree an adapter should build from a root, its child and an orphan whose
 * parent is missing: the orphan is dropped.
 */
export const ROOT_WITH_CHILD: IdTree[] = [
  { children: [{ children: [], id: "child" }], id: "root" },
];
