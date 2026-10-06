import { describe, expect, it } from "vitest";

import { buildSpanTree } from "./build-span-tree.js";
import { createTestSpan } from "./test-utils/create-test-span.js";

type RawSpan = { id: string; parentId?: string };

const accessors = {
  convert: ({ id }: RawSpan) => createTestSpan({ id }),
  getId: ({ id }: RawSpan) => id,
  getParentId: ({ parentId }: RawSpan) => parentId,
};

describe("buildSpanTree", () => {
  it("creates the children list on a parent that has none", () => {
    const tree = buildSpanTree<RawSpan>(
      [{ id: "root" }, { id: "child", parentId: "root" }],
      accessors,
    );

    expect(tree[0]?.children?.map((span) => span.id)).toStrictEqual(["child"]);
  });

  it("skips a raw span whose converted id differs from its own", () => {
    const tree = buildSpanTree<RawSpan>([{ id: "root" }], {
      ...accessors,
      getId: () => "other",
    });

    expect(tree).toStrictEqual([]);
  });
});
