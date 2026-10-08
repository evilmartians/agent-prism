import type { ReactElement } from "react";

import cn from "classnames";
import { Brain } from "lucide-react";

import type { ReadonlyProps } from "./ReadonlyProps";

import { Badge } from "./Badge";

export type ThinkingBadgeProps = {
  className?: string | undefined;
};

/**
 * Badge in the thinking colors. It renders Badge `unstyled`, since Badge's
 * default colors would otherwise override them.
 */
export const ThinkingBadge = ({
  className,
}: ReadonlyProps<ThinkingBadgeProps>): ReactElement => {
  return (
    <Badge
      className={cn(
        "bg-agentprism-badge-claude-thinking text-agentprism-badge-claude-thinking-foreground",
        className,
      )}
      iconStart={<Brain className="size-3" />}
      label="Thinking"
      size="4"
      unstyled
    />
  );
};
