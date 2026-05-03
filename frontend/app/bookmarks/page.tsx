"use client";
import Link from "next/link";
import { useBookmarks } from "@/lib/useBookmarks";

export default function BookmarksPage() {
  const { bookmarks, toggle } = useBookmarks();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold text-foreground mb-6">Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current mx-auto mb-3 opacity-30">
            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
          </svg>
          <p>No bookmarks yet</p>
          <p className="text-xs mt-1">Bookmark ayahs while reading to see them here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bm) => (
            <div
              key={`${bm.surahId}-${bm.verseId}`}
              className="flex items-start gap-3 p-4 bg-card border border-card-border rounded-xl"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 text-xs bg-green-500/10 px-2 py-0.5 rounded-full">
                    {bm.surahName} · Ayah {bm.verseId}
                  </span>
                </div>
                <p
                  className="text-right text-foreground text-lg leading-loose"
                  style={{ fontFamily: "Amiri", direction: "rtl" }}
                >
                  {bm.text}
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Link
                  href={`/surah/${bm.surahId}#ayah-${bm.verseId}`}
                  className="w-8 h-8 rounded-lg bg-sidebar-hover text-muted hover:text-green-400 flex items-center justify-center transition-colors"
                  title="Go to ayah"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </Link>
                <button
                  onClick={() => toggle(bm)}
                  className="w-8 h-8 rounded-lg bg-sidebar-hover text-muted hover:text-red-400 flex items-center justify-center transition-colors"
                  title="Remove bookmark"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
