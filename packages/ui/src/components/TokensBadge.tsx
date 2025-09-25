import type { ComponentPropsWithRef } from "react";

import { Badge, type BadgeProps } from "./Badge";
import { CoinsIcon } from "./icons";

export type TokensBadgeProps = ComponentPropsWithRef<"span"> & {
  tokensCount: number;
  size?: BadgeProps["size"];
};

export const TokensBadge = ({
  tokensCount,
  size = "xs",
  ...rest
}: TokensBadgeProps) => {
  return (
    <Badge
      iconStart={<CoinsIcon className="size-2.5" />}
      theme="gray"
      size={size}
      {...rest}
      label={tokensCount}
    />
  );
};
