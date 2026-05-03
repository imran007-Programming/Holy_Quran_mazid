# Quran Mazid 📖

A modern, full-stack Quran reading web app with audio recitation, bookmarks, search, and multiple themes.

🔗 **Live Demo:** [https://quranmazid-eta.vercel.app](https://quranmazid-eta.vercel.app)

---

## Features

- 📖 Read all 114 Surahs with Arabic text and English translation
- 🔊 Audio recitation with verse-by-verse highlighting
- 🔖 Bookmark ayahs and access them anytime
- 🔍 Search surahs by name, number or translation
- 🌙 Dark, Light, Sepia and System themes
- 🔤 Customizable Arabic font and size
- 📱 Fully responsive — works on mobile and desktop
- ⚡ ISR (Incremental Static Regeneration) for fast page loads

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Hono, Node.js, TypeScript |
| Audio | EveryAyah.com |
| Data | QuranCDN |
| Deployment | Vercel (frontend), Railway (backend) |

---

## Project Structure

```
Holy_Quran_mazid/
├── frontend/        # Next.js app
│   ├── app/         # Pages (Home, Surah, Bookmarks, Search)
│   ├── components/  # UI components
│   └── lib/         # API, hooks, utilities
└── backend/         # Hono REST API
    └── src/
        ├── controllers/
        ├── routes/
        └── services/
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repo

```bash
git clone https://github.com/your-username/Holy_Quran_mazid.git
cd Holy_Quran_mazid
```

### 2. Start the backend

```bash
cd backend
npm install
# Create .env file
echo "PORT=5000" > .env
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Start the frontend

```bash
cd frontend
npm install
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/surahs` | Get all 114 surahs |
| GET | `/api/surahs/:id` | Get surah with verses |
| GET | `/api/audio/:reciterId/:surahId` | Get audio URL + verse timings |
| GET | `/api/search?q=` | Search ayahs |

---

## Environment Variables

**Backend** (`backend/.env`):
```
PORT=5000
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
