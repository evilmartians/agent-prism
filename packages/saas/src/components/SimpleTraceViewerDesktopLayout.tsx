import {
  DetailsView,
  TraceViewerPlaceholder,
  TraceViewerTreeViewContainer,
  type TraceViewerLayoutProps,
} from "@evilmartians/agent-prism-ui";
// SimpleTraceViewerDesktopLayout.tsx
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export const SimpleTraceViewerDesktopLayout = ({
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
  return (
    <PanelGroup direction="horizontal" className="h-full">
      <Panel
        id="tree-view"
        defaultSize={60}
        minSize={40}
        className="flex h-full flex-col overflow-hidden pr-2" // Added pr-2 for spacing
      >
        <TraceViewerTreeViewContainer
          searchValue={searchValue!}
          setSearchValue={setSearchValue!}
          handleExpandAll={handleExpandAll!}
          handleCollapseAll={handleCollapseAll!}
          filteredSpans={filteredSpans!}
          selectedSpan={selectedSpan}
          setSelectedSpan={setSelectedSpan!}
          expandedSpansIds={expandedSpansIds!}
          setExpandedSpansIds={setExpandedSpansIds!}
          selectedTrace={selectedTrace}
          showHeader={false}
        />
      </Panel>
      <PanelResizeHandle className="mx-2" />{" "}
      {/* Added mx-2 for handle spacing */}
      <Panel
        id="details-view"
        defaultSize={40}
        minSize={20}
        maxSize={60}
        className="h-full overflow-hidden"
      >
        {selectedSpan ? (
          <DetailsView data={selectedSpan} />
        ) : (
          <TraceViewerPlaceholder title="Select a span to see the details" />
        )}
      </Panel>
    </PanelGroup>
  );
};
