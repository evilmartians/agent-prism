import type { ComponentPropsWithRef } from "react";

import { DatabaseZap } from "lucide-react";

import type { BadgeProps } from "./Badge";

import { Badge } from "./Badge";

export type CachedTokensBadgeProps = ComponentPropsWithRef<"span"> & {
  tokens: number;
  size?: BadgeProps["size"];
};

/** Prompt-cache read token count — heavily discounted input the model reused. */
export const CachedTokensBadge = ({
  tokens,
  size,
  ...rest
}: CachedTokensBadgeProps) => {
  if (tokens <= 0) {
    return null;
  }

  return (
    <Badge
      iconStart={<DatabaseZap className="size-3 shrink-0" />}
      size={size}
      {...rest}
      label={`Cached ${tokens}`}
    />
  );
};
