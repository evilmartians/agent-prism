import {
  Button,
  DetailsView,
  TraceViewerTreeViewContainer,
} from "@evilmartians/agent-prism-ui";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import type { SimpleTraceViewerLayoutProps } from "@/types";

export const SimpleTraceViewerMobileLayout = ({
  expandedSpansIds,
  filteredSpans,
  handleCollapseAll,
  handleExpandAll,
  searchValue,
  selectedSpan,
  selectedTrace,
  selectedTraceSpans,
  setExpandedSpansIds,
  setSearchValue,
  setSelectedSpan,
}: SimpleTraceViewerLayoutProps) => {
  const [showDetails, setShowDetails] = useState(false);

  // Details view
  if (showDetails && selectedSpan) {
    return (
      <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
        <Button
          className="self-start"
          iconStart={<ArrowLeft className="size-3" />}
          onClick={() => {
            setShowDetails(false);
          }}
          variant="ghost"
        >
          Tree View
        </Button>
        <DetailsView allSpans={selectedTraceSpans} data={selectedSpan} />
      </div>
    );
  }

  // Tree view
  return (
    <div className="flex h-full flex-col gap-4">
      <TraceViewerTreeViewContainer
        expandedSpansIds={expandedSpansIds}
        filteredSpans={filteredSpans}
        handleCollapseAll={handleCollapseAll}
        handleExpandAll={handleExpandAll}
        searchValue={searchValue}
        selectedSpan={selectedSpan}
        selectedTrace={selectedTrace}
        setExpandedSpansIds={setExpandedSpansIds}
        setSearchValue={setSearchValue}
        setSelectedSpan={(span) => {
          setSelectedSpan(span);
          if (span) setShowDetails(true);
        }}
        showHeader={false}
      />
    </div>
  );
};
