import type { ComponentPropsWithRef, ReactElement } from "react";

import { ChevronsDownUp } from "lucide-react";

import { IconButton } from "./IconButton";

export type SpanCardCollapseAllButtonProps = ComponentPropsWithRef<"button"> & {
  onCollapseAll: () => void;
};

export const CollapseAllButton = ({
  "aria-label": ariaLabel = "Collapse all",
  onCollapseAll,
  ...rest
}: SpanCardCollapseAllButtonProps): ReactElement => {
  return (
    <IconButton
      aria-label={ariaLabel}
      onClick={onCollapseAll}
      size="6"
      {...rest}
    >
      <ChevronsDownUp className="size-3.5" />
    </IconButton>
  );
};
