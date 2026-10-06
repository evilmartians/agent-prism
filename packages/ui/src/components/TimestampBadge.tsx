import type { ComponentPropsWithRef, ReactElement } from "react";

import type { BadgeProps } from "./Badge";

import { Badge } from "./Badge";

export type TimestampBadgeProps = ComponentPropsWithRef<"span"> & {
  size?: BadgeProps["size"];
  timestamp: number;
};

export const TimestampBadge = ({
  size,
  timestamp,
  ...rest
}: TimestampBadgeProps): ReactElement => {
  return <Badge size={size} {...rest} label={formatTimestamp(timestamp)} />;
};

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}
