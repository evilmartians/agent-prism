import type { ComponentPropsWithRef, ReactElement } from "react";

import { ChevronsUpDown, ChevronsDownUp } from "lucide-react";

import { IconButton } from "./IconButton";

export type SpanCardExpandAllButtonProps = ComponentPropsWithRef<"button"> & {
  onExpandAll: () => void;
};

export type SpanCardCollapseAllButtonProps = ComponentPropsWithRef<"button"> & {
  onCollapseAll: () => void;
};

export const ExpandAllButton = ({
  onExpandAll,
  "aria-label": ariaLabel = "Expand all",
  ...rest
}: SpanCardExpandAllButtonProps): ReactElement => {
  return (
    <IconButton size="6" onClick={onExpandAll} aria-label={ariaLabel} {...rest}>
      <ChevronsUpDown className="size-3.5" />
    </IconButton>
  );
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
