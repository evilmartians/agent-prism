import type { ReactElement } from "react";

export const PerplexityLogo = ({
  className,
}: {
  className?: string | undefined;
}): ReactElement => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.913.5v10.203L23.413 5.5zm-3.826 0L.587 5.5l9.5 5.203zm0 23L.587 18.5l9.5-5.203zm3.826 0v-10.203L23.413 18.5z" />
  </svg>
);
