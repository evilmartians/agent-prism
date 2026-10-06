import type { ComponentPropsWithRef, ReactElement } from "react";

import cn from "classnames";

import type { ComponentSize } from "./ComponentSize";
import type { ReadonlyProps } from "./ReadonlyProps";

import { ROUNDED_CLASSES } from "./roundedClasses";

type ButtonSize = Extract<
  ComponentSize,
  "6" | "7" | "8" | "9" | "10" | "11" | "12" | "16"
>;

type ButtonVariant =
  | "brand"
  | "destructive"
  | "ghost"
  | "outlined"
  | "primary"
  | "secondary"
  | "success";

const BASE_CLASSES =
  "inline-flex items-center justify-center font-medium transition-all duration-200";

const sizeClasses = {
  "6": "h-6 px-2 gap-1 text-xs",
  "7": "h-7 px-2 gap-1 text-xs",
  "8": "h-8 px-2 gap-1 text-xs",
  "9": "h-9 px-2.5 gap-2 text-sm",
  "10": "h-10 px-4 gap-2 text-sm",
  "11": "h-11 px-5 gap-3 text-base",
  "12": "h-12 px-5 gap-2.5 text-base",
  "16": "h-16 px-7 gap-3 text-lg",
};

const variantClasses: Record<ButtonVariant, string> = {
  brand: "text-agentprism-brand-foreground bg-agentprism-brand",
  destructive: "bg-agentprism-error text-agentprism-primary-foreground",
  ghost: "bg-transparent text-agentprism-foreground",
  outlined:
    "border border bg-transparent text-agentprism-foreground border-agentprism-foreground",
  primary: "text-agentprism-primary-foreground bg-agentprism-primary",
  secondary: "bg-agentprism-secondary text-agentprism-secondary-foreground",
  success: "bg-agentprism-success text-agentprism-primary-foreground",
};

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  /**
   * Makes the button full width
   * @default false
   */
  fullWidth?: boolean | undefined;

  /**
   * Optional icon to display at the end of the button
   */
  iconEnd?: ReactElement | undefined;

  /**
   * Optional icon to display at the start of the button
   */
  iconStart?: ReactElement | undefined;

  /**
   * The border radius of the button
   * @default "md"
   */
  rounded?: "full" | "lg" | "md" | "none" | "sm" | undefined;

  /**
   * The size of the button
   * @default "6"
   */
  size?: ButtonSize | undefined;

  /**
   * The visual variant of the button
   * @default "primary"
   */
  variant?: ButtonVariant | undefined;
};

export const Button = ({
  children,
  className = "",
  disabled = false,
  fullWidth = false,
  iconEnd,
  iconStart,
  onClick,
  rounded = "md",
  size = "6",
  type = "button",
  variant = "primary",
  ...rest
}: ReadonlyProps<ButtonProps>): ReactElement => {
  const widthClass = fullWidth ? "w-full" : "";
  const stateClasses = disabled
    ? "cursor-not-allowed opacity-50"
    : "hover:opacity-70";

  return (
    <button
      className={cn(
        BASE_CLASSES,
        sizeClasses[size],
        ROUNDED_CLASSES[rounded],
        variantClasses[variant],
        widthClass,
        stateClasses,
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      type={
        type === "submit" ? "submit" : type === "reset" ? "reset" : "button"
      }
      {...rest}
    >
      {iconStart ? <span className="mr-1">{iconStart}</span> : null}
      {children}
      {iconEnd ? <span className="ml-1">{iconEnd}</span> : null}
    </button>
  );
};
