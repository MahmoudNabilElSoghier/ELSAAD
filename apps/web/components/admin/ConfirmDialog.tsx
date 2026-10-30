"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}

export function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  isDanger = true,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isDanger ? "bg-red-500/15 text-red-400" : "bg-amber-500/15 text-amber-400"}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-fg">{title}</h2>
        </div>
        <p className="text-sm text-muted">{message}</p>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            إلغاء
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            className={isDanger ? "bg-red-600 hover:bg-red-700 text-white" : ""}
          >
            تأكيد
          </Button>
        </div>
      </div>
    </div>
  );
}
