import type {
  TraceSpan,
  TraceSpanAttribute,
} from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

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

  const inputTokens = getIntAttr(data.attributes, "gen_ai.usage.input_tokens");
  const outputTokens = getIntAttr(
    data.attributes,
    "gen_ai.usage.output_tokens",
  );
  const cacheReadTokens = getIntAttr(
    data.attributes,
    "gen_ai.usage.cache_read_input_tokens",
  );
  const cacheCreationTokens = getIntAttr(
    data.attributes,
    "gen_ai.usage.cache_creation_input_tokens",
  );

  const hasContextData =
    cumulativeTokens !== undefined || fillPercent !== undefined;
  const hasTokenBreakdown =
    inputTokens !== undefined || outputTokens !== undefined;

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
    fillPercent !== undefined
      ? Math.min(Math.max(fillPercent, 0), 100)
      : undefined;
  // Guard against a zero/negative context_limit, which would make the bar width
  // NaN or Infinity below.
  const limit = contextLimit && contextLimit > 0 ? contextLimit : 200_000;

  const contextRows: StatRowData[] = [];
  if (cumulativeTokens !== undefined) {
    contextRows.push({
      label: "Cumulative tokens",
      value: formatTokens(cumulativeTokens),
      sub: `of ${formatTokens(limit)}`,
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

  const breakdownRows: StatRowData[] = [];
  if (inputTokens !== undefined) {
    breakdownRows.push({
      label: "Input tokens",
      value: formatTokens(inputTokens),
    });
  }
  if (outputTokens !== undefined) {
    breakdownRows.push({
      label: "Output tokens",
      value: formatTokens(outputTokens),
    });
  }
  if (cacheReadTokens !== undefined && cacheReadTokens > 0) {
    breakdownRows.push({
      label: "Cache read",
      value: formatTokens(cacheReadTokens),
    });
  }
  if (cacheCreationTokens !== undefined && cacheCreationTokens > 0) {
    breakdownRows.push({
      label: "Cache write",
      value: formatTokens(cacheCreationTokens),
    });
  }
  if (data.tokensCount !== undefined) {
    breakdownRows.push({
      label: "Total",
      value: formatTokens(data.tokensCount),
    });
  }

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

          {cumulativeTokens !== undefined && (
            <>
              <div className="bg-agentprism-secondary relative h-4 overflow-hidden rounded-md">
                <div
                  className="bg-agentprism-context-source-conversation absolute left-0 top-0 h-full transition-all"
                  style={{
                    width: `${cappedFill ?? Math.min(Math.max((cumulativeTokens / limit) * 100, 0), 100)}%`,
                  }}
                />
                <div
                  className="bg-agentprism-warning absolute top-0 h-full w-px"
                  style={{ left: "78%" }}
                  title="Compaction threshold"
                />
              </div>
              <div className="text-agentprism-muted-foreground mt-1 flex justify-between text-[10px]">
                <span>0</span>
                <span>{formatTokens(limit)}</span>
              </div>
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

      {data.cost !== undefined && (
        <div className="border-agentprism-border rounded-md border p-3">
          <StatGrid
            rows={[{ label: "Cost", value: `$${data.cost.toFixed(4)}` }]}
          />
        </div>
      )}
    </div>
  );
}
