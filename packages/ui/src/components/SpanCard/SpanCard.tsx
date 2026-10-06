import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { FC, KeyboardEvent, MouseEvent } from "react";

import {
  formatDuration,
  getTimelineData,
} from "@evilmartians/agent-prism-data";
import * as Collapsible from "@radix-ui/react-collapsible";
import cn from "classnames";
import { useCallback } from "react";

import type { AvatarProps } from "../Avatar";
import type { SpanCardConnectorType } from "./SpanCardConnector";

import { Avatar } from "../Avatar";
import { SpanStatus } from "../SpanStatus";
import { getSpanBrandAvatar } from "./getSpanBrandAvatar";
import { SpanCardBadges } from "./SpanCardBadges";
import { SpanCardConnector } from "./SpanCardConnector";
import { SpanCardTimeline } from "./SpanCardTimeline";
import { SpanCardToggle } from "./SpanCardToggle";

const LAYOUT_CONSTANTS = {
  CONNECTOR_WIDTH: 20,
  CONTENT_BASE_WIDTH: 320,
} as const;

type ExpandButtonPlacement = "inside" | "outside";

export type SpanCardViewOptions = {
  withStatus?: boolean | undefined;
  expandButton?: ExpandButtonPlacement | undefined;
};

const DEFAULT_VIEW_OPTIONS = {
  withStatus: true,
  expandButton: "inside",
} satisfies Required<SpanCardViewOptions>;

type SpanCardProps = {
  data: TraceSpan;
  level?: number | undefined;
  selectedSpan?: TraceSpan | undefined;
  avatar?: AvatarProps | undefined;
  onSpanSelect?: ((span: TraceSpan) => void) | undefined;
  minStart: number;
  maxEnd: number;
  isLastChild: boolean;
  prevLevelConnectors?: SpanCardConnectorType[] | undefined;
  expandedSpansIds: string[];
  onExpandSpansIdsChange: (ids: string[]) => void;
  viewOptions?: SpanCardViewOptions | undefined;
};

type SpanCardState = {
  isExpanded: boolean;
  hasChildren: boolean;
  isSelected: boolean;
};

const getContentWidth = ({
  level,
  hasExpandButton,
  contentPadding,
  expandButton,
}: {
  level: number;
  hasExpandButton: boolean;
  contentPadding: number;
  expandButton: ExpandButtonPlacement;
}) => {
  let width =
    LAYOUT_CONSTANTS.CONTENT_BASE_WIDTH -
    level * LAYOUT_CONSTANTS.CONNECTOR_WIDTH;

  if (hasExpandButton && expandButton === "inside") {
    width -= LAYOUT_CONSTANTS.CONNECTOR_WIDTH;
  }

  if (expandButton === "outside" && level === 0) {
    width -= LAYOUT_CONSTANTS.CONNECTOR_WIDTH;
  }

  return width - contentPadding;
};

const getGridTemplateColumns = ({
  connectorsColumnWidth,
  expandButton,
}: {
  connectorsColumnWidth: number;
  expandButton: ExpandButtonPlacement;
}) => {
  if (expandButton === "inside") {
    return `${connectorsColumnWidth}px 1fr`;
  }

  return `${connectorsColumnWidth}px 1fr ${LAYOUT_CONSTANTS.CONNECTOR_WIDTH}px`;
};

const getContentPadding = ({
  level,
  hasExpandButton,
}: {
  level: number;
  hasExpandButton: boolean;
}) => {
  if (level === 0) return 0;

  if (hasExpandButton) return 4;

  return 8;
};

const getConnectorsLayout = ({
  level,
  hasExpandButton,
  isLastChild,
  prevConnectors,
  expandButton,
}: {
  hasExpandButton: boolean;
  isLastChild: boolean;
  level: number;
  prevConnectors: SpanCardConnectorType[];
  expandButton: ExpandButtonPlacement;
}): {
  connectors: SpanCardConnectorType[];
  connectorsColumnWidth: number;
} => {
  const connectors: SpanCardConnectorType[] = [];

  if (level === 0) {
    return {
      connectors: expandButton === "inside" ? [] : ["vertical"],
      connectorsColumnWidth: 20,
    };
  }

  for (let i = 0; i < level - 1; i++) {
    connectors.push("vertical");
  }

  if (!isLastChild) {
    connectors.push("t-right");
  }

  if (isLastChild) {
    connectors.push("corner-top-right");
  }

  let connectorsColumnWidth =
    connectors.length * LAYOUT_CONSTANTS.CONNECTOR_WIDTH;

  if (hasExpandButton) {
    connectorsColumnWidth += LAYOUT_CONSTANTS.CONNECTOR_WIDTH;
  }

  for (let i = 0; i < prevConnectors.length; i++) {
    if (
      prevConnectors[i] === "empty" ||
      prevConnectors[i] === "corner-top-right"
    ) {
      connectors[i] = "empty";
    }
  }

  return {
    connectors,
    connectorsColumnWidth,
  };
};

const useSpanCardEventHandlers = (
  data: TraceSpan,
  onSpanSelect?: (span: TraceSpan) => void,
) => {
  const handleCardClick = useCallback((): void => {
    onSpanSelect?.(data);
  }, [data, onSpanSelect]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardClick();
      }
    },
    [handleCardClick],
  );

  const handleToggleClick = useCallback(
    (e: MouseEvent | KeyboardEvent): void => {
      e.stopPropagation();
    },
    [],
  );

  return {
    handleCardClick,
    handleKeyDown,
    handleToggleClick,
  };
};

const getSpanCardLayout = ({
  level,
  hasChildren,
  isLastChild,
  prevConnectors,
  expandButton,
}: {
  level: number;
  hasChildren: boolean;
  isLastChild: boolean;
  prevConnectors: SpanCardConnectorType[];
  expandButton: ExpandButtonPlacement;
}) => {
  const hasExpandButtonAsFirstChild = expandButton === "inside" && hasChildren;

  const contentPadding = getContentPadding({
    level,
    hasExpandButton: hasExpandButtonAsFirstChild,
  });

  const contentWidth = getContentWidth({
    level,
    hasExpandButton: hasExpandButtonAsFirstChild,
    contentPadding,
    expandButton,
  });

  const { connectors, connectorsColumnWidth } = getConnectorsLayout({
    level,
    hasExpandButton: hasExpandButtonAsFirstChild,
    isLastChild,
    prevConnectors,
    expandButton,
  });

  const gridTemplateColumns = getGridTemplateColumns({
    connectorsColumnWidth,
    expandButton,
  });

  return {
    hasExpandButtonAsFirstChild,
    contentWidth,
    connectors,
    gridTemplateColumns,
  };
};

const getAriaSelected = (
  isSelected: boolean,
  hasSelection: boolean,
): boolean | undefined => {
  if (isSelected) return true;

  return hasSelection ? false : undefined;
};

const resolveViewOptions = (
  viewOptions: SpanCardViewOptions,
): { withStatus: boolean; expandButton: ExpandButtonPlacement } => ({
  withStatus: viewOptions.withStatus ?? DEFAULT_VIEW_OPTIONS.withStatus,
  expandButton: viewOptions.expandButton || DEFAULT_VIEW_OPTIONS.expandButton,
});

const getContentIndentClass = (
  level: number,
  hasExpandButtonAsFirstChild: boolean,
): string | undefined => {
  if (level === 0) return undefined;

  return hasExpandButtonAsFirstChild ? "pl-1" : "pl-2";
};

export const SpanCard: FC<SpanCardProps> = ({
  data,
  level = 0,
  selectedSpan,
  onSpanSelect,
  viewOptions = DEFAULT_VIEW_OPTIONS,
  avatar,
  minStart,
  maxEnd,
  isLastChild,
  prevLevelConnectors = [],
  expandedSpansIds,
  onExpandSpansIdsChange,
}) => {
  const isExpanded = expandedSpansIds.includes(data.id);

  const { withStatus, expandButton } = resolveViewOptions(viewOptions);

  const handleToggleClick = useCallback(
    (expanded: boolean) => {
      const alreadyExpanded = expandedSpansIds.includes(data.id);

      if (alreadyExpanded && !expanded) {
        onExpandSpansIdsChange(expandedSpansIds.filter((id) => id !== data.id));
      }

      if (!alreadyExpanded && expanded) {
        onExpandSpansIdsChange([...expandedSpansIds, data.id]);
      }
    },
    [expandedSpansIds, data.id, onExpandSpansIdsChange],
  );

  const state: SpanCardState = {
    isExpanded,
    hasChildren: Boolean(data.children?.length),
    isSelected: selectedSpan?.id === data.id,
  };

  const eventHandlers = useSpanCardEventHandlers(data, onSpanSelect);

  const { durationMs } = getTimelineData({
    spanCard: data,
    minStart,
    maxEnd,
  });

  const {
    hasExpandButtonAsFirstChild,
    contentWidth,
    connectors,
    gridTemplateColumns,
  } = getSpanCardLayout({
    level,
    hasChildren: state.hasChildren,
    isLastChild,
    prevConnectors: prevLevelConnectors,
    expandButton,
  });

  const ariaExpanded = state.hasChildren ? state.isExpanded : undefined;
  const statusBadge = withStatus ? (
    <div>
      <SpanStatus status={data.status} />
    </div>
  ) : null;
  const outsideToggle = state.hasChildren ? (
    <SpanCardToggle
      isExpanded={state.isExpanded}
      title={data.title}
      onToggleClick={eventHandlers.handleToggleClick}
    />
  ) : (
    <div />
  );

  const childCards = (data.children ?? []).map((child, idx, siblings) => (
    <SpanCard
      viewOptions={viewOptions}
      key={child.id}
      data={child}
      minStart={minStart}
      maxEnd={maxEnd}
      level={level + 1}
      selectedSpan={selectedSpan}
      onSpanSelect={onSpanSelect}
      isLastChild={idx === siblings.length - 1}
      prevLevelConnectors={connectors}
      expandedSpansIds={expandedSpansIds}
      onExpandSpansIdsChange={onExpandSpansIdsChange}
      avatar={getSpanBrandAvatar(child)}
    />
  ));

  return (
    <li
      role="treeitem"
      aria-selected={getAriaSelected(state.isSelected, Boolean(selectedSpan))}
      aria-expanded={ariaExpanded}
      className="list-none"
    >
      <Collapsible.Root
        open={state.isExpanded}
        onOpenChange={handleToggleClick}
      >
        <div
          className={cn(
            "relative grid w-full",
            state.isSelected &&
              "before:bg-agentprism-muted/75 before:absolute before:-top-2 before:h-2 before:w-full",
            state.isSelected &&
              "from-agentprism-muted/75 to-agentprism-muted/75 bg-gradient-to-b",
          )}
          style={{
            gridTemplateColumns,
            backgroundSize: "auto calc(100% - 8px)",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
          }}
          onClick={eventHandlers.handleCardClick}
          onKeyDown={eventHandlers.handleKeyDown}
          tabIndex={0}
          role="button"
          aria-pressed={state.isSelected}
          aria-describedby={`span-card-desc-${data.id}`}
          aria-expanded={ariaExpanded}
          aria-label={`${state.isSelected ? "Selected" : "Not selected"} span card for ${data.title} at level ${level}`}
        >
          <div className="flex flex-nowrap">
            {connectors.map((connector, idx) => (
              <SpanCardConnector key={`${connector}-${idx}`} type={connector} />
            ))}

            {hasExpandButtonAsFirstChild ? (
              <div className="flex w-5 flex-col items-center">
                <SpanCardToggle
                  isExpanded={state.isExpanded}
                  title={data.title}
                  onToggleClick={eventHandlers.handleToggleClick}
                />

                {state.isExpanded ? (
                  <SpanCardConnector type="vertical" />
                ) : null}
              </div>
            ) : null}
          </div>
          <div
            className={cn(
              "flex flex-wrap items-start gap-x-2 gap-y-1",
              "mb-3 min-h-5 w-full cursor-pointer",
              getContentIndentClass(level, hasExpandButtonAsFirstChild),
            )}
          >
            <div
              className="relative flex min-h-4 shrink-0 flex-wrap items-center gap-1.5"
              style={{
                width: `min(${contentWidth}px, 100%)`,
                minWidth: 140,
              }}
            >
              {avatar ? <Avatar size="4" {...avatar} /> : null}

              <h3
                className="text-agentprism-foreground max-w-32 truncate text-sm leading-[14px]"
                title={data.title}
              >
                {data.title}
              </h3>

              <SpanCardBadges data={data} />
            </div>

            <div className="flex grow flex-wrap items-center justify-end gap-1">
              {expandButton === "outside" ? statusBadge : null}

              <SpanCardTimeline
                minStart={minStart}
                maxEnd={maxEnd}
                spanCard={data}
              />

              <div className="flex items-center gap-2">
                <span className="text-agentprism-foreground inline-block w-14 flex-1 shrink-0 whitespace-nowrap px-1 text-right text-xs">
                  {formatDuration(durationMs)}
                </span>

                {expandButton === "inside" ? statusBadge : null}
              </div>
            </div>
          </div>

          {expandButton === "outside" ? outsideToggle : null}
        </div>

        {childCards.length > 0 ? (
          <div className="relative">
            <Collapsible.Content>
              <ul role="group">{childCards}</ul>
            </Collapsible.Content>
          </div>
        ) : null}
      </Collapsible.Root>
    </li>
  );
};
