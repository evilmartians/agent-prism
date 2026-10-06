import type {
  TraceSpan,
  TraceSpanAttribute,
} from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import {
  getTokenUsageEntries,
  getTotalCost,
  getTotalTokens,
  hasReportedCost,
} from "@evilmartians/agent-prism-data";

import { DetailsViewContextWindowBar } from "./DetailsViewContextWindowBar";
import { DetailsViewStatGrid, type StatRowData } from "./DetailsViewStatGrid";

type DetailsViewContextTabProps = {
  data: TraceSpan;
};

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

const clampPercent = (value: number): number =>
  Math.min(Math.max(value, 0), 100);

const getBarFill = (
  cappedFill: number | undefined,
  cumulativeTokens: number | undefined,
  limit: number | undefined,
): number | undefined => {
  if (cappedFill !== undefined) return cappedFill;
  if (cumulativeTokens === undefined || limit === undefined) return undefined;

  return clampPercent((cumulativeTokens / limit) * 100);
};

const getContextRows = ({
  cumulativeTokens,
  limit,
  cappedFill,
  cacheHitRatio,
}: {
  cumulativeTokens: number | undefined;
  limit: number | undefined;
  cappedFill: number | undefined;
  cacheHitRatio: number | undefined;
}): StatRowData[] => {
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

  return contextRows;
};

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

  const hasContextData =
    cumulativeTokens !== undefined || fillPercent !== undefined;
  const hasTokenBreakdown = usage !== undefined;

  if (!hasContextData && !hasTokenBreakdown) {
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
    fillPercent !== undefined ? clampPercent(fillPercent) : undefined;
  // Context windows differ by model, so only a reported, positive limit is used.
  // Without one, the limit stays unknown rather than defaulting to a guess.
  const limit =
    contextLimit !== undefined && contextLimit > 0 ? contextLimit : undefined;
  const barFill = getBarFill(cappedFill, cumulativeTokens, limit);

  const contextRows = getContextRows({
    cumulativeTokens,
    limit,
    cappedFill,
    cacheHitRatio,
  });

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
      {model ? (
        <div className="flex items-center gap-2">
          <span className="bg-agentprism-secondary text-agentprism-secondary-foreground rounded px-2 py-0.5 text-xs font-medium">
            {model}
          </span>
          {speed ? (
            <span className="text-agentprism-muted-foreground text-[10px]">
              {speed}
            </span>
          ) : null}
        </div>
      ) : null}

      {hasContextData ? (
        <div className="border-agentprism-border rounded-md border p-3">
          <h4 className="text-agentprism-muted-foreground mb-2 text-xs font-medium">
            Context Window Position
          </h4>

          {barFill === undefined ? null : (
            <DetailsViewContextWindowBar
              fill={barFill}
              limitLabel={limit === undefined ? undefined : formatTokens(limit)}
            />
          )}

          <div className="mt-2">
            <DetailsViewStatGrid rows={contextRows} />
          </div>
        </div>
      ) : null}

      {hasTokenBreakdown ? (
        <div className="border-agentprism-border rounded-md border p-3">
          <h4 className="text-agentprism-muted-foreground mb-2 text-xs font-medium">
            Token Breakdown
          </h4>
          <DetailsViewStatGrid rows={breakdownRows} />
        </div>
      ) : null}

      {hasReportedCost(usage) && (
        <div className="border-agentprism-border rounded-md border p-3">
          <DetailsViewStatGrid
            rows={[{ label: "Cost", value: formatCost(getTotalCost(usage)) }]}
          />
        </div>
      )}
    </div>
  );
}
