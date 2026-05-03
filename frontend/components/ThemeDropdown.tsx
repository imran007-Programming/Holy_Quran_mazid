"use client";
import { useState, useRef, useEffect } from "react";
import { Theme } from "@/lib/types";

const SEC = "#428038";

interface Props {
  theme: Theme;
  onChange: (t: Theme) => void;
}

const THEMES: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
      </svg>
    ),
  },
  {
    value: "light",
    label: "Light",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06a.996.996 0 0 0 0 1.41c.39.39 1.03.39 1.41 0l1.06-1.06a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0zM7.05 18.36l-1.06 1.06a.996.996 0 0 0 0 1.41c.39.39 1.03.39 1.41 0l1.06-1.06a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0z" />
      </svg>
    ),
  },
  {
    value: "sepia",
    label: "Sepia",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
      </svg>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M20 3H4v10c0 1.1.9 2 2 2h3v2H7v2h10v-2h-2v-2h3c1.1 0 2-.9 2-2V3zm-2 10H6V5h12v8z" />
      </svg>
    ),
  },
];

export default function ThemeDropdown({ theme, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = THEMES.find((t) => t.value === theme) ?? THEMES[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-lg flex items-center justify-center border border-card-border text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors"
        style={open ? { borderColor: SEC, color: SEC, backgroundColor: `${SEC}10` } : {}}
        title={`Theme: ${current.label}`}
      >
        {current.icon}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-36 bg-popover border border-card-border rounded-xl shadow-xl overflow-hidden z-50">
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => { onChange(t.value); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors text-muted hover:bg-sidebar-hover hover:text-foreground"
              style={theme === t.value ? { backgroundColor: `${SEC}15`, color: SEC } : {}}
            >
              {t.icon}
              <span>{t.label}</span>
              {theme === t.value && (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current ml-auto">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
