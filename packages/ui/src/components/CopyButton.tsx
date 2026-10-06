import type { ReactElement } from "react";

import { Check, Copy, X } from "lucide-react";
import { useState } from "react";

import { IconButton } from "./IconButton";

type CopyButtonProps = {
  content: string;
  label: string;
};

type CopyState = "error" | "idle" | "success";

export const CopyButton = ({
  content,
  label,
}: CopyButtonProps): ReactElement => {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const onClick = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API not supported");
      }

      await navigator.clipboard.writeText(content);
      setCopyState("success");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  const getIcon = () => {
    switch (copyState) {
      case "error":
        return <X className="size-3" />;
      case "success":
        return <Check className="size-3" />;
      default:
        return <Copy className="size-3" />;
    }
  };

  const getAriaLabel = () => {
    switch (copyState) {
      case "error":
        return `Failed to copy ${label}`;
      case "success":
        return `${label} Copied`;
      default:
        return `Copy ${label}`;
    }
  };

  return (
    <IconButton
      aria-label={getAriaLabel()}
      disabled={copyState !== "idle"}
      onClick={onClick}
      variant="ghost"
    >
      {getIcon()}
    </IconButton>
  );
};
