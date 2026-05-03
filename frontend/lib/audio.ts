export const RECITERS = [
  { id: "Alafasy_128kbps",              label: "Mishary Alafasy" },
  { id: "Yasser_Ad-Dussary_128kbps",    label: "Yasser Al-Dossary" },
  { id: "Abdurrahmaan_As-Sudais_64kbps",label: "Abdurrahmaan As-Sudais" },
  { id: "Abdul_Basit_Murattal_192kbps", label: "Abdul Basit (Murattal)" },
  { id: "Husary_128kbps",               label: "Mahmoud Khalil Al-Husary" },
  { id: "Hani_Rifai_192kbps",           label: "Hani Ar-Rifai" },
  { id: "MaherAlMuaiqly128kbps",        label: "Maher Al-Muaiqly" },
];

function pad(n: number, len: number) {
  return String(n).padStart(len, "0");
}

function buildUrls(reciterId: string, surahId: number, verseId: number): string[] {
  const file = `${pad(surahId, 3)}${pad(verseId, 3)}.mp3`;
  return [
    `https://everyayah.com/data/${reciterId}/${file}`,
    `https://audio.qurancdn.com/Alafasy/mp3/${file}`, // fallback always Alafasy
  ];
}

export function createAyahAudio(
  surahId: number,
  verseId: number,
  reciterId: string,
  onEnded: () => void,
  onError: () => void
): HTMLAudioElement {
  const urls = buildUrls(reciterId, surahId, verseId);
  const audio = new Audio();

  urls.forEach((url) => {
    const source = document.createElement("source");
    source.src = url;
    source.type = "audio/mpeg";
    audio.appendChild(source);
  });

  audio.onended = onEnded;
  audio.onerror = onError;
  return audio;
}

export async function safePlay(audio: HTMLAudioElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (audio.readyState >= 3) {
      audio.play().then(resolve).catch(reject);
      return;
    }

    const onCanPlay = () => { cleanup(); audio.play().then(resolve).catch(reject); };
    const onErr    = () => { cleanup(); reject(new Error("Audio source not supported")); };
    const cleanup  = () => {
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onErr);
    };

    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("error", onErr);
    audio.load();
  });
}
