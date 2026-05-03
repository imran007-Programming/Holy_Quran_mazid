import fs from "fs";
import path from "path";
import { Surah, SearchResult } from "../types/quran.types";

class QuranService {
  private data: Surah[];

  constructor() {
    this.data = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/quran_en.json"), "utf-8")
    );
  }

  getAllSurahs(): Omit<Surah, "verses">[] {
    return this.data.map(({ id, name, transliteration, translation, type, total_verses }) => ({
      id, name, transliteration, translation, type, total_verses,
    }));
  }

  getSurahById(id: number): Surah | null {
    return this.data.find((s) => s.id === id) ?? null;
  }

  search(q: string, limit = 50): SearchResult[] {
    const query = q.toLowerCase().trim();
    if (!query) return [];

    const results: SearchResult[] = [];

    for (const surah of this.data) {
      for (const verse of surah.verses) {
        if (verse.translation?.toLowerCase().includes(query) || verse.text?.includes(query)) {
          results.push({
            surahId: surah.id,
            surahName: surah.name,
            surahTransliteration: surah.transliteration,
            verse,
          });
          if (results.length >= limit) return results;
        }
      }
    }

    return results;
  }
}

export default new QuranService();
