import type { ReactElement } from "react";

import { CollapseAllButton } from "../CollapseAllButton";
import { ExpandAllButton } from "../ExpandAllButton";
import { SearchInput } from "../SearchInput";
import { type TraceViewerLayoutProps } from "./TraceViewer";

export const TraceViewerSearchAndControls = ({
  handleCollapseAll,
  handleExpandAll,
  searchValue,
  setSearchValue,
}: Readonly<
  Pick<
    TraceViewerLayoutProps,
    "handleCollapseAll" | "handleExpandAll" | "searchValue" | "setSearchValue"
  >
>): ReactElement => (
  <div className="flex shrink-0 items-center justify-between gap-3 px-4 pb-2 pt-1">
    <SearchInput
      id="trace-span-search"
      onChange={(e) => {
        setSearchValue(e.target.value);
      }}
      placeholder="Search spans"
      value={searchValue}
    />
    <div className="flex items-center gap-2">
      <ExpandAllButton onExpandAll={handleExpandAll} />
      <CollapseAllButton onCollapseAll={handleCollapseAll} />
    </div>
  </div>
);
