"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Surah } from "@/lib/types";
import { HADITHS } from "@/lib/hadiths";
import { QUICK_SURAHS } from "@/lib/quickSurahs";
import quranImg from "@/assets/quran.png";

interface Props {
  surahs: Surah[];
}

export default function HeroSearch({ surahs }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<Surah[]>([]);
  const [hadithIdx, setHadithIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); inputRef.current?.focus(); }
      if (e.key === "Escape") inputRef.current?.blur();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => { setHadithIdx((c) => (c + 1) % HADITHS.length); setAnimating(false); }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    setResults(surahs.filter((s) =>
      s.transliteration.toLowerCase().includes(q) ||
      s.translation.toLowerCase().includes(q) ||
      s.name.includes(q) ||
      String(s.id) === q
    ).slice(0, 6));
  }, [query, surahs]);

  function go(id: number) { setQuery(""); setResults([]); router.push(`/surah/${id}`); }

  const h = HADITHS[hadithIdx];

  return (
    <section className="mb-10 py-10 sm:py-20">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-8">
        <div className="w-full">
          <p className="text-sm mb-3" style={{ fontFamily: "Amiri", direction: "rtl", color: "#428038" }}>
            بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-2 tracking-tight flex items-center justify-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: "#428038" }}>
              <Image src={quranImg} alt="Quran" width={40} height={40} className="object-contain" />
            </div>
            Quran <span style={{ color: "#428038" }}>Mazid</span>
          </h1>
          <p className="text-muted text-sm sm:text-base">
            Read, listen and reflect on the Holy Quran · 114 Surahs · 6,236 Ayahs
          </p>
        </div>

        <div className="relative w-full">
          <div className="flex items-center gap-3 bg-card border rounded-2xl px-4 py-3 transition-all duration-200"
            style={focused ? { borderColor: "#428038", boxShadow: "0 0 0 3px rgba(66,128,56,0.1)" } : { borderColor: "var(--card-border)" }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input ref={inputRef} type="text" value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="Search surah by name or number..."
              className="flex-1 bg-transparent text-foreground placeholder-muted text-sm focus:outline-none" />
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-sidebar border border-sidebar-border rounded-lg text-muted text-xs font-mono shrink-0">
              <span>Ctrl</span><span>+</span><span>K</span>
            </kbd>
          </div>
          {results.length > 0 && focused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-card-border rounded-2xl shadow-2xl overflow-hidden z-50">
              {results.map((s) => (
                <button key={s.id} onMouseDown={() => go(s.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sidebar-hover transition-colors text-left border-b border-card-border last:border-0">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: "rgba(66,128,56,0.1)", border: "1px solid rgba(66,128,56,0.3)", color: "#428038" }}>
                    {s.id}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-foreground text-sm font-medium">{s.transliteration}</span>
                    <span className="text-muted text-xs ml-2">{s.translation}</span>
                  </div>
                  <span className="text-foreground text-sm shrink-0" style={{ fontFamily: "Amiri" }}>{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {QUICK_SURAHS.map((s) => (
            <button key={s.id} onClick={() => go(s.id)}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-card-border rounded-full transition-all text-sm"
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(66,128,56,0.5)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = ""; }}>
              <span className="text-foreground font-medium">{s.name}</span>
              <span className="text-muted text-xs" style={{ fontFamily: "Amiri" }}>{s.arabic}</span>
            </button>
          ))}
        </div>

        <div className={`hidden sm:block cursor-pointer w-full transition-all duration-300 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
          onClick={() => router.push(`/surah/${h.surahId}#ayah-${h.ayah}`)}
          title="Click to read the related verse">
          <div className="w-1 h-5 rounded-full mx-auto mb-3" style={{ background: "#428038" }} />
          <p className="text-foreground text-base sm:text-lg leading-relaxed mb-3 italic">
            &ldquo;{h.text}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-medium" style={{ color: "#428038" }}>{h.narrator}</span>
            <span className="text-muted text-xs">·</span>
            <span className="text-muted text-xs">{h.source}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
