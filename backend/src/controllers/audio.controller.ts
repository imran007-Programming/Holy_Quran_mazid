import { Context } from "hono";
import audioService from "../services/audio.service";

export const getSurahAudio = async (c: Context) => {
  const surahId = Number(c.req.param("surahId"));
  const reciterId = c.req.param("reciterId") ?? "Alafasy_128kbps";

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    return c.json({ error: "Invalid surah ID" }, 400);
  }

  const audio = await audioService.getSurahAudio(reciterId, surahId);
  if (!audio) return c.json({ error: "Audio not found" }, 404);

  return c.json(audio);
};
