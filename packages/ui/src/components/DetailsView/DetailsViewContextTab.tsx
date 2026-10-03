import type {
  TraceSpan,
  TraceSpanAttribute,
  TraceSpanContextItem,
} from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import {
  getTokenUsageEntries,
  getTotalCost,
  getTotalTokens,
  hasReportedCost,
} from "@evilmartians/agent-prism-data";
import { useId } from "react";

import { Badge } from "../Badge";
import { CollapsibleSection } from "../CollapsibleSection";
import { DetailsViewContentViewer } from "./DetailsViewContentViewer";

interface DetailsViewContextTabProps {
  data: TraceSpan;
}

function getStringAttr(
  attributes: TraceSpanAttribute[] | undefined,
  key: string,
): string | undefined {
  return attributes?.find((a) => a.key === key)?.value.stringValue;
}

function getIntAttr(
  attributes: TraceSpanAttribute[] | undefined,
  key: string,
): number | undefined {
  const attr = attributes?.find((a) => a.key === key);
  if (attr?.value.intValue === undefined) return undefined;
  const v = Number.parseInt(attr.value.intValue, 10);
  return Number.isNaN(v) ? undefined : v;
}

function getFloatAttr(
  attributes: TraceSpanAttribute[] | undefined,
  key: string,
): number | undefined {
  const attr = attributes?.find((a) => a.key === key);
  if (attr?.value.stringValue === undefined) return undefined;
  const v = Number.parseFloat(attr.value.stringValue);
  return Number.isNaN(v) ? undefined : v;
}

function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}k`;
  return String(tokens);
}

const smallCostFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumSignificantDigits: 2,
});

// Four decimals suit typical LLM costs. Smaller non-zero costs keep two
// significant digits instead, so a real charge never reads as $0.0000.
function formatCost(cost: number): string {
  return cost !== 0 && Math.abs(cost) < 0.0001
    ? smallCostFormat.format(cost)
    : `$${cost.toFixed(4)}`;
}

const TOKEN_TYPE_LABELS: Record<string, string> = {
  input: "Input tokens",
  output: "Output tokens",
  cache_read: "Cache read",
  cache_write: "Cache write",
};

interface StatRowData {
  label: string;
  value: string;
  sub?: string;
}

/**
 * A three-column grid (label / value / sub). Using a shared subgrid keeps the
 * bold values right-aligned in one column and the muted `sub` annotations in the
 * next, so rows line up regardless of label or value length and the value never
 * collides with a long label.
 */
function StatGrid({ rows }: { rows: StatRowData[] }): ReactElement {
  return (
    <div className="divide-agentprism-border grid grid-cols-[1fr_auto_auto] divide-y">
      {rows.map((row) => (
        <div
          key={row.label}
          className="col-span-3 grid grid-cols-subgrid items-baseline py-1.5"
        >
          <span className="text-agentprism-muted-foreground pr-3 text-xs">
            {row.label}
          </span>
          <span className="text-agentprism-foreground text-right text-xs font-medium">
            {row.value}
          </span>
          <span className="text-agentprism-muted-foreground pl-1.5 text-[10px]">
            {row.sub ?? ""}
          </span>
        </div>
      ))}
    </div>
  );
}

const contextTimeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

interface ContextItemSectionProps {
  item: TraceSpanContextItem;
  id: string;
  defaultOpen: boolean;
}

/**
 * One thing that was injected into the span's context. `content` is the text
 * that was injected; `metadata` is whatever else the source recorded about it.
 */
function ContextItemSection({
  item,
  id,
  defaultOpen,
}: ContextItemSectionProps): ReactElement {
  const metadata =
    item.metadata && Object.keys(item.metadata).length > 0
      ? JSON.stringify(item.metadata)
      : null;
  const time =
    item.timestamp instanceof Date && !Number.isNaN(item.timestamp.getTime())
      ? item.timestamp
      : undefined;

  return (
    <CollapsibleSection
      title={item.title}
      defaultOpen={defaultOpen}
      contentClassName="space-y-2 pb-2.5"
      rightContent={
        time && (
          <time
            dateTime={time.toISOString()}
            className="text-agentprism-muted-foreground text-[10px] tabular-nums"
          >
            {contextTimeFormat.format(time)}
          </time>
        )
      }
    >
      <Badge label={item.type} />

      {item.content && (
        // Injected text can run to hundreds of lines, so it scrolls in place;
        // the region is focusable to be scrollable from the keyboard.
        <div
          tabIndex={0}
          role="group"
          aria-label={`${item.title} content`}
          className="max-h-80 overflow-y-auto rounded-lg"
        >
          <DetailsViewContentViewer
            content={item.content}
            parsedContent={null}
            mode="plain"
            label={`${item.title} content`}
            id={`${id}-content`}
          />
        </div>
      )}

      {metadata && (
        <DetailsViewContentViewer
          content={metadata}
          parsedContent={metadata}
          mode="json"
          label={`${item.title} metadata`}
          id={`${id}-metadata`}
        />
      )}
    </CollapsibleSection>
  );
}

interface ContextItemsProps {
  items: TraceSpanContextItem[];
  spanId: string;
}

function ContextItems({ items, spanId }: ContextItemsProps): ReactElement {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="border-agentprism-border rounded-md border p-3"
    >
      <h4
        id={headingId}
        className="text-agentprism-muted-foreground mb-2 text-xs font-medium"
      >
        Context Injections ({items.length})
      </h4>
      <ul className="divide-agentprism-border divide-y">
        {items.map((item, index) => (
          // Keyed by span as well, so a section opened on one span does not
          // stay open on the next one.
          <li key={`${spanId}-${index}`} className="pt-2.5 first:pt-0">
            <ContextItemSection
              item={item}
              id={`${spanId}-context-${index}`}
              defaultOpen={items.length === 1}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DetailsViewContextTab({
  data,
}: DetailsViewContextTabProps): ReactElement {
  const cumulativeTokens = getIntAttr(
    data.attributes,
    "claude_code.cumulative_tokens",
  );
  const contextLimit = getIntAttr(data.attributes, "claude_code.context_limit");
  const fillPercent = getFloatAttr(
    data.attributes,
    "claude_code.context_fill_percent",
  );
  const cacheHitRatio = getFloatAttr(
    data.attributes,
    "claude_code.cache_hit_ratio",
  );
  const model = getStringAttr(data.attributes, "gen_ai.request.model");
  const speed = getStringAttr(data.attributes, "claude_code.usage.speed");

  const usage = data.tokenUsage;
  const contextItems = data.context ?? [];

  const hasContextData =
    cumulativeTokens !== undefined || fillPercent !== undefined;
  const hasTokenBreakdown = usage !== undefined;

  if (!hasContextData && !hasTokenBreakdown && contextItems.length === 0) {
    return (
      <div className="border-agentprism-border rounded-md border p-4">
        <p className="text-agentprism-muted-foreground text-sm">
          No context data for this span.
        </p>
        <p className="text-agentprism-muted-foreground mt-1 text-xs">
          Context tracking is available on LLM call spans with cumulative token
          attributes.
        </p>
      </div>
    );
  }

  const cappedFill =
    fillPercent !== undefined
      ? Math.min(Math.max(fillPercent, 0), 100)
      : undefined;
  // Context windows differ by model, so only a reported, positive limit is used.
  // Without one, the limit stays unknown rather than defaulting to a guess.
  const limit =
    contextLimit !== undefined && contextLimit > 0 ? contextLimit : undefined;
  const barFill =
    cappedFill ??
    (cumulativeTokens !== undefined && limit !== undefined
      ? Math.min(Math.max((cumulativeTokens / limit) * 100, 0), 100)
      : undefined);

  const contextRows: StatRowData[] = [];
  if (cumulativeTokens !== undefined) {
    contextRows.push({
      label: "Cumulative tokens",
      value: formatTokens(cumulativeTokens),
      sub: limit !== undefined ? `of ${formatTokens(limit)}` : undefined,
    });
  }
  if (cappedFill !== undefined) {
    contextRows.push({
      label: "Context fill",
      value: `${cappedFill.toFixed(1)}%`,
    });
  }
  if (cacheHitRatio !== undefined) {
    contextRows.push({
      label: "Cache hit ratio",
      value: `${(cacheHitRatio * 100).toFixed(0)}%`,
      sub: cacheHitRatio > 0.9 ? "mostly cached" : undefined,
    });
  }

  // The `total` entry holds whatever the source did not break down by type, so
  // it has no row of its own: it is already part of the Total row.
  const breakdownRows: StatRowData[] = getTokenUsageEntries(usage)
    .filter(
      (entry) =>
        entry.type !== "total" && (entry.tokens !== 0 || entry.cost !== 0),
    )
    .map((entry) => ({
      label: TOKEN_TYPE_LABELS[entry.type] ?? entry.type,
      value: formatTokens(entry.tokens),
      sub: entry.cost !== 0 ? formatCost(entry.cost) : undefined,
    }));
  breakdownRows.push({
    label: "Total",
    value: formatTokens(getTotalTokens(usage)),
  });

  return (
    <div className="space-y-4">
      {model && (
        <div className="flex items-center gap-2">
          <span className="bg-agentprism-secondary text-agentprism-secondary-foreground rounded px-2 py-0.5 text-xs font-medium">
            {model}
          </span>
          {speed && (
            <span className="text-agentprism-muted-foreground text-[10px]">
              {speed}
            </span>
          )}
        </div>
      )}

      {hasContextData && (
        <div className="border-agentprism-border rounded-md border p-3">
          <h4 className="text-agentprism-muted-foreground mb-2 text-xs font-medium">
            Context Window Position
          </h4>

          {barFill !== undefined && (
            <>
              <div
                role="progressbar"
                aria-label="Context window fill"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Number(barFill.toFixed(1))}
                aria-valuetext={`${barFill.toFixed(1)}%`}
                className="bg-agentprism-secondary relative h-4 overflow-hidden rounded-md"
              >
                <div
                  className="bg-agentprism-context-source-conversation absolute left-0 top-0 h-full transition-all"
                  style={{ width: `${barFill}%` }}
                />
                <div
                  className="bg-agentprism-warning absolute top-0 h-full w-px"
                  style={{ left: "78%" }}
                  title="Compaction threshold"
                />
              </div>
              {limit !== undefined && (
                <div className="text-agentprism-muted-foreground mt-1 flex justify-between text-[10px]">
                  <span>0</span>
                  <span>{formatTokens(limit)}</span>
                </div>
              )}
            </>
          )}

          <div className="mt-2">
            <StatGrid rows={contextRows} />
          </div>
        </div>
      )}

      {hasTokenBreakdown && (
        <div className="border-agentprism-border rounded-md border p-3">
          <h4 className="text-agentprism-muted-foreground mb-2 text-xs font-medium">
            Token Breakdown
          </h4>
          <StatGrid rows={breakdownRows} />
        </div>
      )}

      {hasReportedCost(usage) && (
        <div className="border-agentprism-border rounded-md border p-3">
          <StatGrid
            rows={[{ label: "Cost", value: formatCost(getTotalCost(usage)) }]}
          />
        </div>
      )}

      {contextItems.length > 0 && (
        <ContextItems items={contextItems} spanId={data.id} />
      )}
    </div>
  );
}
