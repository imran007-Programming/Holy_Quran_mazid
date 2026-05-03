import { VerseTiming, SurahAudio } from "../types/audio.types";

// Reciter ID map: our frontend key → qurancdn reciter ID
const RECITER_MAP: Record<string, number> = {
  "Alafasy_128kbps":               7,
  "Yasser_Ad-Dussary_128kbps":     97,
  "Abdurrahmaan_As-Sudais_64kbps": 3,
  "Abdul_Basit_Murattal_192kbps":  2,
  "Husary_128kbps":                6,
  "Hani_Rifai_192kbps":            5,
  "MaherAlMuaiqly128kbps":         10,
};

class AudioService {
  async getSurahAudio(reciterId: string, surahId: number): Promise<SurahAudio | null> {
    const qdcId = RECITER_MAP[reciterId] ?? 7;
    const url = `https://api.qurancdn.com/api/qdc/audio/reciters/${qdcId}/audio_files?chapter_number=${surahId}&segments=true`;

    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json() as {
        audio_files: Array<{
          audio_url: string;
          duration: number;
          verse_timings: Array<{
            verse_key: string;
            timestamp_from: number;
            timestamp_to: number;
          }>;
        }>;
      };

      const file = data.audio_files?.[0];
      if (!file) return null;

      return {
        audioUrl: file.audio_url,
        duration: file.duration,
        verseTimings: file.verse_timings.map((vt) => ({
          verseKey: vt.verse_key,
          verseNumber: parseInt(vt.verse_key.split(":")[1]),
          timestampFrom: vt.timestamp_from,
          timestampTo: vt.timestamp_to,
        })),
      };
    } catch {
      return null;
    }
  }
}

export default new AudioService();
