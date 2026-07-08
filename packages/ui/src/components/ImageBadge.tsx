import type { ComponentPropsWithRef, ReactElement } from "react";

import cn from "classnames";
import { Image } from "lucide-react";

import { Badge, type BadgeProps } from "./Badge";

export type ImageBadgeProps = ComponentPropsWithRef<"span"> & {
  count?: number;
  size?: BadgeProps["size"];
};

export const ImageBadge = ({
  count,
  size,
  className,
  ...rest
}: ImageBadgeProps): ReactElement => {
  const label = count && count > 1 ? `${count} Images` : "Image";

  return (
    <Badge
      unstyled
      iconStart={<Image className="size-3" />}
      size={size}
      {...rest}
      label={label}
      className={cn(
        "bg-agentprism-badge-tool text-agentprism-badge-tool-foreground",
        className,
      )}
    />
  );
};
