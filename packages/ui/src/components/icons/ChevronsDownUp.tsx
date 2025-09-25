// https://lucide.dev/icons/chevrons-down-up

import type { ComponentPropsWithRef, ReactElement } from "react";

export type ChevronsDownUpIconProps = ComponentPropsWithRef<"svg">;

export const ChevronsDownUpIcon = ({
  className,
  ...props
}: ChevronsDownUpIconProps): ReactElement => (
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
    <path d="m7 20 5-5 5 5" />
    <path d="m7 4 5 5 5-5" />
  </svg>
);
