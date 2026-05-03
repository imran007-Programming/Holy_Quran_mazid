import { Surah, Verse } from "./types";

// AppShell
export interface AppShellProps {
  surahs: Surah[];
  children: React.ReactNode;
}

// AyahCard
export interface AyahCardProps {
  verse: Verse;
  surahId: number;
  surahName: string;
  surahTransliteration: string;
  surahType?: string;
  isBookmarked: boolean;
  onBookmark: () => void;
  totalVerses: number;
  isActive: boolean;
}

// AyahReader
export interface AyahReaderProps {
  surah: Surah;
}

// FontSettingsPanel
export interface FontSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// GoToAyahModal
export interface GoToAyahModalProps {
  surahs: Surah[];
  onClose: () => void;
}

// HeroSearch / SurahCollection
export interface SurahListProps {
  surahs: Surah[];
}

// IconSidebar
export interface IconSidebarProps {
  onGoToAyah: () => void;
  onSurahToggle: () => void;
}

// MobileNav
export interface MobileNavProps {
  onSurahToggle: () => void;
  onGoToAyah: () => void;
}

// SearchBar
export interface SearchBarProps {
  onClose?: () => void;
}

// SurahSidebar
export interface SurahSidebarProps {
  surahs: Surah[];
  isOpen: boolean;
  onClose: () => void;
}

// ThemeDropdown
export interface ThemeDropdownProps {
  theme: string;
  onChange: (t: "dark" | "light" | "sepia" | "system") => void;
}
