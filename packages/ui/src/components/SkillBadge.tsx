import type { ComponentPropsWithRef, ReactElement } from "react";

import cn from "classnames";
import { Sparkles } from "lucide-react";

import { Badge } from "./Badge";

export type SkillBadgeProps = ComponentPropsWithRef<"span"> & {
  skillName: string;
};

const SKILL_BADGE_CLASSES =
  "bg-agentprism-badge-skill text-agentprism-badge-skill-foreground";

export const SkillBadge = ({
  skillName,
  className,
  ...rest
}: SkillBadgeProps): ReactElement => {
  return (
    <Badge
      {...rest}
      label={skillName}
      size="4"
      unstyled
      iconStart={<Sparkles className="size-3" />}
      className={cn(SKILL_BADGE_CLASSES, className)}
    />
  );
};
