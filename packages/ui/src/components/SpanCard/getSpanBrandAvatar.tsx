import type { TraceSpan } from "@evilmartians/agent-prism-types";

import type { AvatarProps } from "../Avatar";

import { BrandLogo } from "../BrandLogo";

export const getSpanBrandAvatar = (
  span: TraceSpan,
): AvatarProps | undefined => {
  const brand = span.metadata?.["brand"] as { type: string } | undefined;

  if (!brand) return undefined;

  return {
    children: <BrandLogo brand={brand.type} />,
    size: "4",
    rounded: "sm",
    category: span.type,
  };
};
