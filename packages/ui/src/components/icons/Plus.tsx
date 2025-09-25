// https://lucide.dev/icons/plus

import type { ComponentPropsWithRef, ReactElement } from "react";

export type PlusProps = ComponentPropsWithRef<"svg">;

export const Plus = ({ className, ...props }: PlusProps): ReactElement => (
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
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);
