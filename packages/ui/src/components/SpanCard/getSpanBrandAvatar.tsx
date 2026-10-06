import type { TraceSpan } from "@evilmartians/agent-prism-types";

import type { AvatarProps } from "../Avatar";

import { BrandLogo } from "../BrandLogo";

const readBrandType = (brand: unknown): string =>
  typeof brand === "object" &&
  brand !== null &&
  "type" in brand &&
  typeof brand.type === "string"
    ? brand.type
    : "";

export const getSpanBrandAvatar = (
  span: TraceSpan,
): AvatarProps | undefined => {
  const brand = span.metadata?.["brand"];
  const hasBrand = Boolean(brand);

  if (!hasBrand) return undefined;

  return {
    category: span.type,
    children: <BrandLogo brand={readBrandType(brand)} />,
    rounded: "sm",
    size: "4",
  };
};
