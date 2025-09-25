// https://lucide.dev/icons/square-terminal

import type { ComponentPropsWithRef, ReactElement } from "react";

export type SquareTerminalIconProps = ComponentPropsWithRef<"svg">;

export const SquareTerminalIcon = ({
  className,
  ...props
}: SquareTerminalIconProps): ReactElement => (
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
    <path d="m7 11 2-2-2-2" />
    <path d="M11 13h4" />
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
  </svg>
);
