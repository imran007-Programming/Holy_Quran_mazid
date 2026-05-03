"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFontSettings } from "@/lib/useFontSettings";
import { useBookmarks } from "@/lib/useBookmarks";
import { usePlayer } from "@/lib/PlayerContext";
import AyahCard from "@/components/AyahCard";
import bismillahImg from "@/assets/bismillah.2a2f3d14.svg";

import { AyahReaderProps } from "@/lib/interfaces";

const SEC = "#428038";
const PER_PAGE = 5;

export default function AyahReader({ surah }: AyahReaderProps) {
  const { settings } = useFontSettings();
  const { toggle, isBookmarked } = useBookmarks();
  const {
    playSurah,
    togglePlay,
    playing,
    loading,
    surah: activeSurah,
    currentVerseNumber,
  } = usePlayer();
  const activeRef = useRef<HTMLDivElement | null>(null);

  const verses = surah.verses || [];
  const totalPages = Math.ceil(verses.length / PER_PAGE);
  const prevSurahId = useRef(surah.id);
  const [page, setPage] = useState(1);

  // Reset page when surah changes — done during render, not in an effect
  if (prevSurahId.current !== surah.id) {
    prevSurahId.current = surah.id;
    setPage(1);
  }

  const isThisSurah = activeSurah?.surahId === surah.id;
  const isPlaying = isThisSurah && playing;

  useEffect(() => {
    if (!isThisSurah || currentVerseNumber <= 0) return;
    const ayahPage = Math.ceil(currentVerseNumber / PER_PAGE);
    if (ayahPage !== page) setPage(ayahPage);
  }, [currentVerseNumber, isThisSurah]);

  useEffect(() => {
    if (isThisSurah && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentVerseNumber, isThisSurah, page]);

  const pageVerses = verses.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function goTo(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePlayAll() {
    if (isThisSurah) togglePlay();
    else
      playSurah({
        surahId: surah.id,
        surahName: surah.name,
        surahTransliteration: surah.transliteration,
        totalVerses: surah.total_verses,
      });
  }

  return (
    <div className="w-full mx-auto pb-32">
      {/* Surah Header */}
      <div className="border border-card-border rounded-2xl overflow-hidden mb-6">
        {/* Top strip — illustration + bismillah */}
        <div
          className="relative flex items-center justify-between px-6 py-4 border-b border-card-border"
          style={{ backgroundColor: `${SEC}08` }}
        >
          {/* Left — Makkah or Madinah image */}
          <div className="w-40 h-40 shrink-0 rounded-xl overflow-hidden">
            <Image
              src={surah.type === "meccan" ? "/makkah.webp" : "/madinah.webp"}
              alt={surah.type === "meccan" ? "Makkah" : "Madinah"}
              width={160}
              height={160}
              className="w-full h-full object-cover surah-location-img"
            />
          </div>
          {/* Center — surah name + type */}
          <div className="flex-1 text-center px-4">
            <h2 className="text-lg font-semibold text-foreground">
              {surah.transliteration}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <p className="text-xs font-medium" style={{ color: SEC }}>
                {surah.type === "meccan" ? "Makkah" : "Madinah"}
              </p>
              <span className="text-muted text-xs">·</span>
              <p className="text-muted text-xs">{surah.total_verses} Ayahs</p>
            </div>
          </div>
          {/* Right — Bismillah image */}
          <div className="shrink-0">
            <Image
              src={bismillahImg}
              alt="Bismillah"
              width={180}
              height={48}
              className="opacity-80"
              style={{ filter: "var(--bismillah-filter, none)" }}
            />
          </div>
        </div>
        {/* Bottom — stats + play */}
        <div className="flex items-center justify-center gap-3 px-6 py-4">
          <span className="text-muted text-xs bg-sidebar px-3 py-1 rounded-full border border-card-border">
            Surah {surah.id}
          </span>
          <span className="text-muted text-xs bg-sidebar px-3 py-1 rounded-full border border-card-border">
            {surah.total_verses} Verses
          </span>
          <button
            onClick={handlePlayAll}
            className="text-xs px-4 py-1.5 rounded-full flex items-center gap-1.5 border transition-colors"
            style={
              isPlaying
                ? { backgroundColor: SEC, borderColor: SEC, color: "#fff" }
                : loading && isThisSurah
                  ? {
                      backgroundColor: "rgba(66,128,56,0.2)",
                      borderColor: "rgba(66,128,56,0.4)",
                      color: SEC,
                    }
                  : {}
            }
          >
            {loading && isThisSurah ? (
              <>
                <svg
                  className="w-3 h-3 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeDasharray="31.4"
                    strokeDashoffset="10"
                  />
                </svg>
                Loading
              </>
            ) : isPlaying ? (
              <>
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Surah
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bismillah */}
      {surah.id !== 1 && surah.id !== 9 && page === 1 && (
        <div className="text-center mb-6">
          <p
            className="text-foreground leading-loose"
            style={{
              fontFamily: settings.arabicFont,
              fontSize: `${settings.arabicSize}px`,
              direction: "rtl",
            }}
          >
            بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>
      )}

      {/* Ayahs */}
      {pageVerses.map((verse) => {
        const isActive = isThisSurah && currentVerseNumber === verse.id;
        return (
          <div key={verse.id} ref={isActive ? activeRef : null}>
            <AyahCard
              verse={verse}
              surahId={surah.id}
              surahName={surah.name}
              surahTransliteration={surah.transliteration}
              surahType={surah.type}
              isBookmarked={isBookmarked(surah.id, verse.id)}
              onBookmark={() =>
                toggle({
                  surahId: surah.id,
                  verseId: verse.id,
                  surahName: surah.transliteration,
                  text: verse.text,
                })
              }
              totalVerses={surah.total_verses}
              isActive={isActive}
            />
          </div>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-full border text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderColor: "var(--card-border)", color: "var(--muted)" }}
            onMouseEnter={(e) => {
              if (page > 1) {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.borderColor = SEC;
                b.style.color = SEC;
              }
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.borderColor = "";
              b.style.color = "";
            }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
            Previous
          </button>

          <span className="text-muted text-sm">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-full border text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderColor: "var(--card-border)", color: "var(--muted)" }}
            onMouseEnter={(e) => {
              if (page < totalPages) {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.borderColor = SEC;
                b.style.color = SEC;
              }
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.borderColor = "";
              b.style.color = "";
            }}
          >
            Next
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
