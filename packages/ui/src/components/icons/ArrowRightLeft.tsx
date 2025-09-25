// https://lucide.dev/icons/arrow-right-left

import type { ComponentPropsWithRef, ReactElement } from "react";

export type ArrowRightLeftProps = ComponentPropsWithRef<"svg">;

export const ArrowRightLeft = ({
  className,
  ...props
}: ArrowRightLeftProps): ReactElement => (
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
    <path d="m16 3 4 4-4 4" />
    <path d="M20 7H4" />
    <path d="m8 21-4-4 4-4" />
    <path d="M4 17h16" />
  </svg>
);
