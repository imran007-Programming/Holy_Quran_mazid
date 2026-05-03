"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Surah } from "@/lib/types";

interface Props {
  surahs: Surah[];
  onClose: () => void;
}

export default function GoToAyahModal({ surahs, onClose }: Props) {
  const [surahId, setSurahId] = useState("1");
  const [ayahId, setAyahId] = useState("1");
  const router = useRouter();

  const selectedSurah = surahs.find((s) => s.id === Number(surahId));
  const maxAyah = selectedSurah?.total_verses ?? 1;

  function go() {
    router.push(`/surah/${surahId}#ayah-${ayahId}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-sidebar border border-sidebar-border rounded-2xl p-6 w-full max-w-sm z-10 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-foreground font-semibold text-lg">Go to Ayah</h3>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-muted text-sm block mb-1.5">Surah</label>
            <select
              value={surahId}
              onChange={(e) => { setSurahId(e.target.value); setAyahId("1"); }}
              className="w-full bg-card border border-card-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:border-green-500 transition-colors"
            >
              {surahs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id}. {s.transliteration} ({s.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-muted text-sm block mb-1.5">
              Ayah <span className="text-green-400">(1 – {maxAyah})</span>
            </label>
            <input
              type="number"
              min={1}
              max={maxAyah}
              value={ayahId}
              onChange={(e) => setAyahId(e.target.value)}
              className="w-full bg-card border border-card-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <button
            onClick={go}
            className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Go to Ayah
          </button>
        </div>
      </div>
    </div>
  );
}
