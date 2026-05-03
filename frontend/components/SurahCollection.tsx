"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Surah } from "@/lib/types";
import { JUZ_DATA } from "@/lib/juzData";
import { getPageSurah } from "@/lib/pageMap";

type Tab = "surah" | "juz" | "page";

const INITIAL_COUNT = 16;
const SEC = "#428038";
const TABS: Tab[] = ["surah", "juz", "page"];

interface Props {
  surahs: Surah[];
}

function DiamondBadge({ number }: { number: number }) {
  return (
    <div className="shrink-0 relative w-11 h-11 flex items-center justify-center">
      <div
        className="absolute w-7 h-7 rounded-md triangle-badge"
        style={{
          background: "rgba(66,128,56,0.15)",
          transform: "rotate(45deg)",
        }}
      />
      <span
        className="relative z-10 text-xs font-bold triangle-badge-text"
        style={{ color: SEC }}
      >
        {number}
      </span>
    </div>
  );
}

export default function SurahCollection({ surahs }: Props) {
  const [tab, setTab] = useState<Tab>("surah");
  const [showAll, setShowAll] = useState(false);
  const [animClass, setAnimClass] = useState("");
  const prevTabIndex = useRef(0);
  const tabIndex = TABS.indexOf(tab);

  function changeTab(t: Tab) {
    if (t === tab) return;
    const nextIndex = TABS.indexOf(t);
    const dir = nextIndex > prevTabIndex.current ? "left" : "right";
    setAnimClass(dir === "left" ? "tab-slide-left" : "tab-slide-right");
    prevTabIndex.current = nextIndex;
    setTab(t);
    setShowAll(false);
    setTimeout(() => setAnimClass(""), 350);
  }

  const displayedSurahs = showAll ? surahs : surahs.slice(0, INITIAL_COUNT);

  return (
    <section className="mb-12">
      <style>{`
        .surah-card:hover { border-color: rgba(66,128,56,0.5) !important; background-color: var(--sidebar-hover) !important; }
        .surah-card:hover .triangle-badge { background: ${SEC} !important; }
        .surah-card:hover .triangle-badge-text { color: #fff !important; }
        @keyframes slideInLeft  { from { opacity: 0; transform: translateX(40px);  } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        .tab-slide-left  { animation: slideInLeft  0.3s ease; }
        .tab-slide-right { animation: slideInRight 0.3s ease; }
      `}</style>

      {/* Section header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-5 gap-3">
        <div className="hidden sm:block">
          <h2 className="text-foreground text-xl font-bold">Quran Mazid</h2>
          <p className="text-muted text-xs mt-0.5">Browse by Surah, Juz or Page</p>
        </div>

        {/* Pills */}
        <div className="relative flex bg-gray-500/30 rounded-2xl p-1.5 w-full sm:w-auto">
          {/* Sliding indicator */}
          <div
            className="absolute top-1.5 bottom-1.5 rounded-xl transition-transform duration-300 ease-in-out"
            style={{
              width: `calc(${100 / 3}% - 4px)`,
              backgroundColor: "#000",
              transform: `translateX(calc(${tabIndex * 100}% + ${tabIndex * 2}px))`,
            }}
          />
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => changeTab(t)}
              className="relative z-10 flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-medium capitalize transition-colors duration-300"
              style={{ color: tab === t ? "#fff" : "#888" }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Surah grid */}
      {tab === "surah" && (
        <div className={animClass}>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {displayedSurahs.map((surah) => (
              <Link
                key={surah.id}
                href={`/surah/${surah.id}`}
                className="surah-card flex items-center gap-3 p-3.5 bg-card border border-card-border rounded-xl transition-all group"
              >
                <DiamondBadge number={surah.id} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-medium text-sm truncate">{surah.transliteration}</span>
                    <span className="text-foreground text-sm shrink-0 ml-1" style={{ fontFamily: "Amiri" }}>{surah.name}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-muted text-xs">{surah.translation}</span>
                    <span className="text-muted text-xs capitalize">{surah.type} · {surah.total_verses}v</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {surahs.length > INITIAL_COUNT && (
            <div className="text-center mt-5">
              <button
                onClick={() => setShowAll((v) => !v)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-card border border-card-border rounded-xl text-sm text-muted transition-all"
                style={{}}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(66,128,56,0.5)"; (e.currentTarget as HTMLButtonElement).style.color = SEC; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = ""; (e.currentTarget as HTMLButtonElement).style.color = ""; }}
              >
                {showAll ? (
                  <><svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M7 14l5-5 5 5z" /></svg>Show Less</>
                ) : (
                  <><svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M7 10l5 5 5-5z" /></svg>Show All {surahs.length} Surahs</>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Juz grid */}
      {tab === "juz" && (
        <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 ${animClass}`}>
          {JUZ_DATA.map((j) => (
            <Link
              key={j.juz}
              href={`/surah/${j.surahId}`}
              className="surah-card flex items-center gap-3 p-3.5 bg-card border border-card-border rounded-xl transition-all group"
            >
              <DiamondBadge number={j.juz} />
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm font-medium">Juz {j.juz}</p>
                <p className="text-muted text-xs">{j.label} · {j.start}</p>
              </div>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-muted shrink-0">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </Link>
          ))}
        </div>
      )}

      {/* Page grid */}
      {tab === "page" && (
        <div className={animClass}>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {Array.from({ length: showAll ? 604 : 60 }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/surah/${getPageSurah(p)}`}
                className="surah-card flex items-center gap-3 p-3.5 bg-card border border-card-border rounded-xl transition-all w-full text-left"
              >
                <DiamondBadge number={p} />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium">Page {p}</p>
                  <p className="text-muted text-xs">Surah {getPageSurah(p)} · Page {p} of 604</p>
                </div>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-muted shrink-0">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </Link>
            ))}
          </div>
          {!showAll && (
            <div className="text-center mt-5">
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-card border border-card-border rounded-xl text-sm text-muted transition-all"
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(66,128,56,0.5)"; (e.currentTarget as HTMLButtonElement).style.color = SEC; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = ""; (e.currentTarget as HTMLButtonElement).style.color = ""; }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M7 10l5 5 5-5z" /></svg>
                Show All 604 Pages
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
