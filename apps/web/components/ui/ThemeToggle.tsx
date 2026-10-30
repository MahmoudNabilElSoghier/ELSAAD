"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const t = useTranslations("themeToggle");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      // Label + title mirror the CURRENT state's opposite action target:
      // showing dark when currently light, light when currently dark.
      aria-label={t("aria")}
      title={isDark ? t("light") : t("dark")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg/60 text-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {mounted ? (
        isDark ? (
          <Moon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Sun className="h-4 w-4" aria-hidden="true" />
        )
      ) : (
        // Reserve layout until hydration to avoid a flash/mismatch.
        <Sun className="h-4 w-4 opacity-0" aria-hidden="true" />
      )}
    </button>
  );
}
