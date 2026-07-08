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

function StatRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-agentprism-muted-foreground text-xs">{label}</span>
      <div className="text-right">
        <span className="text-agentprism-foreground text-xs font-medium">
          {value}
        </span>
        {sub && (
          <span className="text-agentprism-muted-foreground ml-1.5 text-[10px]">
            {sub}
          </span>
        )}
      </div>
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

          <div className="divide-agentprism-border mt-2 divide-y">
            {cumulativeTokens !== undefined && (
              <StatRow
                label="Cumulative tokens"
                value={formatTokens(cumulativeTokens)}
                sub={`of ${formatTokens(limit)}`}
              />
            )}
            {cappedFill !== undefined && (
              <StatRow
                label="Context fill"
                value={`${cappedFill.toFixed(1)}%`}
              />
            )}
            {cacheHitRatio !== undefined && (
              <StatRow
                label="Cache hit ratio"
                value={`${(cacheHitRatio * 100).toFixed(0)}%`}
                sub={cacheHitRatio > 0.9 ? "mostly cached" : undefined}
              />
            )}
          </div>
        </div>
      )}

      {hasTokenBreakdown && (
        <div className="border-agentprism-border rounded-md border p-3">
          <h4 className="text-agentprism-muted-foreground mb-2 text-xs font-medium">
            Token Breakdown
          </h4>
          <div className="divide-agentprism-border divide-y">
            {inputTokens !== undefined && (
              <StatRow label="Input tokens" value={formatTokens(inputTokens)} />
            )}
            {outputTokens !== undefined && (
              <StatRow
                label="Output tokens"
                value={formatTokens(outputTokens)}
              />
            )}
            {cacheReadTokens !== undefined && cacheReadTokens > 0 && (
              <StatRow
                label="Cache read"
                value={formatTokens(cacheReadTokens)}
              />
            )}
            {cacheCreationTokens !== undefined && cacheCreationTokens > 0 && (
              <StatRow
                label="Cache write"
                value={formatTokens(cacheCreationTokens)}
              />
            )}
            {data.tokensCount !== undefined && (
              <StatRow label="Total" value={formatTokens(data.tokensCount)} />
            )}
          </div>
        </div>
      )}

      {data.cost !== undefined && (
        <div className="border-agentprism-border rounded-md border p-3">
          <StatRow label="Cost" value={`$${data.cost.toFixed(4)}`} />
        </div>
      )}
    </div>
  );
}
