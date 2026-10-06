import type { TraceSpanCategory } from "@evilmartians/agent-prism-types";
import type { ComponentPropsWithRef, ReactElement } from "react";

import cn from "classnames";
import { User } from "lucide-react";
import { useState } from "react";

import type { ComponentSize } from "./ComponentSize";

import { ROUNDED_CLASSES } from "./roundedClasses";

export type AvatarSize = Extract<
  ComponentSize,
  "4" | "6" | "8" | "9" | "10" | "11" | "12" | "16"
>;

const sizeClasses: Record<AvatarSize, string> = {
  "4": "size-4 text-xs",
  "6": "size-6 text-xs",
  "8": "size-8 text-xs",
  "9": "size-9 text-sm",
  "10": "size-10 text-base",
  "11": "size-11 text-lg",
  "12": "size-12 text-xl",
  "16": "size-16 text-2xl",
};

const iconSizeClasses: Record<AvatarSize, string> = {
  "4": "size-3",
  "6": "size-4",
  "8": "size-6",
  "9": "size-7",
  "10": "size-8",
  "11": "size-9",
  "12": "size-10",
  "16": "size-12",
};

const bgColorClasses: Record<TraceSpanCategory, string> = {
  agent_invocation: "bg-agentprism-avatar-agent",
  chain_operation: "bg-agentprism-avatar-chain",
  create_agent: "bg-agentprism-avatar-create-agent",
  embedding: "bg-agentprism-avatar-embedding",
  event: "bg-agentprism-avatar-event",
  guardrail: "bg-agentprism-avatar-guardrail",
  llm_call: "bg-agentprism-avatar-llm",
  retrieval: "bg-agentprism-avatar-retrieval",
  span: "bg-agentprism-avatar-span",
  tool_execution: "bg-agentprism-avatar-tool",
  unknown: "bg-agentprism-avatar-unknown",
};

export type AvatarProps = ComponentPropsWithRef<"div"> & {
  /**
   * The alt text for the avatar
   */
  alt?: string | undefined;
  /**
   * The category of the span which avatar is associated with
   */
  category: TraceSpanCategory;
  /**
   * Optional className for additional styling
   */
  className?: string | undefined;
  /**
   * Custom letter to display (will use first letter of alt if not provided)
   */
  letter?: string | undefined;
  /**
   * The border radius of the avatar
   * @default "full"
   */
  rounded?: "full" | "lg" | "md" | "none" | "sm" | undefined;
  /**
   * The size of the avatar
   * @default "md"
   */
  size?: AvatarSize | undefined;
  /**
   * The image source for the avatar
   */
  src?: string | undefined;
};

export const Avatar = ({
  alt = "Avatar",
  category,
  children,
  className = "",
  letter,
  rounded = "full",
  size = "10",
  src,
  ...rest
}: AvatarProps): ReactElement => {
  const [error, setError] = useState(false);

  const displayLetter = letter ? letter.charAt(0) : alt.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden",
        !children && "bg-agentprism-muted",
        error && "border-agentprism-secondary border",
        sizeClasses[size],
        ROUNDED_CLASSES[rounded],
        className,
      )}
      {...rest}
    >
      {children ? (
        children
      ) : error ? (
        <User
          className={cn(
            iconSizeClasses[size],
            "text-agentprism-muted-foreground",
          )}
        />
      ) : (
        <>
          {src ? (
            <img
              alt={alt}
              className="size-full object-cover"
              onError={() => setError(true)}
              src={src}
            />
          ) : (
            <div
              className={cn(
                "flex size-full items-center justify-center",
                "text-agentprism-accent font-medium",
                bgColorClasses[category],
              )}
            >
              {displayLetter}
            </div>
          )}
        </>
      )}
    </div>
  );
};
