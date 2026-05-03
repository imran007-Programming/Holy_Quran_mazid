"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SEC = "#428038";

import { IconSidebarProps } from "@/lib/interfaces";

export default function IconSidebar({ onGoToAyah, onSurahToggle }: IconSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center justify-center gap-2 z-50">
      <NavItem label="Surahs" onClick={onSurahToggle}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
        </svg>
      </NavItem>

      <NavItem href="/" label="Home" active={pathname === "/"}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </NavItem>

      <NavItem href="/surah/1" label="Read Quran" active={pathname.startsWith("/surah")}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm0 16V14l2.5-1.5L11 14v6H6zm12 0h-5v-6l2.5-1.5L18 14v6zm0-8h-5V4h5v8z" />
        </svg>
      </NavItem>

      <NavItem label="Go to Ayah" onClick={onGoToAyah}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      </NavItem>

      <NavItem href="/bookmarks" label="Bookmarks" active={pathname === "/bookmarks"}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
        </svg>
      </NavItem>
    </aside>
  );
}

function NavItem({ children, label, active, href, onClick }: {
  children: React.ReactNode; label: string; active?: boolean; href?: string; onClick?: () => void;
}) {
  const base = "w-10 h-10 rounded-lg flex items-center justify-center transition-colors group relative";
  const style = active ? { backgroundColor: SEC, color: "#fff" } : {};
  const cls = `${base} ${active ? "text-white" : "text-sidebar-icon hover:bg-sidebar-hover hover:text-foreground"}`;
  const tooltip = (
    <span className="absolute left-12 bg-popover border border-sidebar-border text-foreground text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
      {label}
    </span>
  );
  if (href) return <Link href={href} title={label} className={cls} style={style}>{children}{tooltip}</Link>;
  return <button onClick={onClick} title={label} className={cls} style={style}>{children}{tooltip}</button>;
}
