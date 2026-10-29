"use client";

import { CheckCircle2, AlertTriangle, X } from "lucide-react";

interface FormBannerProps {
  type: "success" | "error";
  message: string;
  onClose?: () => void;
}

export function FormBanner({ type, message, onClose }: FormBannerProps) {
  const isSuccess = type === "success";

  return (
    <div
      className={`mb-4 flex items-center justify-between gap-3 rounded-lg border p-4 text-sm ${
        isSuccess
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-300"
      }`}
      dir="rtl"
    >
      <div className="flex items-center gap-2.5">
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
        ) : (
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
        )}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-black/20 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
