import {
  Button,
  DetailsView,
  TraceViewerTreeViewContainer,
  type TraceViewerLayoutProps,
} from "@evilmartians/agent-prism-ui";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export const SimpleTraceViewerMobileLayout = ({
  selectedTrace,
  selectedSpan,
  setSelectedSpan,
  searchValue,
  setSearchValue,
  filteredSpans,
  expandedSpansIds,
  setExpandedSpansIds,
  handleExpandAll,
  handleCollapseAll,
}: Partial<TraceViewerLayoutProps>) => {
  const [showDetails, setShowDetails] = useState(false);

  // Details view
  if (showDetails && selectedSpan) {
    return (
      <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
        <Button
          onClick={() => {
            setShowDetails(false);
          }}
          iconStart={<ArrowLeft className="size-3" />}
          variant="ghost"
          className="self-start"
        >
          Tree View
        </Button>
        <DetailsView data={selectedSpan} />
      </div>
    );
  }

  // Tree view
  return (
    <div className="flex h-full flex-col gap-4">
      <TraceViewerTreeViewContainer
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleExpandAll={handleExpandAll}
        handleCollapseAll={handleCollapseAll}
        filteredSpans={filteredSpans}
        selectedSpan={selectedSpan}
        setSelectedSpan={(span) => {
          setSelectedSpan(span);
          if (span) setShowDetails(true);
        }}
        expandedSpansIds={expandedSpansIds}
        setExpandedSpansIds={setExpandedSpansIds}
        selectedTrace={selectedTrace}
        showHeader={false}
      />
    </div>
  );
};
