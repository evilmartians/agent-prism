import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { buildSpanTree } from "./build-span-tree.js";
import { ROOT_WITH_CHILD, toIdTree } from "./test-utils/to-id-tree.js";

type RawSpan = { readonly id: string; readonly parentId?: string };

const accessors = {
  convert: ({ id }: RawSpan): TraceSpan => ({
    endTime: new Date(0),
    id,
    raw: [],
    startTime: new Date(0),
    status: "success",
    title: id,
    type: "span",
  }),
  getId: ({ id }: RawSpan) => id,
  getParentId: ({ parentId }: RawSpan) => parentId,
};

describe("buildSpanTree", () => {
  it("creates the children list on a parent that has none", () => {
    const tree = buildSpanTree<RawSpan>(
      [{ id: "root" }, { id: "child", parentId: "root" }],
      accessors,
    );

    expect(toIdTree(tree)).toStrictEqual(ROOT_WITH_CHILD);
  });

  it("skips a raw span whose converted id differs from its own", () => {
    const tree = buildSpanTree<RawSpan>([{ id: "root" }], {
      ...accessors,
      getId: () => "other",
    });

    expect(tree).toStrictEqual([]);
  });
});
