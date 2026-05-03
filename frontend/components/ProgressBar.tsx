"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(0);

    const t1 = setTimeout(() => setProgress(30), 50);
    const t2 = setTimeout(() => setProgress(60), 200);
    const t3 = setTimeout(() => setProgress(85), 400);
    const t4 = setTimeout(() => setProgress(100), 600);
    const t5 = setTimeout(() => setVisible(false), 900);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[3px] transition-all duration-300 ease-out"
      style={{
        width: `${progress}%`,
        backgroundColor: "#428038",
        boxShadow: "0 0 8px rgba(66,128,56,0.7)",
      }}
    />
  );
}
