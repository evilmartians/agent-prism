import type { ComponentPropsWithRef, ReactElement } from "react";

import { ChevronsDownUp } from "lucide-react";

import { IconButton } from "./IconButton";

export type SpanCardCollapseAllButtonProps = ComponentPropsWithRef<"button"> & {
  onCollapseAll: () => void;
};

export const CollapseAllButton = ({
  onCollapseAll,
  "aria-label": ariaLabel = "Collapse all",
  ...rest
}: SpanCardCollapseAllButtonProps): ReactElement => {
  return (
    <IconButton
      size="6"
      onClick={onCollapseAll}
      aria-label={ariaLabel}
      {...rest}
    >
      <ChevronsDownUp className="size-3.5" />
    </IconButton>
  );
};
