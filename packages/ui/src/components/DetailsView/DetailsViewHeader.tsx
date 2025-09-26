import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Avatar, type AvatarProps } from "../Avatar";
import { IconButton } from "../IconButton";
import { SpanStatus } from "../SpanStatus.tsx";
import { DetailsViewHeaderActions } from "./DetailsViewHeaderActions";

interface DetailsViewHeaderProps {
  data: TraceSpan;
  avatar?: AvatarProps;
  copyButton?: {
    isEnabled?: boolean;
    onCopy?: (data: TraceSpan) => void;
  };
}

export const DetailsViewHeader = ({
  data,
  avatar,
  copyButton,
}: DetailsViewHeaderProps) => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = () => {
    if (copyButton?.onCopy) {
      copyButton.onCopy(data);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-1.5">
        {avatar && <Avatar size="4" {...avatar} />}

        <span className="text-base tracking-wide text-gray-900 dark:text-gray-200">
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
      </div>

      <DetailsViewHeaderActions />
    </div>
  );
};
