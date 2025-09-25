// https://lucide.dev/icons/move-horizontal

import type { ComponentPropsWithRef, ReactElement } from "react";

export type MoveHorizontalIconProps = ComponentPropsWithRef<"svg">;

export const MoveHorizontalIcon = ({
  className,
  ...props
}: MoveHorizontalIconProps): ReactElement => (
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
    <path d="m18 8 4 4-4 4" />
    <path d="M2 12h20" />
    <path d="m6 8-4 4 4 4" />
  </svg>
);
