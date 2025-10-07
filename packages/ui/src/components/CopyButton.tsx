import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { IconButton } from "./IconButton";

type CopyButtonProps = {
  label: string;
  content: string;
};

export const CopyButton = ({ label, content }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const onClick = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <IconButton
      onClick={onClick}
      aria-label={isCopied ? `${label} Copied` : `Copy ${label}`}
      variant="ghost"
    >
      {isCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </IconButton>
  );
};
