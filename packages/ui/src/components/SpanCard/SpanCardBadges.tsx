import type { TraceSpan } from "@evilmartians/agent-prism-types";

import {
  getTotalCost,
  getTotalTokens,
  hasReportedCost,
} from "@evilmartians/agent-prism-data";

import { PriceBadge } from "../PriceBadge";
import { SpanBadge } from "../SpanBadge";
import { TokensBadge } from "../TokensBadge";

interface SpanCardBagdesProps {
  data: TraceSpan;
}

export const SpanCardBadges = ({ data }: SpanCardBagdesProps) => {
  return (
    <div className="flex flex-wrap items-center justify-start gap-1">
      <SpanBadge category={data.type} />

      {data.tokenUsage && (
        <>
          <TokensBadge tokensCount={getTotalTokens(data.tokenUsage)} />
          {hasReportedCost(data.tokenUsage) && (
            <PriceBadge cost={getTotalCost(data.tokenUsage)} />
          )}
        </>
      )}
    </div>
  );
};
