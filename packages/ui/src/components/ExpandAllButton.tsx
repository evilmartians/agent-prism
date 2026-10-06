import type { ComponentPropsWithRef, ReactElement } from "react";

import { ChevronsUpDown } from "lucide-react";

import { IconButton } from "./IconButton";

export type SpanCardExpandAllButtonProps = ComponentPropsWithRef<"button"> & {
  onExpandAll: () => void;
};

export const ExpandAllButton = ({
  "aria-label": ariaLabel = "Expand all",
  onExpandAll,
  ...rest
}: SpanCardExpandAllButtonProps): ReactElement => {
  return (
    <IconButton aria-label={ariaLabel} onClick={onExpandAll} size="6" {...rest}>
      <ChevronsUpDown className="size-3.5" />
    </IconButton>
  );
};
