export interface Verse {
  id: number;
  text: string;
  translation: string;
}

export interface Surah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: string;
  total_verses: number;
  verses?: Verse[];
}

export interface SearchResult {
  surahId: number;
  surahName: string;
  surahTransliteration: string;
  verse: Verse;
}

export interface FontSettings {
  arabicFont: string;
  arabicSize: number;
  translationSize: number;
  reciter: string;
}

export type Theme = "dark" | "light" | "sepia" | "system";
