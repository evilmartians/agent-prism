import type { ReactElement } from "react";

import { Check, Copy, X } from "lucide-react";
import { useState } from "react";

import { IconButton } from "./IconButton";

type CopyButtonProps = {
  content: string;
  label: string;
};

type CopyState = "error" | "idle" | "success";

const ICONS: Record<CopyState, ReactElement> = {
  error: <X className="size-3" />,
  idle: <Copy className="size-3" />,
  success: <Check className="size-3" />,
};

export const CopyButton = ({
  content,
  label,
}: CopyButtonProps): ReactElement => {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyState("success");
      setTimeout(() => {
        setCopyState("idle");
      }, 2000);
    } catch {
      setCopyState("error");
      setTimeout(() => {
        setCopyState("idle");
      }, 2000);
    }
  };

  const ariaLabels: Record<CopyState, string> = {
    error: `Failed to copy ${label}`,
    idle: `Copy ${label}`,
    success: `${label} Copied`,
  };

  return (
    <IconButton
      aria-label={ariaLabels[copyState]}
      disabled={copyState !== "idle"}
      onClick={() => {
        void copy();
      }}
      variant="ghost"
    >
      {ICONS[copyState]}
    </IconButton>
  );
};
