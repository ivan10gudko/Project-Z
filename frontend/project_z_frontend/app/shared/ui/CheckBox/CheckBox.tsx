import React, { useId, type ComponentProps } from "react";

interface CheckboxProps extends Omit<
  ComponentProps<"input">,
  "onChange" | "value"
> {
  label?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  themeVariant?: "light" | "dark";
  labelClassName?: string;
  count?: number; 
}

const CHECKBOX_CLASSES = {
  base: "h-5 w-5 shrink-0 rounded-md border flex items-center justify-center transition-all cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50 select-none",
  error: "border-danger peer-focus-visible:ring-1 peer-focus-visible:ring-danger",
  
  default:
    "border-border hover:border-primary peer-focus-visible:ring-1 peer-focus-visible:ring-primary peer-checked:border-primary peer-checked:bg-primary",
};

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  themeVariant = "light",
  className = "",
  error,
  labelClassName = "",
  disabled,
  count, 
  ...props
}) => {
  const id = useId();

  const isMargin = (c: string) =>
    c.startsWith("m-") ||
    c.startsWith("mb-") ||
    c.startsWith("mt-") ||
    c.startsWith("mx-") ||
    c.startsWith("my-");

  const containerClasses = className.split(" ").filter(isMargin).join(" ");
  const checkboxClasses = className
    .split(" ")
    .filter((c) => !isMargin(c))
    .join(" ");

  const hasCustomBg = className.includes("bg-");
  const backgroundStyle = hasCustomBg ? "" : "bg-background";

  return (
    <div className={`inline-flex flex-col gap-1 min-w-0 ${containerClasses}`}>
      <label
        htmlFor={id}
        className="inline-flex items-center justify-between cursor-pointer select-none group"
      >
        <div className="inline-flex items-center gap-2.5 min-w-0">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
            {...props}
          />

          <div
            className={`
              checkbox-box
              ${CHECKBOX_CLASSES.base}
              ${backgroundStyle}
              ${error ? CHECKBOX_CLASSES.error : CHECKBOX_CLASSES.default}
              ${checkboxClasses}
            `}
          >
            <svg
              className={`h-3.5 w-3.5 stroke-[#121212] stroke-[3.5] fill-none transition-all duration-200 ${
                checked ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>

          {label && (
            <span
              className={`text-sm font-semibold leading-none transition-colors peer-disabled:opacity-50 truncate ${labelClassName} ${
                labelClassName ? "" : "text-foreground"
              }`}
            >
              {label}
            </span>
          )}
        </div>

        {count !== undefined && (
          <span className="text-xs bg-card text-foreground/80 px-2 py-0.5 rounded-md font-medium border border-border/40 min-w-[24px] text-center transition-colors group-hover:border-border ml-2">
            {count}
          </span>
        )}
      </label>

      {error && (
        <span className="text-xs text-danger ml-1 mt-0.5">{error}</span>
      )}
    </div>
  );
};

export default Checkbox;