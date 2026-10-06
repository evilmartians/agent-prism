import type { TraceSpan } from "@evilmartians/agent-prism-types";

import type { AvatarProps } from "../Avatar";

import { BrandLogo } from "../BrandLogo";

export const getSpanBrandAvatar = (
  span: TraceSpan,
): AvatarProps | undefined => {
  const brand = span.metadata?.["brand"] as undefined | { type: string };

  if (!brand) return undefined;

  return {
    category: span.type,
    children: <BrandLogo brand={brand.type} />,
    rounded: "sm",
    size: "4",
  };
};
