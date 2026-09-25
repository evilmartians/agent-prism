import type { ComponentPropsWithRef, ReactElement } from "react";

import cn from "classnames";
import { Database } from "lucide-react";

import { Badge } from "./Badge";

export type CacheBadgeProps = ComponentPropsWithRef<"span"> & {
  hitRatio: number;
};

const CACHE_BADGE_CLASSES =
  "bg-agentprism-badge-cache text-agentprism-badge-cache-foreground";

export const CacheBadge = ({
  hitRatio,
  className,
  ...rest
}: CacheBadgeProps): ReactElement => {
  const percentage = Math.round(hitRatio * 100);

  return (
    <Badge
      {...rest}
      label={`Cache ${percentage}%`}
      size="4"
      unstyled
      iconStart={<Database className="size-3" />}
      className={cn(CACHE_BADGE_CLASSES, className)}
    />
  );
};
