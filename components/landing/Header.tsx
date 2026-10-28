"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { navigation } from "@/lib/content";
import { company } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

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
                className="text-sm font-medium text-muted hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop WhatsApp Button */}
          <div className="hidden md:inline-flex">
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
                className="text-base font-medium text-muted hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-bg/50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2">
            <Button variant="primary" size="sm" fullWidth asChild>
              <a
                href={company.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center gap-2"
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
