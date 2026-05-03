import { Context } from "hono";
import quranService from "../services/quran.service";

export const getAllSurahs = (c: Context) => {
  return c.json(quranService.getAllSurahs());
};

export const getSurahById = (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid surah ID" }, 400);

  const surah = quranService.getSurahById(id);
  if (!surah) return c.json({ error: "Surah not found" }, 404);

  return c.json(surah);
};

export const searchAyahs = (c: Context) => {
  const q = c.req.query("q") || "";
  if (!q.trim()) return c.json([]);

  return c.json(quranService.search(q));
};
