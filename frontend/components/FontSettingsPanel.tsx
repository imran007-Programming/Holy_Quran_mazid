"use client";
import { useState } from "react";
import { useFontSettings } from "@/lib/useFontSettings";
import { usePlayer } from "@/lib/PlayerContext";
import { RECITERS } from "@/lib/audio";
import { ARABIC_FONTS } from "@/lib/fonts";

const SEC = "#428038";

import { FontSettingsPanelProps } from "@/lib/interfaces";

export default function FontSettingsPanel({ isOpen, onClose }: FontSettingsPanelProps) {
  const { settings, update } = useFontSettings();
  const { surah: activeSurah, changeReciter } = usePlayer();
  const [pendingReciter, setPendingReciter] = useState<string | null>(null);

  function handleReciterClick(id: string) {
    if (id === settings.reciter) return;
    if (activeSurah) {
      setPendingReciter(id);
    } else {
      update({ reciter: id });
    }
  }

  function confirmChange() {
    if (!pendingReciter) return;
    update({ reciter: pendingReciter });
    changeReciter(pendingReciter);
    setPendingReciter(null);
  }

  const pendingLabel = RECITERS.find((r) => r.id === pendingReciter)?.label;

  return (
    <>
      <aside className={`
        fixed top-14 right-0 h-[calc(100vh-3.5rem)] w-72 bg-sidebar border-l border-sidebar-border z-40 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"}
      `}>
        <div className="px-4 py-4 border-b border-sidebar-border flex items-center justify-between">
          <div>
            <h3 className="text-foreground font-semibold text-sm">Display Settings</h3>
            <p className="text-muted text-xs mt-0.5">Font & size preferences</p>
          </div>
          <button onClick={onClose} className="xl:hidden w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-sidebar-hover transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Reciter */}
          <div>
            <label className="text-foreground text-xs font-semibold uppercase tracking-wider block mb-2">Reciter</label>
            <div className="space-y-1.5">
              {RECITERS.map((r) => {
                const active = settings.reciter === r.id;
                return (
                  <button key={r.id} onClick={() => handleReciterClick(r.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-left bg-card"
                    style={active ? { borderColor: SEC, backgroundColor: `${SEC}15` } : { borderColor: "var(--card-border)" }}>
                    {active ? (
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0" style={{ color: SEC }}>
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-muted shrink-0">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                      </svg>
                    )}
                    <span className="text-xs font-medium truncate" style={active ? { color: SEC } : { color: "var(--muted)" }}>
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Arabic Font */}
          <div>
            <label className="text-foreground text-xs font-semibold uppercase tracking-wider block mb-2">Arabic Font</label>
            <div className="space-y-1.5">
              {ARABIC_FONTS.map((f) => {
                const active = settings.arabicFont === f.value;
                return (
                  <button key={f.value} onClick={() => update({ arabicFont: f.value })}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all bg-card"
                    style={active ? { borderColor: SEC, backgroundColor: `${SEC}15` } : { borderColor: "var(--card-border)" }}>
                    <span className="text-xs font-medium flex items-center gap-1" style={active ? { color: SEC } : { color: "var(--muted)" }}>
                      {active && (
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current shrink-0">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      )}
                      {f.label}
                    </span>
                    <span className="text-foreground text-base" style={{ fontFamily: f.value }}>بِسۡمِ</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Arabic Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-foreground text-xs font-semibold uppercase tracking-wider">Arabic Size</label>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ color: SEC, backgroundColor: `${SEC}15` }}>
                {settings.arabicSize}px
              </span>
            </div>
            <input type="range" min={18} max={48} value={settings.arabicSize}
              onChange={(e) => update({ arabicSize: Number(e.target.value) })}
              className="w-full cursor-pointer" style={{ accentColor: SEC }} />
            <div className="flex justify-between text-muted text-xs mt-1"><span>18</span><span>48</span></div>
            <p className="text-right text-foreground mt-3 leading-loose bg-card border border-card-border rounded-lg px-3 py-2"
              style={{ fontFamily: settings.arabicFont, fontSize: `${settings.arabicSize}px`, direction: "rtl" }}>
              ٱلْحَمْدُ لِلَّهِ
            </p>
          </div>

          {/* Translation Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-foreground text-xs font-semibold uppercase tracking-wider">Translation Size</label>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ color: SEC, backgroundColor: `${SEC}15` }}>
                {settings.translationSize}px
              </span>
            </div>
            <input type="range" min={12} max={24} value={settings.translationSize}
              onChange={(e) => update({ translationSize: Number(e.target.value) })}
              className="w-full cursor-pointer" style={{ accentColor: SEC }} />
            <div className="flex justify-between text-muted text-xs mt-1"><span>12</span><span>24</span></div>
            <p className="text-muted mt-3 leading-relaxed bg-card border border-card-border rounded-lg px-3 py-2"
              style={{ fontSize: `${settings.translationSize}px` }}>
              All praise is due to Allah
            </p>
          </div>
        </div>
      </aside>

      {/* Confirmation modal */}
      {pendingReciter && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-sidebar border border-sidebar-border rounded-2xl p-6 w-80 shadow-2xl">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${SEC}20` }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" style={{ color: SEC }}>
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <h3 className="text-foreground font-semibold text-base mb-1">Change Reciter?</h3>
            <p className="text-muted text-sm mb-5">
              Switch to <span className="text-foreground font-medium">{pendingLabel}</span>? The current surah will restart with the new reciter.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPendingReciter(null)}
                className="flex-1 py-2 rounded-xl border border-sidebar-border text-muted text-sm hover:bg-sidebar-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmChange}
                className="flex-1 py-2 rounded-xl text-white text-sm transition-opacity hover:opacity-80"
                style={{ backgroundColor: SEC }}
              >
                Yes, Change
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
