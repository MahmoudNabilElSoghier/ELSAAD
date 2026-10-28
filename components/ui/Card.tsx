import * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "article" | "li";
} & React.HTMLAttributes<HTMLDivElement>;

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

export function Card({
  hover = false,
  padding = "md",
  as = "div",
  className,
  children,
  ...rest
}: CardProps) {
  const Tag = as;
  // TS variance workaround: rest is typed per contract (HTMLDivElement) but Tag may
  // be <li>, whose handler types differ. Assert to the common HTMLElement base.
  const elementProps = rest as React.HTMLAttributes<HTMLElement>;

  return (
    <Tag
      className={cn(
        "bg-card border border-border rounded-lg",
        hover && "hover:border-accent/50 transition-colors",
        paddingClasses[padding],
        className
      )}
      {...elementProps}
    >
      {children}
    </Tag>
  );
}
