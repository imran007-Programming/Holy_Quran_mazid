import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { fetchSurahs } from "@/lib/api";
import AppShell from "@/components/AppShell";
import ProgressBar from "@/components/ProgressBar";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quran Reader",
  description: "Read and listen to the Holy Quran",
};

// Runs synchronously before first paint — no flash possible
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme') || 'dark';
    var r = t === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : t;
    document.documentElement.classList.add(r);
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const surahs = await fetchSurahs();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Must be first in head — blocks paint until theme class is set */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Scheherazade+New:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <AppShell surahs={surahs}>
            <Suspense fallback={null}>
              <ProgressBar />
            </Suspense>
            {children}
          </AppShell>
      </body>
    </html>
  );
}
