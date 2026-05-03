import { fetchSurahs } from "@/lib/api";
import HeroSearch from "@/components/HeroSearch";
import SurahCollection from "@/components/SurahCollection";
import Footer from "@/components/Footer";

export default async function HomePage() {
  const surahs = await fetchSurahs();

  return (
    <div className="max-w-screen-2xl mx-auto">
      <HeroSearch surahs={surahs} />
      <SurahCollection surahs={surahs} />
      <Footer />
    </div>
  );
}
