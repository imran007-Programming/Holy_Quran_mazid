export interface VerseTiming {
  verseKey: string;
  verseNumber: number;
  timestampFrom: number; // ms
  timestampTo: number;   // ms
}

export interface SurahAudio {
  audioUrl: string;
  duration: number; // ms
  verseTimings: VerseTiming[];
}
