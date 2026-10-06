import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import {
  getTotalCost,
  getTotalTokens,
  hasReportedCost,
} from "@evilmartians/agent-prism-data";

import type { ReadonlyProps } from "../ReadonlyProps";

import { PriceBadge } from "../PriceBadge";
import { SpanBadge } from "../SpanBadge";
import { TokensBadge } from "../TokensBadge";

type SpanCardBagdesProps = {
  data: TraceSpan;
};

export const SpanCardBadges = ({
  data,
}: ReadonlyProps<SpanCardBagdesProps>): ReactElement => {
  return (
    <div className="flex flex-wrap items-center justify-start gap-1">
      <SpanBadge category={data.type} />

      {data.tokenUsage ? (
        <>
          <TokensBadge tokensCount={getTotalTokens(data.tokenUsage)} />
          {hasReportedCost(data.tokenUsage) && (
            <PriceBadge cost={getTotalCost(data.tokenUsage)} />
          )}
        </>
      ) : null}
    </div>
  );
};
