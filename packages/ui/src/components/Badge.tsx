import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";

import cn from "classnames";

import type { ColorVariant, ComponentSize } from "./shared";

type BadgeSize = Extract<ComponentSize, "4" | "5" | "6" | "7">;

const sizeClasses: Record<BadgeSize, string> = {
  "4": "px-1 gap-1 h-4",
  "5": "px-1.5 gap-1 h-5",
  "6": "px-2 gap-1.5 h-6",
  "7": "px-2.5 gap-2 h-7",
};

const textSizes: Record<BadgeSize, string> = {
  "4": "text-xs leading-3",
  "5": "text-xs",
  "6": "text-sm",
  "7": "text-sm",
};

/**
 * Unified color theme classes for consistent styling across components
 */
const COLOR_THEME_CLASSES: Record<
  ColorVariant,
  {
    bg: string;
    darkBg: string;
    text: string;
    darkText: string;
    border?: string;
    darkBorder?: string;
  }
> = {
  purple: {
    bg: "bg-purple-50",
    darkBg: "dark:bg-purple-950/75",
    text: "text-purple-500",
    darkText: "dark:text-purple-300",
    border: "border-purple-500",
    darkBorder: "dark:border-purple-300",
  },
  indigo: {
    bg: "bg-indigo-50",
    darkBg: "dark:bg-indigo-950/75",
    text: "text-indigo-500",
    darkText: "dark:text-indigo-300",
    border: "border-indigo-500",
    darkBorder: "dark:border-indigo-300",
  },
  orange: {
    bg: "bg-orange-50",
    darkBg: "dark:bg-orange-950/75",
    text: "text-orange-600",
    darkText: "dark:text-orange-300",
    border: "border-orange-600",
    darkBorder: "dark:border-orange-300",
  },
  teal: {
    bg: "bg-teal-50",
    darkBg: "dark:bg-teal-950/75",
    text: "text-teal-600",
    darkText: "dark:text-teal-300",
    border: "border-teal-600",
    darkBorder: "dark:border-teal-300",
  },
  cyan: {
    bg: "bg-cyan-50",
    darkBg: "dark:bg-cyan-950/75",
    text: "text-cyan-600",
    darkText: "dark:text-cyan-300",
    border: "border-cyan-600",
    darkBorder: "dark:border-cyan-300",
  },
  sky: {
    bg: "bg-sky-50",
    darkBg: "dark:bg-sky-950/75",
    text: "text-sky-600",
    darkText: "dark:text-sky-300",
    border: "border-sky-600",
    darkBorder: "dark:border-sky-300",
  },
  yellow: {
    bg: "bg-yellow-50",
    darkBg: "dark:bg-yellow-950/75",
    text: "text-yellow-700",
    darkText: "dark:text-yellow-300",
    border: "border-yellow-700",
    darkBorder: "dark:border-yellow-300",
  },
  emerald: {
    bg: "bg-emerald-50",
    darkBg: "dark:bg-emerald-950/75",
    text: "text-emerald-700",
    darkText: "dark:text-emerald-300",
    border: "border-emerald-700",
    darkBorder: "dark:border-emerald-300",
  },
  red: {
    bg: "bg-red-50",
    darkBg: "dark:bg-red-950/75",
    text: "text-red-600",
    darkText: "dark:text-red-300",
    border: "border-red-600",
    darkBorder: "dark:border-red-300",
  },
  gray: {
    bg: "bg-gray-100",
    darkBg: "dark:bg-gray-900",
    text: "text-gray-600",
    darkText: "dark:text-gray-400",
    border: "border-gray-300",
    darkBorder: "dark:border-gray-600",
  },
};

export type BadgeProps = ComponentPropsWithRef<"span"> & {
  /**
   * The content of the badge
   */
  label: ReactNode;

  /**
   * The color theme of the badge
   * Uses the unified color theme system
   * @default "gray"
   */
  theme: ColorVariant;

  /**
   * The visual variant of the badge
   * @default "solid"
   */
  variant?: "solid" | "outline";

  /**
   * The size of the badge
   * @default "md"
   */
  size?: BadgeSize;

  /**
   * Optional icon to display at the start of the badge
   */
  iconStart?: ReactElement;

  /**
   * Optional icon to display at the end of the badge
   */
  iconEnd?: ReactElement;

  /**
   * Optional className for additional styling
   */
  className?: string;
};

export const Badge = ({
  label,
  theme = "gray",
  variant = "solid",
  size = "4",
  iconStart,
  iconEnd,
  className = "",
  ...rest
}: BadgeProps): ReactElement => {
  const { bg, darkBg, text, darkText, border, darkBorder } =
    COLOR_THEME_CLASSES[theme];

  const variantClasses =
    variant === "outline"
      ? `border ${border} ${darkBorder} ${text} ${darkText} bg-transparent dark:bg-transparent`
      : `${bg} ${text} ${darkBg} ${darkText}`;

  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center overflow-hidden rounded-md font-medium",
        variantClasses,
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {iconStart && <span className="shrink-0">{iconStart}</span>}

      <span
        className={cn(
          textSizes[size],
          "min-w-0 max-w-full flex-shrink-0 truncate font-medium tracking-normal",
        )}
      >
        {label}
      </span>

      {iconEnd && <span className="shrink-0">{iconEnd}</span>}
    </span>
  );
};
