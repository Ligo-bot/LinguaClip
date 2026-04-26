# LinguaClip

Transform YouTube videos into interactive language learning experiences with bilingual subtitles, word lookup, and sentence looping.

![LinguaClip Banner](https://via.placeholder.com/800x200?text=LinguaClip)

## Features

- 🎬 **YouTube Video Parsing**: Extract subtitles from any YouTube video
- 🌍 **Bilingual Subtitles**: View English and Chinese translations side by side
- 📖 **Click-to-Define**: Click on any word to see its definition instantly
- 🔁 **Sentence Looping**: Loop any sentence repeatedly for practice
- ⚡ **Speed Control**: Adjust playback speed from 0.5x to 2.0x
- 🤖 **AI Transcription**: Automatic subtitle generation with Whisper AI
- 📱 **Mobile Friendly**: Responsive design works on all devices

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**

### Backend
- **Python FastAPI**
- **yt-dlp** (YouTube parsing)
- **OpenAI Whisper** (Audio transcription)

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- FFmpeg (for audio processing)
- OpenAI API key (for Whisper transcription)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Copy the environment file and configure:
```bash
cp .env.example .env
```

5. Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

6. Start the development server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Deployment

### Backend (Railway)

1. Create a new Railway project
2. Connect your GitHub repository
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `CORS_ORIGINS`
4. Deploy

Railway will automatically detect and use the Dockerfile.

### Frontend (Vercel)

1. Create a new Vercel project
2. Import your GitHub repository
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = Your Railway backend URL
4. Deploy

## API Endpoints

### POST `/api/video/parse`
Parse a YouTube video and extract subtitles.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "use_whisper": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "video_id": "...",
    "title": "...",
    "subtitles": [
      {
        "id": 0,
        "start": 0.0,
        "end": 5.0,
        "text": "Hello, welcome to...",
        "translation": "你好，欢迎来到..."
      }
    ],
    "has_subtitles": true
  },
  "processing_method": "youtube_captions"
}
```

### GET `/api/video/info/{video_id}`
Get basic video information.

### POST `/api/video/translate`
Translate subtitles to another language.

## Project Structure

```
LinguaClip/
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Home page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   └── learn/[videoId]/
│   │       └── page.tsx       # Learning interface
│   ├── components/
│   │   ├── VideoInput.tsx     # URL input component
│   │   ├── VideoPlayer.tsx    # YouTube player
│   │   ├── SubtitlePanel.tsx  # Subtitle list
│   │   └── ControlBar.tsx     # Playback controls
│   ├── lib/
│   │   └── api.ts             # API client
│   └── ...
├── backend/
│   ├── main.py                # FastAPI app
│   ├── routers/
│   │   └── video.py           # Video routes
│   ├── services/
│   │   ├── youtube.py         # YouTube parsing
│   │   └── whisper_service.py # Whisper API
│   └── ...
└── README.md
```

## How It Works

1. **Video Parsing**: Uses `yt-dlp` to extract video metadata and subtitles from YouTube
2. **Subtitle Extraction**: Parses YouTube's built-in captions or auto-generated captions
3. **Whisper Transcription**: For videos without subtitles, uses OpenAI Whisper API to transcribe audio
4. **Translation**: Translates subtitles using LibreTranslate (free) or falls back to original text

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - YouTube video downloader
- [OpenAI Whisper](https://openai.com/research/whisper) - Speech recognition
- [Free Dictionary API](https://dictionaryapi.dev/) - Word definitions
- [LibreTranslate](https://libretranslate.com/) - Free translation API

---

Built with ❤️ for language learners everywhere.
