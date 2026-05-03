"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import quranImg from "../assets/quran.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Surah } from "@/lib/types";
import { FontSettingsProvider } from "@/lib/useFontSettings";
import { useTheme } from "@/lib/useTheme";
import { PlayerProvider } from "@/lib/PlayerContext";
import IconSidebar from "./IconSidebar";
import SurahSidebar from "./SurahSidebar";
import FontSettingsPanel from "./FontSettingsPanel";
import GoToAyahModal from "./GoToAyahModal";
import BottomPlayer from "./BottomPlayer";
import ThemeDropdown from "./ThemeDropdown";
import MobileNav from "./MobileNav";

const SEC = "#428038";

interface Props {
  surahs: Surah[];
  children: React.ReactNode;
}

function SearchModal({ surahs, onClose }: { surahs: Surah[]; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Surah[]>(surahs.slice(0, 10));
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!query.trim()) { setResults(surahs.slice(0, 10)); return; }
    const q = query.toLowerCase();
    setResults(surahs.filter((s) =>
      s.transliteration.toLowerCase().includes(q) ||
      s.translation.toLowerCase().includes(q) ||
      s.name.includes(q) ||
      String(s.id) === q
    ).slice(0, 8));
  }, [query, surahs]);

  function go(id: number) {
    router.push(`/surah/${id}`);
    onClose();
  }

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="w-full max-w-lg bg-popover border border-card-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-card-border">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-muted shrink-0">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search surah by name or number..."
            className="flex-1 bg-transparent text-foreground placeholder-muted text-sm focus:outline-none"
          />
          <kbd className="hidden sm:flex items-center px-2 py-1 bg-sidebar border border-sidebar-border rounded text-muted text-xs font-mono">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">No surahs found</p>
          ) : results.map((s) => (
            <button key={s.id} onClick={() => go(s.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sidebar-hover transition-colors text-left border-b border-card-border last:border-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                style={{ backgroundColor: `${SEC}15`, color: SEC }}>
                {s.id}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-foreground text-sm font-medium">{s.transliteration}</span>
                <span className="text-muted text-xs ml-2">{s.translation}</span>
              </div>
              <span className="text-foreground text-sm shrink-0" style={{ fontFamily: "Amiri" }}>{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AppShell({ surahs, children }: Props) {
  const [surahOpen, setSurahOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);
  const [goToAyahOpen, setGoToAyahOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, update: setTheme } = useTheme();
  const pathname = usePathname();

  const isHome = pathname === "/";

  // Ctrl+K shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <FontSettingsProvider>
      <PlayerProvider>
        <div className="min-h-screen bg-background text-foreground">

          {isHome ? (
            <>
              <HomeNavbar theme={theme} onThemeChange={setTheme} onSearch={() => setSearchOpen(true)} />
              <main className="max-w-screen-2xl mx-auto px-4 md:px-8 pt-4 pb-16">
                {children}
              </main>
              <BottomPlayer />
            </>
          ) : (
            <>
              <header className="fixed top-0 left-0 right-0 h-14 z-60 bg-background/95 backdrop-blur border-b border-card-border flex items-center justify-between px-4 gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSurahOpen((v) => !v)}
                    className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:bg-sidebar-hover hover:text-foreground transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                    </svg>
                  </button>
                  <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden" style={{ backgroundColor: SEC }}>
                      <Image src={quranImg} alt="Quran" width={28} height={28} className="object-contain" />
                    </div>
                    <span className="hidden sm:inline text-foreground font-bold text-base">Quran Mazid</span>
                  </Link>

                </div>

                <div className="flex items-center gap-2">
                  {/* Search */}
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center border border-card-border text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors"
                    title="Search surah (Ctrl+K)"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                  </button>
                  <ThemeDropdown theme={theme} onChange={setTheme} />
                  <button
                    onClick={() => setFontOpen((v) => !v)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center border border-card-border text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors"
                    style={fontOpen ? { borderColor: SEC, backgroundColor: "rgba(66,128,56,0.1)", color: SEC } : {}}
                    title="Display settings"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setGoToAyahOpen(true)}
                    className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center border border-card-border text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors"
                    title="Go to Ayah"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                  </button>
                </div>
              </header>

              <div className="hidden lg:block">
                <IconSidebar onGoToAyah={() => setGoToAyahOpen(true)} onSurahToggle={() => setSurahOpen((v) => !v)} />
              </div>
              <SurahSidebar surahs={surahs} isOpen={surahOpen} onClose={() => setSurahOpen(false)} />
              <FontSettingsPanel isOpen={fontOpen} onClose={() => setFontOpen(false)} />

              {(surahOpen || fontOpen) && (
                <div className="fixed inset-0 bg-black/60 z-30 xl:hidden"
                  onClick={() => { setSurahOpen(false); setFontOpen(false); }} />
              )}

              <main className="min-h-screen flex flex-col lg:ml-16 xl:ml-80 xl:mr-64 pt-14 pb-16 lg:pb-0">
                <div className="p-4 md:p-6 flex-1">{children}</div>
              </main>

              <div className="lg:hidden">
                <MobileNav onSurahToggle={() => setSurahOpen((v) => !v)} onGoToAyah={() => setGoToAyahOpen(true)} />
              </div>

              {goToAyahOpen && <GoToAyahModal surahs={surahs} onClose={() => setGoToAyahOpen(false)} />}
              <BottomPlayer />
            </>
          )}

          {searchOpen && <SearchModal surahs={surahs} onClose={() => setSearchOpen(false)} />}
        </div>
      </PlayerProvider>
    </FontSettingsProvider>
  );
}

function HomeNavbar({ theme, onThemeChange, onSearch }: {
  theme: string;
  onThemeChange: (t: "dark" | "light" | "sepia" | "system") => void;
  onSearch: () => void;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-card-border">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">

          <div className="flex items-center gap-2">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:bg-sidebar-hover hover:text-foreground transition-colors"
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shadow-sm transition-opacity group-hover:opacity-80" style={{ backgroundColor: SEC }}>
                <Image src={quranImg} alt="Quran" width={28} height={28} className="object-contain" />
              </div>
              <span className="text-foreground font-bold text-lg">Quran Mazid</span>
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/" label="Home" active={pathname === "/"} />
            <NavLink href="/surah/1" label="Read Quran" active={pathname.startsWith("/surah")} />
            <NavLink href="/bookmarks" label="Bookmarks" active={pathname === "/bookmarks"} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSearch}
              className="w-9 h-9 rounded-lg flex items-center justify-center border border-card-border text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors"
              title="Search surah (Ctrl+K)"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
            <ThemeDropdown theme={theme as "dark" | "light" | "sepia" | "system"} onChange={onThemeChange} />
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[80] md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />

          {/* Drawer panel — slides from left */}
          <div className="absolute top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col shadow-2xl"
            style={{ animation: "slideInLeft 0.25s ease" }}>

            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
              <Link href="/" className="flex items-center gap-2" onClick={() => setDrawerOpen(false)}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden" style={{ backgroundColor: SEC }}>
                  <Image src={quranImg} alt="Quran" width={24} height={24} className="object-contain" />
                </div>
                <span className="text-foreground font-bold text-base">Quran Mazid</span>
              </Link>
              <button onClick={() => setDrawerOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-1 p-3">
              <DrawerLink href="/" label="Home" active={pathname === "/"} icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
              } onClick={() => setDrawerOpen(false)} />
              <DrawerLink href="/surah/1" label="Read Quran" active={pathname.startsWith("/surah")} icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm0 16V14l2.5-1.5L11 14v6H6zm12 0h-5v-6l2.5-1.5L18 14v6zm0-8h-5V4h5v8z" /></svg>
              } onClick={() => setDrawerOpen(false)} />
              <DrawerLink href="/bookmarks" label="Bookmarks" active={pathname === "/bookmarks"} icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
              } onClick={() => setDrawerOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-muted hover:text-foreground hover:bg-sidebar-hover"
      style={active ? { backgroundColor: "rgba(66,128,56,0.15)", color: SEC } : {}}
    >
      {label}
    </Link>
  );
}

function DrawerLink({ href, label, active, icon, onClick }: { href: string; label: string; active: boolean; icon: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
      style={active ? { backgroundColor: "rgba(66,128,56,0.15)", color: SEC } : { color: "var(--muted)" }}
    >
      {icon}
      {label}
    </Link>
  );
}
