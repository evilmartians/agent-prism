import type { ComponentPropsWithRef, ReactElement } from "react";

import { ChevronsUpDown } from "lucide-react";

import { IconButton } from "./IconButton";

export type SpanCardExpandAllButtonProps = ComponentPropsWithRef<"button"> & {
  onExpandAll: () => void;
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
