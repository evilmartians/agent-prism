import cn from "classnames";
import { X } from "lucide-react";
import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
  type RefObject,
  useRef,
} from "react";

export type TextInputProps = ComponentPropsWithRef<"input"> & {
  /**
   * Whether to visually hide the label while keeping it for screen readers
   * @default false
   */
  hideLabel?: boolean | undefined;

  /**
   * Unique identifier for the input (required)
   */
  id: string;

  /**
   * Optional className for the input element
   */
  inputClassName?: string | undefined;

  /**
   * Label text for the input
   */
  label?: string | undefined;

  /**
   * Callback fired when the clear button is clicked. If this callback is provided,
   * the clear button will be shown.
   */
  onClear?: (() => void) | undefined;

  /**
   * Callback fired when the input value changes
   */
  onValueChange?: ((value: string) => void) | undefined;

  /**
   * Ref to the input element
   */
  ref?: RefObject<HTMLInputElement | null> | undefined;

  /**
   * Icon to display at the start of the input
   */
  startIcon?: ReactNode | undefined;
};

const iconBaseClassName =
  "absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-agentprism-muted-foreground";

export const TextInput = ({
  className,
  hideLabel = false,
  id,
  inputClassName,
  label,
  onChange,
  onClear,
  onValueChange,
  ref,
  startIcon,
  ...rest
}: TextInputProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  const handleClear = () => {
    onClear?.();

    if (ref) {
      ref.current?.focus();
      return;
    }

    inputRef.current?.focus();
  };

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <label
          className={cn(
            "text-agentprism-foreground block text-sm font-medium",
            hideLabel && "sr-only",
          )}
          htmlFor={id}
        >
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          "relative flex w-full items-center justify-center",
          label && !hideLabel && "mt-1",
        )}
      >
        <input
          className={cn(
            inputClassName,
            "flex h-7 items-center truncate",
            "w-full px-2",
            !!startIcon && "pl-8",
            !!onClear && "pr-8",
            "border-agentprism-border rounded border bg-transparent",
            "text-agentprism-foreground placeholder:text-agentprism-foreground/50",
            "hover:border-agentprism-border-strong",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          id={id}
          onChange={handleChange}
          ref={ref || inputRef}
          {...rest}
        />
        {startIcon ? (
          <div aria-hidden className={cn(iconBaseClassName, "left-2")}>
            {startIcon}
          </div>
        ) : null}
        {onClear && rest.value ? (
          <button
            aria-label="Clear input value"
            className={cn(iconBaseClassName, "right-2")}
            onClick={handleClear}
            type="button"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};
