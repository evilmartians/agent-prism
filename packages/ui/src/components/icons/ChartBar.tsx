// https://lucide.dev/icons/chart-bar

import type { ComponentPropsWithRef, ReactElement } from "react";

export type ChartBarProps = ComponentPropsWithRef<"svg">;

export const ChartBar = ({
  className,
  ...props
}: ChartBarProps): ReactElement => (
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
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M7 16h8" />
    <path d="M7 11h12" />
    <path d="M7 6h3" />
  </svg>
);
