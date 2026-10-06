import type { ReactElement } from "react";

export const AnthropicLogo = ({
  className,
}: {
  className?: string | undefined;
}): ReactElement => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 2.694h5.97l-9.204 18.612h-5.97L15.5 2.694zm-7.112 0h5.515l-9.177 18.612H0L8.388 2.694z" />
  </svg>
);
