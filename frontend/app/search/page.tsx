"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { searchAyahs } from "@/lib/api";
import { SearchResult } from "@/lib/types";
import SearchBar from "@/components/SearchBar";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const data = await searchAyahs(q);
        if (!cancelled) setResults(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [q]);

  // Reset results when query is cleared
  const displayResults = q ? results : [];

  return (
    <>
      {q && (
        <p className="text-gray-400 text-sm mb-4">
          {loading ? "Searching..." : `${displayResults.length} result${displayResults.length !== 1 ? "s" : ""} for "${q}"`}
        </p>
      )}

      <div className="space-y-3">
        {displayResults.map((r) => (
          <Link
            key={`${r.surahId}-${r.verse.id}`}
            href={`/surah/${r.surahId}/#ayah-${r.verse.id}`}
            className="block p-4 bg-[#12122a] border border-[#2a2a4a] rounded-xl hover:border-[#4CAF50]/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#4CAF50] text-xs bg-[#4CAF50]/10 px-2 py-0.5 rounded-full">
                {r.surahTransliteration} {r.surahId}:{r.verse.id}
              </span>
            </div>
            <p
              className="text-right text-white text-lg mb-2"
              style={{ fontFamily: "Amiri", direction: "rtl" }}
            >
              {r.verse.text}
            </p>
            <p className="text-gray-300 text-sm">{r.verse.translation}</p>
          </Link>
        ))}

        {q && !loading && displayResults.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current mx-auto mb-3 opacity-30">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <p>No results found for &quot;{q}&quot;</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white mb-4">Search Quran</h1>
        <SearchBar />
      </div>
      <Suspense fallback={<p className="text-gray-400 text-sm">Loading...</p>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
