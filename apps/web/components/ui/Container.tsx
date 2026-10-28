import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  size?: "sm" | "md" | "lg" | "xl";
  as?: "div" | "section" | "header" | "footer" | "main";
} & React.HTMLAttributes<HTMLElement>;

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
} as const;

export function Container({
  size = "md",
  as = "div",
  className,
  children,
  ...rest
}: ContainerProps) {
  const Tag = as;

  return (
    <Tag
      className={cn("mx-auto px-4 sm:px-6 lg:px-8", sizeClasses[size], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
