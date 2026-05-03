"use client";
import { useState, useEffect } from "react";

export interface Bookmark {
  surahId: number;
  verseId: number;
  surahName: string;
  text: string;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("bookmarks");
    if (stored) setBookmarks(JSON.parse(stored));
  }, []);

  function save(updated: Bookmark[]) {
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  }

  function toggle(bm: Bookmark) {
    const exists = bookmarks.some((b) => b.surahId === bm.surahId && b.verseId === bm.verseId);
    save(exists ? bookmarks.filter((b) => !(b.surahId === bm.surahId && b.verseId === bm.verseId)) : [...bookmarks, bm]);
  }

  function isBookmarked(surahId: number, verseId: number) {
    return bookmarks.some((b) => b.surahId === surahId && b.verseId === verseId);
  }

  return { bookmarks, toggle, isBookmarked };
}
