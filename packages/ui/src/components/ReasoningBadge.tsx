import type { ComponentPropsWithRef } from "react";

import { Brain } from "lucide-react";

import type { BadgeProps } from "./Badge";

import { Badge } from "./Badge";

export type ReasoningBadgeProps = ComponentPropsWithRef<"span"> & {
  tokens: number;
  size?: BadgeProps["size"];
};

/** Reasoning / thinking token count (Codex o-series, extended thinking). */
export const ReasoningBadge = ({
  tokens,
  size,
  ...rest
}: ReasoningBadgeProps) => {
  if (tokens <= 0) {
    return null;
  }

  return (
    <Badge
      iconStart={<Brain className="size-3 shrink-0" />}
      size={size}
      {...rest}
      label={`Reasoning ${tokens}`}
    />
  );
};
