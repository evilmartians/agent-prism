import type { ReactElement } from "react";

import type { ReadonlyProps } from "../ReadonlyProps";

import { Badge } from "../Badge";
import { TraceListItemHeader } from "../TraceList/TraceListItemHeader";
import { TreeView } from "../TreeView";
import {
  type TraceRecordWithDisplayData,
  type TraceViewerLayoutProps,
} from "./TraceViewer";
import { TraceViewerSearchAndControls } from "./TraceViewerSearchAndControls";

export const TraceViewerTreeViewContainer = ({
  expandedSpansIds,
  filteredSpans,
  handleCollapseAll,
  handleExpandAll,
  searchValue,
  selectedSpan,
  selectedTrace,
  setExpandedSpansIds,
  setSearchValue,
  setSelectedSpan,
  showHeader = true,
  spanCardViewOptions,
}: ReadonlyProps<
  Pick<
    TraceViewerLayoutProps,
    | "expandedSpansIds"
    | "filteredSpans"
    | "handleCollapseAll"
    | "handleExpandAll"
    | "searchValue"
    | "selectedSpan"
    | "setExpandedSpansIds"
    | "setSearchValue"
    | "setSelectedSpan"
    | "spanCardViewOptions"
  > & {
    selectedTrace?: TraceRecordWithDisplayData | undefined;
    showHeader?: boolean | undefined;
  }
>): ReactElement => (
  <>
    {showHeader && selectedTrace ? (
      <div className="flex shrink-0 gap-2 px-4">
        <TraceListItemHeader trace={selectedTrace} />

        <div className="flex flex-wrap items-center gap-2">
          {selectedTrace.badges?.map((badge, index) => (
            <Badge key={index} label={badge.label} size="4" />
          ))}
        </div>
      </div>
    ) : null}

    <div className="bg-agentprism-background flex min-h-0 flex-1 flex-col overflow-hidden rounded-md">
      <TraceViewerSearchAndControls
        handleCollapseAll={handleCollapseAll}
        handleExpandAll={handleExpandAll}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {filteredSpans.length === 0 ? (
          <div className="text-agentprism-muted-foreground p-3 text-center">
            No spans found
          </div>
        ) : (
          <TreeView
            expandedSpansIds={expandedSpansIds}
            onExpandSpansIdsChange={setExpandedSpansIds}
            onSpanSelect={setSelectedSpan}
            selectedSpan={selectedSpan}
            spanCardViewOptions={spanCardViewOptions}
            spans={filteredSpans}
          />
        )}
      </div>
    </div>
  </>
);
