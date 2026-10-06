import type { ReactElement } from "react";

import { Search } from "lucide-react";

import type { ReadonlyProps } from "./ReadonlyProps";

import { TextInput, type TextInputProps } from "./TextInput";

/**
 * A simple wrapper around the TextInput component.
 * It adds a search icon and a placeholder.
 */
export const SearchInput = ({
  ...props
}: ReadonlyProps<TextInputProps>): ReactElement => {
  return (
    <TextInput
      placeholder="Filter..."
      startIcon={<Search className="size-4" />}
      {...props}
    />
  );
};
