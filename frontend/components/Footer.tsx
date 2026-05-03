import Link from "next/link";

const SEC = "#428038";

export default function Footer() {
  return (
    <footer className="border-t border-card-border mt-4 pt-10 pb-8">
      <style>{`.footer-link:hover { color: ${SEC} !important; }`}</style>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: SEC }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm0 16V14l2.5-1.5L11 14v6H6zm12 0h-5v-6l2.5-1.5L18 14v6zm0-8h-5V4h5v8z" />
              </svg>
            </div>
            <span className="text-foreground font-bold text-lg">Quran Mazid</span>
          </div>
          <p className="text-muted text-sm leading-relaxed">
            Read, listen and reflect on the Holy Quran. 114 Surahs, 6,236 Ayahs with translations and audio recitations.
          </p>
        </div>

        <div>
          <h4 className="text-foreground font-semibold text-sm mb-3">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { href: "/surah/1",   label: "Al-Fatihah" },
              { href: "/surah/36",  label: "Ya-Sin" },
              { href: "/surah/55",  label: "Ar-Rahman" },
              { href: "/surah/67",  label: "Al-Mulk" },
              { href: "/bookmarks", label: "My Bookmarks" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="footer-link text-muted text-sm transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-foreground font-semibold text-sm mb-3">Reciters</h4>
          <ul className="space-y-2">
            {["Mishary Alafasy", "Yasser Al-Dossary", "Abdurrahmaan As-Sudais", "Abdul Basit", "Mahmoud Al-Husary"].map((r) => (
              <li key={r} className="text-muted text-sm">{r}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-card-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-muted text-xs text-center sm:text-left">
          © {new Date().getFullYear()} Quran Mazid. Audio from{" "}
          <a href="https://everyayah.com" target="_blank" rel="noopener noreferrer"
            className="footer-link transition-colors hover:underline" style={{ color: SEC }}>
            EveryAyah.com
          </a>
          {" "}· Data from{" "}
          <a href="https://qurancdn.com" target="_blank" rel="noopener noreferrer"
            className="footer-link transition-colors hover:underline" style={{ color: SEC }}>
            QuranCDN
          </a>
        </p>
        <p className="text-sm" style={{ fontFamily: "Amiri", direction: "rtl", color: `${SEC}99` }}>
          وَرَتِّلِ ٱلۡقُرۡءَانَ تَرۡتِيلًا
        </p>
      </div>
    </footer>
  );
}
