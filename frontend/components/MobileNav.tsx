"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  onSurahToggle: () => void;
  onGoToAyah: () => void;
}

export default function MobileNav({ onSurahToggle, onGoToAyah }: Props) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-sidebar border-t border-sidebar-border flex items-center justify-around px-2 py-2 safe-area-pb">
      <NavBtn onClick={onSurahToggle} label="Surahs">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
        </svg>
      </NavBtn>

      <NavLink href="/" label="Home" active={pathname === "/"}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </NavLink>

      <NavLink href="/surah/1" label="Read" active={pathname.startsWith("/surah")}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm0 16V14l2.5-1.5L11 14v6H6zm12 0h-5v-6l2.5-1.5L18 14v6zm0-8h-5V4h5v8z" />
        </svg>
      </NavLink>

      <NavBtn onClick={onGoToAyah} label="Go to">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      </NavBtn>

      <NavLink href="/bookmarks" label="Saved" active={pathname === "/bookmarks"}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
        </svg>
      </NavLink>
    </nav>
  );
}

function NavLink({ href, label, active, children }: { href: string; label: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-w-0
      ${active ? "text-green-400" : "text-muted hover:text-foreground"}`}>
      {children}
      <span className="text-xs">{label}</span>
    </Link>
  );
}

function NavBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-muted hover:text-foreground transition-colors min-w-0">
      {children}
      <span className="text-xs">{label}</span>
    </button>
  );
}
