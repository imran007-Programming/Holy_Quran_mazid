"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { FontSettings } from "./types";

const DEFAULT: FontSettings = {
  arabicFont: "Amiri",
  arabicSize: 28,
  translationSize: 16,
  reciter: "Alafasy_128kbps",
};

interface FontSettingsContextValue {
  settings: FontSettings;
  update: (patch: Partial<FontSettings>) => void;
}

const FontSettingsContext = createContext<FontSettingsContextValue>({
  settings: DEFAULT,
  update: () => {},
});

export function FontSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<FontSettings>(DEFAULT);

  useEffect(() => {
    const stored = localStorage.getItem("fontSettings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // migrate old reciter IDs to everyayah format
        if (!parsed.reciter || parsed.reciter.startsWith("ar.") || parsed.reciter === "Alafasy" || parsed.reciter === "Sudais") {
          parsed.reciter = "Alafasy_128kbps";
        }
        setSettings({ ...DEFAULT, ...parsed });
      } catch {}
    }
  }, []);

  function update(patch: Partial<FontSettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem("fontSettings", JSON.stringify(next));
      return next;
    });
  }

  return (
    <FontSettingsContext.Provider value={{ settings, update }}>
      {children}
    </FontSettingsContext.Provider>
  );
}

export function useFontSettings() {
  return useContext(FontSettingsContext);
}
