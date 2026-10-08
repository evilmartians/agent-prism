import type { DeepReadonly, TraceSpan } from "@evilmartians/agent-prism-types";
import type { FC, KeyboardEvent, MouseEvent } from "react";

import {
  formatDuration,
  getTimelineData,
} from "@evilmartians/agent-prism-data";
import * as Collapsible from "@radix-ui/react-collapsible";
import cn from "classnames";
import { useCallback } from "react";

import type { AvatarProps } from "../Avatar";
import type { ReadonlyProps } from "../ReadonlyProps";
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

export type SpanCardViewOptions = {
  expandButton?: ExpandButtonPlacement | undefined;
  withStatus?: boolean | undefined;
};

type ExpandButtonPlacement = "inside" | "outside";

type ReadonlySpan = DeepReadonly<TraceSpan>;

const DEFAULT_VIEW_OPTIONS = {
  expandButton: "inside",
  withStatus: true,
} satisfies Required<SpanCardViewOptions>;

type SpanCardProps = {
  avatar?: Omit<AvatarProps, "ref"> | undefined;
  data: TraceSpan;
  expandedSpansIds: string[];
  isLastChild: boolean;
  level?: number | undefined;
  maxEnd: number;
  minStart: number;
  onExpandSpansIdsChange: (ids: readonly string[]) => void;
  onSpanSelect?: ((span: ReadonlySpan) => void) | undefined;
  prevLevelConnectors?: SpanCardConnectorType[] | undefined;
  selectedSpan?: TraceSpan | undefined;
  viewOptions?: SpanCardViewOptions | undefined;
};

type SpanCardState = {
  hasChildren: boolean;
  isExpanded: boolean;
  isSelected: boolean;
};

const getContentWidth = ({
  contentPadding,
  expandButton,
  hasExpandButton,
  level,
}: Readonly<{
  contentPadding: number;
  expandButton: ExpandButtonPlacement;
  hasExpandButton: boolean;
  level: number;
}>) => {
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
}: Readonly<{
  connectorsColumnWidth: number;
  expandButton: ExpandButtonPlacement;
}>) => {
  if (expandButton === "inside") {
    return `${connectorsColumnWidth}px 1fr`;
  }

  return `${connectorsColumnWidth}px 1fr ${LAYOUT_CONSTANTS.CONNECTOR_WIDTH}px`;
};

const getContentPadding = ({
  hasExpandButton,
  level,
}: Readonly<{
  hasExpandButton: boolean;
  level: number;
}>) => {
  if (level === 0) return 0;

  if (hasExpandButton) return 4;

  return 8;
};

const getConnectorsLayout = ({
  expandButton,
  hasExpandButton,
  isLastChild,
  level,
  prevConnectors,
}: Readonly<{
  expandButton: ExpandButtonPlacement;
  hasExpandButton: boolean;
  isLastChild: boolean;
  level: number;
  prevConnectors: readonly SpanCardConnectorType[];
}>): {
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
  data: ReadonlySpan,
  onSpanSelect?: (span: ReadonlySpan) => void,
) => {
  const handleCardClick = useCallback(
    (e: MouseEvent): void => {
      if (
        e.target instanceof Element &&
        e.target.closest('[role="treeitem"]') === e.currentTarget
      ) {
        onSpanSelect?.(data);
      }
    },
    [data, onSpanSelect],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.target !== e.currentTarget) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSpanSelect?.(data);
      }
    },
    [data, onSpanSelect],
  );

  const handleToggleClick = useCallback(
    (e: KeyboardEvent | MouseEvent): void => {
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
  expandButton,
  hasChildren,
  isLastChild,
  level,
  prevConnectors,
}: Readonly<{
  expandButton: ExpandButtonPlacement;
  hasChildren: boolean;
  isLastChild: boolean;
  level: number;
  prevConnectors: readonly SpanCardConnectorType[];
}>) => {
  const hasExpandButtonAsFirstChild = expandButton === "inside" && hasChildren;

  const contentPadding = getContentPadding({
    hasExpandButton: hasExpandButtonAsFirstChild,
    level,
  });

  const contentWidth = getContentWidth({
    contentPadding,
    expandButton,
    hasExpandButton: hasExpandButtonAsFirstChild,
    level,
  });

  const { connectors, connectorsColumnWidth } = getConnectorsLayout({
    expandButton,
    hasExpandButton: hasExpandButtonAsFirstChild,
    isLastChild,
    level,
    prevConnectors,
  });

  const gridTemplateColumns = getGridTemplateColumns({
    connectorsColumnWidth,
    expandButton,
  });

  return {
    connectors,
    contentWidth,
    gridTemplateColumns,
    hasExpandButtonAsFirstChild,
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
  viewOptions: Readonly<SpanCardViewOptions>,
): { expandButton: ExpandButtonPlacement; withStatus: boolean } => ({
  expandButton: viewOptions.expandButton ?? DEFAULT_VIEW_OPTIONS.expandButton,
  withStatus: viewOptions.withStatus ?? DEFAULT_VIEW_OPTIONS.withStatus,
});

const getContentIndentClass = (
  level: number,
  hasExpandButtonAsFirstChild: boolean,
): string | undefined => {
  if (level === 0) return undefined;

  return hasExpandButtonAsFirstChild ? "pl-1" : "pl-2";
};

export const SpanCard: FC<ReadonlyProps<SpanCardProps>> = ({
  avatar,
  data,
  expandedSpansIds,
  isLastChild,
  level = 0,
  maxEnd,
  minStart,
  onExpandSpansIdsChange,
  onSpanSelect,
  prevLevelConnectors = [],
  selectedSpan,
  viewOptions = DEFAULT_VIEW_OPTIONS,
}) => {
  const isExpanded = expandedSpansIds.includes(data.id);

  const { expandButton, withStatus } = resolveViewOptions(viewOptions);

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
    hasChildren: Boolean(data.children?.length),
    isExpanded,
    isSelected: selectedSpan?.id === data.id,
  };

  const eventHandlers = useSpanCardEventHandlers(data, onSpanSelect);

  const { durationMs } = getTimelineData({
    maxEnd,
    minStart,
    spanCard: data,
  });

  const {
    connectors,
    contentWidth,
    gridTemplateColumns,
    hasExpandButtonAsFirstChild,
  } = getSpanCardLayout({
    expandButton,
    hasChildren: state.hasChildren,
    isLastChild,
    level,
    prevConnectors: prevLevelConnectors,
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
      onToggleClick={eventHandlers.handleToggleClick}
      title={data.title}
    />
  ) : (
    <div />
  );

  const childCards = (data.children ?? []).map((child, idx, siblings) => (
    <SpanCard
      avatar={getSpanBrandAvatar(child)}
      data={child}
      expandedSpansIds={expandedSpansIds}
      isLastChild={idx === siblings.length - 1}
      key={child.id}
      level={level + 1}
      maxEnd={maxEnd}
      minStart={minStart}
      onExpandSpansIdsChange={onExpandSpansIdsChange}
      onSpanSelect={onSpanSelect}
      prevLevelConnectors={connectors}
      selectedSpan={selectedSpan}
      viewOptions={viewOptions}
    />
  ));

  return (
    <li
      aria-expanded={ariaExpanded}
      aria-label={`${state.isSelected ? "Selected" : "Not selected"} span card for ${data.title} at level ${level}`}
      aria-selected={getAriaSelected(state.isSelected, Boolean(selectedSpan))}
      className="list-none focus-visible:outline-none [&:focus-visible>div>div:first-child]:[outline-color:-webkit-focus-ring-color] [&:focus-visible>div>div:first-child]:[outline-style:auto]"
      onClick={eventHandlers.handleCardClick}
      onKeyDown={eventHandlers.handleKeyDown}
      role="treeitem"
      tabIndex={0}
    >
      <Collapsible.Root
        onOpenChange={handleToggleClick}
        open={state.isExpanded}
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
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            backgroundSize: "auto calc(100% - 8px)",
            gridTemplateColumns,
          }}
        >
          <div className="flex flex-nowrap">
            {connectors.map((connector, idx) => (
              <SpanCardConnector key={`${connector}-${idx}`} type={connector} />
            ))}

            {hasExpandButtonAsFirstChild ? (
              <div className="flex w-5 flex-col items-center">
                <SpanCardToggle
                  isExpanded={state.isExpanded}
                  onToggleClick={eventHandlers.handleToggleClick}
                  title={data.title}
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
                minWidth: 140,
                width: `min(${contentWidth}px, 100%)`,
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
                maxEnd={maxEnd}
                minStart={minStart}
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
