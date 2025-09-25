// https://lucide.dev/icons/chevron-down

import type { ComponentPropsWithRef, ReactElement } from "react";

export type ChevronDownIconProps = ComponentPropsWithRef<"svg">;

export const ChevronDownIcon = ({
  className,
  ...props
}: ChevronDownIconProps): ReactElement => (
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
    <path d="m6 9 6 6 6-6" />
  </svg>
);
