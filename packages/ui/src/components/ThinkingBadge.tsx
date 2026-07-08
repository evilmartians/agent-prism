import type { ReactElement } from "react";

import { Brain } from "lucide-react";

import { Badge } from "./Badge";

export interface ThinkingBadgeProps {
  className?: string;
}

export const ThinkingBadge = ({
  className,
}: ThinkingBadgeProps): ReactElement => {
  return (
    <Badge
      label="Thinking"
      size="4"
      iconStart={<Brain className="size-3" />}
      className={`bg-agentprism-badge-claude-thinking text-agentprism-badge-claude-thinking-foreground ${className || ""}`}
    />
  );
};
