// https://lucide.dev/icons/chevrons-up-down

import type { ComponentPropsWithRef, ReactElement } from "react";

export type ChevronsUpDownIconProps = ComponentPropsWithRef<"svg">;

export const ChevronsUpDownIcon = ({
  className,
  ...props
}: ChevronsUpDownIconProps): ReactElement => (
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
    <path d="m7 15 5 5 5-5" />
    <path d="m7 9 5-5 5 5" />
  </svg>
);
