import type { ComponentPropsWithRef, ReactElement } from "react";

import { Coins } from "lucide-react";

import type { BadgeProps } from "./Badge";

import { Badge } from "./Badge";

export type TokensBadgeProps = ComponentPropsWithRef<"span"> & {
  size?: BadgeProps["size"];
  tokensCount: number;
};

export const TokensBadge = ({
  size,
  tokensCount,
  ...rest
}: TokensBadgeProps): ReactElement => {
  return (
    <Badge
      iconStart={<Coins className="size-2.5" />}
      size={size}
      {...rest}
      label={tokensCount}
    />
  );
};
