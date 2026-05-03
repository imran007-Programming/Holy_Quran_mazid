import { Surah, SearchResult } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchSurahs(): Promise<Surah[]> {
  const res = await fetch(`${API}/api/surahs`, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error("Failed to fetch surahs");
  return res.json();
}

export async function fetchSurah(id: number): Promise<Surah> {
  const res = await fetch(`${API}/api/surahs/${id}`, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error("Failed to fetch surah");
  return res.json();
}

export async function fetchSurahAudio(reciterId: string, surahId: number): Promise<{
  audioUrl: string;
  duration: number;
  verseTimings: { verseKey: string; verseNumber: number; timestampFrom: number; timestampTo: number }[];
}> {
  const res = await fetch(`${API}/api/audio/${encodeURIComponent(reciterId)}/${surahId}`);
  if (!res.ok) throw new Error("Failed to fetch audio");
  return res.json();
}

export async function searchAyahs(q: string): Promise<SearchResult[]> {
  const res = await fetch(`${API}/api/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}
