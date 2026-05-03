"use client";
import { useState } from "react";
import { Verse } from "@/lib/types";
import { usePlayer } from "@/lib/PlayerContext";
import { useFontSettings } from "@/lib/useFontSettings";

import { AyahCardProps } from "@/lib/interfaces";

const SEC = "#428038";

export default function AyahCard({
  verse,
  surahId,
  surahName,
  surahTransliteration,
  isBookmarked,
  onBookmark,
  totalVerses,
  isActive,
}: AyahCardProps) {
  const [tafsirOpen, setTafsirOpen] = useState(false);
  const { surah: activeSurah, playing, loading, playSurah, togglePlay, seekToVerse, verseTimings } = usePlayer();
  const { settings } = useFontSettings();

  const isThisSurah = activeSurah?.surahId === surahId;

  function handlePlay() {
    if (!isThisSurah) {
      playSurah({ surahId, surahName, surahTransliteration, totalVerses });
      return;
    }
    const timing = verseTimings.find((vt) => vt.verseNumber === verse.id);
    if (timing) seekToVerse(timing.timestampFrom);
    else togglePlay();
  }

  const isPlayingThis = isThisSurah && isActive && playing;
  const isLoadingThis = isThisSurah && loading && isActive;

  return (
    <div
      id={`ayah-${verse.id}`}
      className="w-full mb-3 transition-all duration-300"
      style={{
        borderLeft: `3px solid ${isActive ? SEC : `${SEC}30`}`,
        borderRight: `3px solid ${isActive ? SEC : `${SEC}30`}`,
      }}
    >
      <div className="flex gap-4 p-6">
        {/* Left: action buttons */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors"
            style={isActive
              ? { border: `1px solid ${SEC}`, backgroundColor: `${SEC}30` }
              : { border: `1px solid ${SEC}60`, backgroundColor: `${SEC}15` }}>
            <span className="text-xs font-bold" style={{ color: SEC }}>{verse.id}</span>
          </div>

          <ActionBtn onClick={handlePlay} active={isPlayingThis} title="Play from this ayah">
            {isLoadingThis ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="10" />
              </svg>
            ) : isPlayingThis ? (
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8 5v14l11-7z" /></svg>
            )}
          </ActionBtn>

          <ActionBtn onClick={() => setTafsirOpen((v) => !v)} active={tafsirOpen} title="Tafsir">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </ActionBtn>

          <ActionBtn onClick={onBookmark} active={isBookmarked} title={isBookmarked ? "Remove bookmark" : "Bookmark"}>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d={isBookmarked
                ? "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"
                : "M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"
              } />
            </svg>
          </ActionBtn>
        </div>

        {/* Right: Arabic + translation */}
        <div className="flex-1 min-w-0">
          <p className="text-right leading-loose text-foreground mb-3"
            style={{ fontFamily: settings.arabicFont, fontSize: `${settings.arabicSize}px`, direction: "rtl" }}>
            {verse.text}
          </p>
          <div className="border-t border-card-border my-2" />
          <p className="text-muted leading-relaxed" style={{ fontSize: `${settings.translationSize}px` }}>
            {verse.translation}
          </p>

          {tafsirOpen && (
            <div className="mt-3 p-3 rounded-lg bg-sidebar border border-card-border">
              <p className="text-xs font-semibold mb-1" style={{ color: SEC }}>
                Tafsir — {surahName} {verse.id}
              </p>
              <p className="text-muted text-xs leading-relaxed">
                This verse is ayah {verse.id} of Surah {surahName}. Detailed tafsir can be loaded from an external tafsir API.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ children, onClick, active, title }: {
  children: React.ReactNode; onClick: () => void; active?: boolean; title: string;
}) {
  return (
    <button onClick={onClick} title={title}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
      style={active ? { backgroundColor: SEC, color: "#fff" } : { backgroundColor: "var(--sidebar-hover)", color: "var(--muted)" }}
      onMouseEnter={(e) => { if (!active) { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = `${SEC}25`; b.style.color = SEC; } }}
      onMouseLeave={(e) => { if (!active) { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "var(--sidebar-hover)"; b.style.color = "var(--muted)"; } }}
    >
      {children}
    </button>
  );
}
