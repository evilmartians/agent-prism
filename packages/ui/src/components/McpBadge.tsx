import type { ComponentPropsWithRef, ReactElement } from "react";

import cn from "classnames";
import { Plug } from "lucide-react";

import { Badge } from "./Badge";

export type McpBadgeProps = ComponentPropsWithRef<"span"> & {
  servers?: string;
};

const MCP_BADGE_CLASSES =
  "bg-agentprism-badge-mcp text-agentprism-badge-mcp-foreground";

export const McpBadge = ({
  servers,
  className,
  ...rest
}: McpBadgeProps): ReactElement => {
  const label = servers ? `MCP: ${servers}` : "MCP";

  return (
    <Badge
      {...rest}
      label={label}
      size="4"
      unstyled
      iconStart={<Plug className="size-3" />}
      className={cn(MCP_BADGE_CLASSES, className)}
    />
  );
};
