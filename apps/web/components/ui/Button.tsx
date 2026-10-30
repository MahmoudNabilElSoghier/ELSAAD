import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses = {
  primary: "bg-accent-strong text-white hover:bg-accent-strong/90",
  secondary: "border border-border bg-card text-fg hover:border-accent",
  ghost: "text-fg hover:bg-card",
} as const;

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3",
  lg: "px-8 py-4 text-lg",
} as const;

export function Button({
  variant = "primary",
  size = "md",
  asChild = false,
  fullWidth = false,
  className,
  children,
  type,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: cn(classes, child.props.className),
    });
  }

  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}
