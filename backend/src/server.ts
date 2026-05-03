import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import quranRouter from "./routes/quran.routes";

const app = new Hono();

app.use("*", cors());

app.route("/api", quranRouter);

const PORT = Number(process.env.PORT) || 5000;
app.get("/", (c) => c.json({ message: "Quran API is running" }));

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Quran API running at http://localhost:${PORT}`);
});
