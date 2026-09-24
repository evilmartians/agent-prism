import type { ReactElement } from "react";

import cn from "classnames";
import { Brain } from "lucide-react";

import { Badge } from "./Badge";

export interface ThinkingBadgeProps {
  className?: string;
}

export const ThinkingBadge = ({
  className,
}: ThinkingBadgeProps): ReactElement => {
  // `unstyled` drops Badge's default colors, which would otherwise override
  // the thinking tokens below.
  return (
    <Badge
      label="Thinking"
      size="4"
      iconStart={<Brain className="size-3" />}
      className={cn(
        "bg-agentprism-badge-claude-thinking text-agentprism-badge-claude-thinking-foreground",
        className,
      )}
      unstyled
    />
  );
};
