"use client";
import { useState, useEffect } from "react";
import { Theme } from "./types";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Read from localStorage — inline script already applied the class before paint
    const stored = (localStorage.getItem("theme") as Theme) || "dark";
    setTheme(stored);
  }, []);

  function applyTheme(t: Theme) {
    const resolved =
      t === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        : t;
    document.documentElement.classList.remove("dark", "light", "sepia");
    document.documentElement.classList.add(resolved);
  }

  function update(t: Theme) {
    setTheme(t);
    localStorage.setItem("theme", t);
    applyTheme(t);
  }

  return { theme, update };
}
