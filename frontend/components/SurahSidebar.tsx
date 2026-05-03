"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Surah } from "@/lib/types";
import { SurahSidebarProps } from "@/lib/interfaces";
import { JUZ_DATA_SIDEBAR } from "@/lib/juzData";
import { getPageSurah } from "@/lib/pageMap";

const SEC = "#428038";
const PAGES = Array.from({ length: 604 }, (_, i) => i + 1);

type Tab = "surah" | "juz" | "page";

function DiamondBadge({ number, active }: { number: number; active?: boolean }) {
  return (
    <div className="shrink-0 relative w-9 h-9 flex items-center justify-center diamond-badge-wrap">
      <div
        className="absolute w-6 h-6 rounded-md diamond-badge-inner"
        style={{
          background: active ? SEC : "rgba(66,128,56,0.15)",
          transform: "rotate(45deg)",
        }}
      />
      <span className="relative z-10 text-xs font-bold diamond-badge-text" style={{ color: active ? "#fff" : SEC }}>
        {number}
      </span>
    </div>
  );
}

export default function SurahSidebar({ surahs, isOpen, onClose }: SurahSidebarProps) {
  const pathname = usePathname();
  const [tab, setTab] = useState<Tab>("surah");
  const [search, setSearch] = useState("");

  const filteredSurahs = surahs.filter(
    (s) =>
      s.transliteration.toLowerCase().includes(search.toLowerCase()) ||
      s.translation.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search) ||
      String(s.id).includes(search)
  );

  return (
    <aside className={`
      fixed top-14 h-[calc(100vh-3.5rem)] w-72 bg-sidebar border-r border-sidebar-border z-40 flex flex-col
      transition-transform duration-300 ease-in-out
      left-0 xl:left-16
      ${isOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}
    `}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-foreground font-semibold text-base">The Holy Quran</h2>
          <button onClick={onClose} className="xl:hidden w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <p className="text-muted text-xs">114 Surahs · 6,236 Ayahs</p>

        {/* Pill tabs */}
        <div className="flex gap-1 mt-3 bg-sidebar-hover rounded-lg p-1">
          {(["surah", "juz", "page"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-1 rounded-md text-xs font-medium capitalize transition-colors text-muted hover:text-foreground"
              style={tab === t ? { backgroundColor: SEC, color: "#fff" } : {}}>
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mt-2">
          <input
            type="text" value={search}
            onChange={(e) => { setSearch(e.target.value); if (tab !== "surah") setTab("surah"); }}
            placeholder="Search surah..."
            className="w-full bg-sidebar-hover border border-sidebar-border rounded-lg pl-3 pr-9 py-2 text-foreground placeholder-muted text-xs focus:outline-none transition-colors"
            style={{ outlineColor: SEC }}
            onFocus={(e) => { e.currentTarget.style.borderColor = SEC; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = ""; }}
          />
          <svg viewBox="0 0 24 24" className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 fill-muted pointer-events-none">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
      </div>

      {/* List */}
      <style>{`
        .surah-card:hover .diamond-badge-inner { background: ${SEC} !important; }
        .surah-card:hover .diamond-badge-text { color: #fff !important; }
      `}</style>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
        {tab === "surah" && filteredSurahs.map((surah) => {
          const active = pathname === `/surah/${surah.id}`;
          return (
            <Link key={surah.id} href={`/surah/${surah.id}`} onClick={onClose}
              className="surah-card flex items-center gap-3 px-3 py-3.5 rounded-xl transition-colors border border-sidebar-border mx-1"
              style={active ? { backgroundColor: `${SEC}15`, borderColor: SEC } : {}}
              onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${SEC}60`; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = `${SEC}08`; } }}
              onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.borderColor = ""; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = ""; } }}>
              <DiamondBadge number={surah.id} active={active} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-sm font-medium truncate">{surah.transliteration}</span>
                  <span className="text-foreground text-sm shrink-0 ml-1" style={{ fontFamily: "Amiri" }}>{surah.name}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-muted text-xs">{surah.translation}</span>
                  <span className="text-muted text-xs">{surah.total_verses}v</span>
                </div>
              </div>
            </Link>
          );
        })}

        {tab === "juz" && JUZ_DATA_SIDEBAR.map((j) => (
          <Link key={j.juz} href={`/surah/${j.surahId}#ayah-${j.ayahId}`} onClick={onClose}
            className="surah-card flex items-center gap-3 px-3 py-3.5 rounded-xl transition-colors border border-sidebar-border mx-1"
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${SEC}60`; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = `${SEC}08`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = ""; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = ""; }}>
            <DiamondBadge number={j.juz} />
            <div>
              <p className="text-foreground text-sm font-medium">Juz {j.juz}</p>
              <p className="text-muted text-xs">{j.label}</p>
            </div>
          </Link>
        ))}

        {tab === "page" && (
          <div className="flex flex-col gap-1.5 p-2">
            {PAGES.map((p) => {
              const pageSurahId = getPageSurah(p);
              const active = pathname === `/surah/${pageSurahId}`;
              return (
                <Link key={p} href={`/surah/${pageSurahId}`} onClick={onClose}
                  className="surah-card flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors border mx-1"
                  style={active
                    ? { backgroundColor: `${SEC}15`, borderColor: SEC }
                    : { borderColor: "var(--sidebar-border)" }
                  }
                  onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${SEC}60`; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = `${SEC}08`; } }}
                  onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--sidebar-border)"; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = ""; } }}>
                  <DiamondBadge number={p} active={active} />
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium">Page {p}</p>
                    <p className="text-muted text-xs">Surah {pageSurahId}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
