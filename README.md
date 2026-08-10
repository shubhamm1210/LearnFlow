# LearnFlow

LearnFlow turns public YouTube playlists into trackable learning courses.

## Final local setup

### Server
```bash
cd server
npm install
npm run dev
```

Create `server/.env` from `.env.example` and add your YouTube Data API v3 key. Local MongoDB is the default.

### Client
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173.

## Topic intelligence

On playlist import, LearnFlow classifies every video title locally using a domain-agnostic taxonomy. A title can have multiple topics.

The taxonomy covers:
- Computer science, web, cloud, cybersecurity, data/ML
- Mathematics and sciences
- Competitive exams: Maths, English, GK, Geography, History, Polity, Economics, Current Affairs, Defence, aptitude and reasoning
- Marketing, SEO, sales, lead generation, branding
- Finance, accounting, investing and trading
- Medicine and health
- Languages
- Design and creative tools
- Engineering
- Personal development and career

Classification happens once at import rather than repeatedly when a user completes a video. Completion only updates the already-detected topic performance.

If a title is ambiguous, it falls back to `General`. The classifier is deliberately deterministic and local so imports do not require one AI request per video.

## Deployment\n\n### Render backend\nSet the service root directory to `server`, build command to `npm install`, and start command to `npm start`. Add `MONGO_URI`, `JWT_SECRET`, `YOUTUBE_API_KEY`, and `CLIENT_URL` in Render Environment. `CLIENT_URL` can contain comma-separated allowed frontend origins.\n\n### Vercel frontend\nSet the project root directory to `client` and set `VITE_API_URL` to the Render backend URL (for example `https://your-service.onrender.com`). The client automatically appends `/api` when needed.\n\n## Atlas later

The app reads the database entirely from `MONGO_URI`. To move to MongoDB Atlas later, only replace `MONGO_URI` in the deployment environment; application code does not need a MongoDB-specific rewrite.
