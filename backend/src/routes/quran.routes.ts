import { Hono } from "hono";
import { getAllSurahs, getSurahById, searchAyahs } from "../controllers/quran.controller";
import { getSurahAudio } from "../controllers/audio.controller";

const quranRouter = new Hono();

quranRouter.get("/surahs", getAllSurahs);
quranRouter.get("/surahs/:id", getSurahById);
quranRouter.get("/search", searchAyahs);
quranRouter.get("/audio/:reciterId/:surahId", getSurahAudio);

export default quranRouter;
