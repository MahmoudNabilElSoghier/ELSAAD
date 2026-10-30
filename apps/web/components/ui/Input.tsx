"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = {
  label?: string;
  error?: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, hint, id, className, ...rest }, ref) {
    const autoId = React.useId();
    const inputId = id ?? autoId;

    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-fg">
            {label}
          </label>
        ) : null}
        <input
          {...rest}
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "bg-bg border rounded-lg px-4 py-3 text-fg placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-50",
            error ? "border-red-500 focus:border-red-500" : "border-border",
            className
          )}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-red-500 text-sm">{error}</p>
        ) : hint ? (
          <p className="text-muted text-sm">{hint}</p>
        ) : null}
      </div>
    );
  }
);
