"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HADITHS } from "@/lib/hadiths";

export default function HadithCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % HADITHS.length);
        setAnimating(false);
      }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const h = HADITHS[current];

  function handleClick() {
    router.push(`/surah/${h.surahId}#ayah-${h.ayah}`);
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 rounded-full" style={{ background: "#428038" }} />
        <h2 className="text-foreground font-semibold text-lg">Hadith of the Day</h2>
      </div>

      <div
        className={`cursor-pointer transition-all duration-300 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
        onClick={handleClick}
        title="Click to read the related verse"
      >
        <p className="text-foreground text-base sm:text-lg leading-relaxed mb-3">
          &ldquo;{h.text}&rdquo;
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: "#428038" }}>{h.narrator}</span>
          <span className="text-muted text-xs">·</span>
          <span className="text-muted text-xs">{h.source}</span>
        </div>
      </div>
    </section>
  );
}
