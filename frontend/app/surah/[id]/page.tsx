import { fetchSurah, fetchSurahs } from "@/lib/api";
import AyahReader from "./AyahReader";

export async function generateStaticParams() {
  const surahs = await fetchSurahs();
  return surahs.map((s) => ({ id: String(s.id) }));
}

export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const surah = await fetchSurah(Number(id));

  return <AyahReader surah={surah} />;
}
