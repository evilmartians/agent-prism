import type { ComponentPropsWithRef, ReactElement } from "react";

import { getShortModelName } from "@evilmartians/agent-prism-data";
import cn from "classnames";
import { Cpu } from "lucide-react";

import { Badge } from "./Badge";

export type ModelBadgeProps = ComponentPropsWithRef<"span"> & {
  model: string;
};

const MODEL_BADGE_CLASSES =
  "bg-agentprism-secondary text-agentprism-secondary-foreground";

export const ModelBadge = ({
  model,
  className,
  ...rest
}: ModelBadgeProps): ReactElement => {
  const shortName = getShortModelName(model);

  return (
    <Badge
      {...rest}
      label={shortName}
      size="4"
      unstyled
      iconStart={<Cpu className="size-3" />}
      className={cn(MODEL_BADGE_CLASSES, className)}
    />
  );
};
