"use client";
import { usePlayer } from "@/lib/PlayerContext";
import { useFontSettings } from "@/lib/useFontSettings";
import { RECITERS } from "@/lib/audio";

const SEC = "#428038";

function fmt(sec: number) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function BottomPlayer() {
  const { surah, playing, loading, progress, duration, currentVerseNumber, verseTimings, togglePlay, seek, stop } = usePlayer();
  const { settings } = useFontSettings();

  if (!surah) return null;

  const pct = duration > 0 ? (progress / duration) * 100 : 0;
  const reciterLabel = RECITERS.find((r) => r.id === settings.reciter)?.label ?? "Reciter";
  const currentTiming = verseTimings.find((vt) => vt.verseNumber === currentVerseNumber);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border shadow-2xl">
      {/* Progress bar */}
      <div
        className="h-1 bg-sidebar-hover cursor-pointer group relative"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          seek(((e.clientX - rect.left) / rect.width) * 100);
        }}
      >
        <div className="h-full relative" style={{ width: `${pct}%`, backgroundColor: SEC }}>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: SEC }} />
        </div>
        {duration > 0 && verseTimings.map((vt) => (
          <div
            key={vt.verseNumber}
            className="absolute top-0 w-px h-full"
            style={{ left: `${(vt.timestampFrom / 1000 / duration) * 100}%`, backgroundColor: `${SEC}50` }}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 px-4 py-3 lg:ml-16 xl:ml-80 xl:mr-64">
        {/* Surah + ayah info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0"
            style={{ backgroundColor: `${SEC}20`, border: `1px solid ${SEC}50` }}>
            <span className="text-xs font-bold leading-none" style={{ color: SEC }}>{surah.surahId}</span>
            {currentVerseNumber > 0 && (
              <span className="text-xs leading-none mt-0.5" style={{ color: SEC }}>{currentVerseNumber}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-foreground text-sm font-medium truncate">{surah.surahTransliteration}</p>
            <p className="text-muted text-xs truncate">
              {currentVerseNumber > 0
                ? `Ayah ${currentVerseNumber} of ${surah.totalVerses}`
                : `${surah.totalVerses} verses`}
              {" · "}{reciterLabel}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full text-white flex items-center justify-center transition-opacity shadow-lg hover:opacity-80"
            style={{ backgroundColor: SEC }}
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="10" />
              </svg>
            ) : playing ? (
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1 text-muted text-xs font-mono">
          <span style={{ color: SEC }}>{fmt(progress)}</span>
          <span>/</span>
          <span>{fmt(duration)}</span>
        </div>

        {/* Current ayah badge */}
        {currentTiming && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${SEC}15`, border: `1px solid ${SEC}50` }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: SEC }} />
            <span className="text-xs font-medium" style={{ color: SEC }}>Ayah {currentVerseNumber}</span>
          </div>
        )}

        {/* Stop */}
        <button onClick={stop} title="Close player"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
