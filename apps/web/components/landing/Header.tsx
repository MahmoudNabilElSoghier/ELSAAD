"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { navigation } from "@/lib/content";
import { company } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur border-b border-border">
      <Container size="xl" as="div">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            {/* TODO: replace with real SVG logo */}
            <span className="text-xl md:text-2xl font-extrabold tracking-wider text-accent">
              ELSAAD
            </span>
            <span className="text-xs text-muted font-medium">
              السعد للدراجات
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="القائمة الرئيسية" className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="relative text-lg font-semibold text-fg/90 hover:text-fg transition-colors after:absolute after:-bottom-1 after:right-0 after:h-[2px] after:w-full after:origin-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100 focus-visible:outline-none"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions (Switchers + WhatsApp) */}
          <div className="hidden md:flex items-center gap-3">
            <LocaleSwitcher />
            <ThemeToggle />
            <Button variant="primary" size="sm" asChild>
              <a
                href={company.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </a>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="القائمة"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-card border-b border-border px-4 pt-4 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <nav aria-label="القائمة الرئيسية" className="flex flex-col space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-muted hover:text-fg transition-colors px-2 py-1 rounded-md hover:bg-bg/50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
            <Button variant="primary" size="sm" asChild>
              <a
                href={company.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
