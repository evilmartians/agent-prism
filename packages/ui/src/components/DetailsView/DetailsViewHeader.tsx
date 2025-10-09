import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { ReactNode } from "react";

import { getDurationMs, formatDuration } from "@evilmartians/agent-prism-data";
import { Check, Copy, Coins } from "lucide-react";
import { useState } from "react";

import type { AvatarProps } from "../Avatar";

import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { IconButton } from "../IconButton";
import {
  getSpanCategoryIcon,
  getSpanCategoryLabel,
  getSpanCategoryTheme,
} from "../shared";
import { SpanStatus } from "../SpanStatus";
import { TimestampBadge } from "../TimestampBadge";

export interface DetailsViewHeaderProps {
  data: TraceSpan;
  avatar?: AvatarProps;
  copyButton?: {
    isEnabled?: boolean;
    onCopy?: (data: TraceSpan) => void;
  };
  /**
   * Custom actions to render in the header
   */
  actions?: ReactNode;
  /**
   * Optional className for the header container
   */
  className?: string;
}

export const DetailsViewHeader = ({
  data,
  avatar,
  copyButton,
  actions,
  className,
}: DetailsViewHeaderProps) => {
  const [hasCopied, setHasCopied] = useState(false);
  const Icon = getSpanCategoryIcon(data.type);
  const durationMs = getDurationMs(data);

  const handleCopy = () => {
    if (copyButton?.onCopy) {
      copyButton.onCopy(data);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  return (
    <div className={className || "flex flex-wrap items-center gap-2"}>
      {avatar && <Avatar size="4" {...avatar} />}

      <span className="tracking-wide text-gray-900 dark:text-gray-200">
        {data.title}
      </span>

      <div className="flex size-5 items-center justify-center">
        <SpanStatus status={data.status} />
      </div>

      {copyButton && (
        <IconButton
          aria-label={
            copyButton.isEnabled ? "Copy span details" : "Copy disabled"
          }
          variant="ghost"
          onClick={handleCopy}
        >
          {hasCopied ? (
            <Check className="size-3 text-gray-500" />
          ) : (
            <Copy className="size-3 text-gray-500" />
          )}
        </IconButton>
      )}

      <Badge
        iconStart={<Icon className="size-2.5" />}
        theme={getSpanCategoryTheme(data.type)}
        size="4"
        label={getSpanCategoryLabel(data.type)}
      />

      {data.tokensCount ? (
        <Badge
          iconStart={<Coins className="size-2.5" />}
          theme="gray"
          size="4"
          label={data.tokensCount}
        />
      ) : null}

      {data.cost ? (
        <Badge theme="gray" size="4" label={`$ ${data.cost}`} />
      ) : null}

      <span className="text-xs text-gray-500 dark:text-gray-600">
        LATENCY: {formatDuration(durationMs)}
      </span>

      {typeof data.startTime === "number" && (
        <TimestampBadge timestamp={data.startTime} />
      )}

      {actions}
    </div>
  );
};
