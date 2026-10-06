import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { ReactElement, ReactNode } from "react";

import {
  formatDuration,
  getDurationMs,
  getTotalCost,
  getTotalTokens,
  hasReportedCost,
} from "@evilmartians/agent-prism-data";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

import type { AvatarProps } from "../Avatar";

import { Avatar } from "../Avatar";
import { IconButton } from "../IconButton";
import { PriceBadge } from "../PriceBadge";
import { SpanBadge } from "../SpanBadge";
import { SpanStatus } from "../SpanStatus";
import { TimestampBadge } from "../TimestampBadge";
import { TokensBadge } from "../TokensBadge";

export type DetailsViewHeaderProps = {
  /**
   * Custom actions to render in the header
   */
  actions?: ReactNode | undefined;
  avatar?: AvatarProps | undefined;
  /**
   * Optional className for the header container
   */
  className?: string | undefined;
  copyButton?:
    | undefined
    | {
        isEnabled?: boolean | undefined;
        onCopy?: ((data: TraceSpan) => void) | undefined;
      };
  data: TraceSpan;
};

export const DetailsViewHeader = ({
  actions,
  avatar,
  className,
  copyButton,
  data,
}: DetailsViewHeaderProps): ReactElement => {
  const [hasCopied, setHasCopied] = useState(false);
  const durationMs = getDurationMs(data);

  const handleCopy = () => {
    if (copyButton?.onCopy) {
      copyButton.onCopy(data);
      setHasCopied(true);
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    }
  };

  return (
    <div
      className={
        className !== undefined && className !== ""
          ? className
          : "flex flex-wrap items-center gap-2"
      }
    >
      {avatar ? <Avatar size="4" {...avatar} /> : null}

      <span className="text-agentprism-foreground tracking-wide">
        {data.title}
      </span>

      <div className="flex size-5 items-center justify-center">
        <SpanStatus status={data.status} />
      </div>

      {copyButton ? (
        <IconButton
          aria-label={
            copyButton.isEnabled === true
              ? "Copy span details"
              : "Copy disabled"
          }
          onClick={handleCopy}
          variant="ghost"
        >
          {hasCopied ? (
            <Check className="text-agentprism-muted-foreground size-3" />
          ) : (
            <Copy className="text-agentprism-muted-foreground size-3" />
          )}
        </IconButton>
      ) : null}

      <SpanBadge category={data.type} />

      {data.tokenUsage ? (
        <>
          <TokensBadge tokensCount={getTotalTokens(data.tokenUsage)} />
          {hasReportedCost(data.tokenUsage) && (
            <PriceBadge cost={getTotalCost(data.tokenUsage)} />
          )}
        </>
      ) : null}

      <span className="text-agentprism-muted-foreground text-xs">
        LATENCY: {formatDuration(durationMs)}
      </span>

      {typeof data.startTime === "number" && (
        <TimestampBadge timestamp={data.startTime} />
      )}

      {actions}
    </div>
  );
};
