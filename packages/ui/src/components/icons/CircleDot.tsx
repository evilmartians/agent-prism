// https://lucide.dev/icons/circle-dot

import type { ComponentPropsWithRef, ReactElement } from "react";

export type CircleDotIconProps = ComponentPropsWithRef<"svg">;

export const CircleDotIcon = ({
  className,
  ...props
}: CircleDotIconProps): ReactElement => (
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
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);
