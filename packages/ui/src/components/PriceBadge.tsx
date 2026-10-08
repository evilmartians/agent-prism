import type { ComponentPropsWithRef, ReactElement } from "react";

import type { BadgeProps } from "./Badge";
import type { ReadonlyProps } from "./ReadonlyProps";

import { Badge } from "./Badge";

export type PriceBadgeProps = ComponentPropsWithRef<"span"> & {
  cost: number;
  size?: BadgeProps["size"];
};

export const PriceBadge = ({
  cost,
  size,
  ...rest
}: ReadonlyProps<PriceBadgeProps>): ReactElement => {
  return <Badge size={size} {...rest} label={`$ ${cost}`} />;
};
