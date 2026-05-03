"use client";
import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";
import { useFontSettings } from "@/lib/useFontSettings";
import { fetchSurahAudio } from "@/lib/api";

export interface VerseTiming {
  verseKey: string;
  verseNumber: number;
  timestampFrom: number;
  timestampTo: number;
}

export interface PlayerSurah {
  surahId: number;
  surahName: string;
  surahTransliteration: string;
  totalVerses: number;
}

interface PlayerState {
  surah: PlayerSurah | null;
  playing: boolean;
  loading: boolean;
  progress: number;
  duration: number;
  currentVerseNumber: number;
  verseTimings: VerseTiming[];
}

interface PlayerContextValue extends PlayerState {
  playSurah: (surah: PlayerSurah) => void;
  togglePlay: () => void;
  seek: (pct: number) => void;
  seekToVerse: (timestampMs: number) => void;
  changeReciter: (reciterId: string) => void;
  stop: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    surah: null, playing: false, loading: false,
    progress: 0, duration: 0, currentVerseNumber: 0, verseTimings: [],
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Each load gets a unique token; if token changes mid-load, that load is stale and aborted
  const loadTokenRef = useRef(0);
  const currentSurahRef = useRef<PlayerSurah | null>(null);

  const { settings } = useFontSettings();
  const reciterRef = useRef(settings.reciter);
  useEffect(() => { reciterRef.current = settings.reciter; }, [settings.reciter]);

  function destroyAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.ontimeupdate = null;
      audioRef.current.onloadedmetadata = null;
      audioRef.current = null;
    }
  }

  const loadAndPlay = useCallback(async (reciterId: string, surah: PlayerSurah) => {
    // Increment token — any previous in-flight load will see its token is stale and bail
    const token = ++loadTokenRef.current;

    destroyAudio();
    currentSurahRef.current = surah;
    setState((s) => ({ ...s, surah, playing: false, loading: true, progress: 0, duration: 0, currentVerseNumber: 0, verseTimings: [] }));

    try {
      const data = await fetchSurahAudio(reciterId, surah.surahId);

      // Stale check — another load started after this one
      if (loadTokenRef.current !== token) return;

      const audio = new Audio(data.audioUrl);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        if (loadTokenRef.current !== token) return;
        setState((s) => ({ ...s, duration: audio.duration }));
      };

      audio.ontimeupdate = () => {
        if (loadTokenRef.current !== token) return;
        const ms = audio.currentTime * 1000;
        const current = data.verseTimings.findLast((vt) => ms >= vt.timestampFrom);
        setState((s) => ({
          ...s,
          progress: audio.currentTime,
          duration: audio.duration || s.duration,
          currentVerseNumber: current?.verseNumber ?? s.currentVerseNumber,
        }));
      };

      audio.onended = () => {
        if (loadTokenRef.current !== token) return;
        setState((s) => ({ ...s, playing: false, currentVerseNumber: 0 }));
      };

      audio.onerror = () => {
        if (loadTokenRef.current !== token) return;
        setState((s) => ({ ...s, playing: false, loading: false }));
      };

      setState((s) => ({ ...s, verseTimings: data.verseTimings, loading: false }));
      await audio.play();

      if (loadTokenRef.current !== token) {
        audio.pause();
        return;
      }

      setState((s) => ({ ...s, playing: true }));
    } catch {
      if (loadTokenRef.current !== token) return;
      setState((s) => ({ ...s, playing: false, loading: false }));
    }
  }, []);

  const playSurah = useCallback((surah: PlayerSurah) => {
    loadAndPlay(reciterRef.current, surah);
  }, [loadAndPlay]);

  const changeReciter = useCallback((reciterId: string) => {
    reciterRef.current = reciterId;
    if (currentSurahRef.current) {
      loadAndPlay(reciterId, currentSurahRef.current);
    }
  }, [loadAndPlay]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setState((s) => ({ ...s, playing: true }))).catch(() => {});
    } else {
      audio.pause();
      setState((s) => ({ ...s, playing: false }));
    }
  }, []);

  const seek = useCallback((pct: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (pct / 100) * audio.duration;
  }, []);

  const seekToVerse = useCallback((timestampMs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = timestampMs / 1000;
    if (audio.paused) {
      audio.play().then(() => setState((s) => ({ ...s, playing: true }))).catch(() => {});
    }
  }, []);

  const stop = useCallback(() => {
    loadTokenRef.current++; // invalidate any in-flight load
    destroyAudio();
    currentSurahRef.current = null;
    setState({ surah: null, playing: false, loading: false, progress: 0, duration: 0, currentVerseNumber: 0, verseTimings: [] });
  }, []);

  useEffect(() => () => destroyAudio(), []);

  return (
    <PlayerContext.Provider value={{ ...state, playSurah, togglePlay, seek, seekToVerse, changeReciter, stop }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}
