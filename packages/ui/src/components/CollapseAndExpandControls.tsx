import type { ComponentPropsWithRef } from "react";

import { IconButton } from "./IconButton.tsx";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "./icons";

export type SpanCardExpandAllButtonProps = ComponentPropsWithRef<"button"> & {
  onExpandAll: () => void;
};

export type SpanCardCollapseAllButtonProps = ComponentPropsWithRef<"button"> & {
  onCollapseAll: () => void;
};

export const ExpandAllButton = ({
  onExpandAll,
  ...rest
}: SpanCardExpandAllButtonProps) => {
  return (
    <IconButton onClick={onExpandAll} aria-label="Expand all" {...rest}>
      <ChevronsUpDownIcon className="size-3.5" />
    </IconButton>
  );
};

export const CollapseAllButton = ({
  onCollapseAll,
  ...rest
}: SpanCardCollapseAllButtonProps) => {
  return (
    <IconButton onClick={onCollapseAll} aria-label="Collapse all" {...rest}>
      <ChevronsDownUpIcon className="size-3.5" />
    </IconButton>
  );
};
