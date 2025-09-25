// https://lucide.dev/icons/chevron-right

import type { ComponentPropsWithRef, ReactElement } from "react";

export type ChevronRightIconProps = ComponentPropsWithRef<"svg">;

export const ChevronRightIcon = ({
  className,
  ...props
}: ChevronRightIconProps): ReactElement => (
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
    <path d="m9 18 6-6-6-6" />
  </svg>
);
