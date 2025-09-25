// https://lucide.dev/icons/arrow-left

import type { ComponentPropsWithRef, ReactElement } from "react";

export type ArrowLeftIconProps = ComponentPropsWithRef<"svg">;

export const ArrowLeftIcon = ({
  className,
  ...props
}: ArrowLeftIconProps): ReactElement => (
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
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);
