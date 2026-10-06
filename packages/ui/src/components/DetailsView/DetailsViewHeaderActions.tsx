import type { ReactElement, ReactNode } from "react";

export type DetailsViewHeaderActionsProps = {
  /**
   * Custom actions to render in the header
   */
  children?: ReactNode | undefined;
  /**
   * Optional className for the actions container
   */
  className?: string | undefined;
};

export const DetailsViewHeaderActions = ({
  children,
  className = "flex flex-wrap items-center gap-2",
}: DetailsViewHeaderActionsProps): null | ReactElement => {
  if (!children) return null;

  return <div className={className}>{children}</div>;
};
