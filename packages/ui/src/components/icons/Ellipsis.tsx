// https://lucide.dev/icons/ellipsis

import type { ComponentPropsWithRef, ReactElement } from "react";

export type EllipsisIconProps = ComponentPropsWithRef<"svg">;

export const EllipsisIcon = ({
  className,
  ...props
}: EllipsisIconProps): ReactElement => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);
