import type { ComponentPropsWithRef, ReactElement } from "react";

import cn from "classnames";
import { GitBranch } from "lucide-react";

import { Badge } from "./Badge";

export type SidechainBadgeProps = ComponentPropsWithRef<"span">;

const SIDECHAIN_BADGE_CLASSES =
  "bg-agentprism-badge-sidechain text-agentprism-badge-sidechain-foreground";

export const SidechainBadge = ({
  className,
  ...rest
}: SidechainBadgeProps): ReactElement => {
  return (
    <Badge
      {...rest}
      label="Sidechain"
      size="4"
      unstyled
      iconStart={<GitBranch className="size-3" />}
      className={cn(SIDECHAIN_BADGE_CLASSES, className)}
    />
  );
};
