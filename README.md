# LearnFlow — YouTube Learning Tracker

LearnFlow turns public YouTube playlists into structured, trackable learning courses. It imports playlist and video metadata, classifies video titles into one or more topics, and tracks course progress.

## How it works

1. A user imports a public YouTube playlist.
2. The backend fetches playlist and video metadata using YouTube Data API v3.
3. Each video title is classified locally into one or more topics.
4. The playlist is saved as a structured course.
5. Completing a video updates saved progress without re-running classification.

## Topic intelligence

LearnFlow uses a deterministic, local title classifier. It does not make an AI request for every video. A title can map to multiple topics; titles with no taxonomy match fall back to `General`.

The taxonomy spans computer science, mathematics and science, competitive exams, business and marketing, medicine and health, languages, design, engineering, and personal development.

The classifier is rule-based. Its accuracy has not yet been evaluated against a manually labelled benchmark dataset, so this README does not claim an accuracy percentage.

## Features

- Import public YouTube playlists using YouTube Data API v3
- Multi-topic video-title classification
- Topic-level learning progress
- General fallback for ambiguous titles
- JWT-based authentication
- React + Node.js + Express + MongoDB architecture
- Separate frontend and backend deployment configuration

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JWT |
| External API | YouTube Data API v3 |

## Repository structure

```text
LearnFlow/
├── client/                 # React + Vite frontend
├── server/                 # Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   └── utils/topicClassifier.js
├── docs/
└── README.md
```

## Local development

### Prerequisites

- Node.js LTS
- npm
- MongoDB (local instance or Atlas)
- YouTube Data API v3 key

### Backend

```bash
git clone https://github.com/shubhamm1210/LearnFlow.git
cd LearnFlow/server
npm install
```

Copy `.env.example` to `.env` and configure `MONGO_URI`, `JWT_SECRET`, `YOUTUBE_API_KEY`, `PORT`, and `CLIENT_URL`. Keep real credentials out of Git.

Start the API:

```bash
npm run dev
```

### Frontend

In a second terminal:

```bash
cd LearnFlow/client
npm install
npm run dev
```

Set `VITE_API_URL` when the backend is running at a non-default address. The local default is `http://localhost:5000`.

## Tests

The topic classifier tests use Node's built-in test runner and do not require MongoDB or YouTube API credentials:

```bash
cd server
npm test
```

To measure accuracy on your own hand-labelled sample (recommended: 50–100 titles from varied playlists), prepare a JSON file with this structure:

```json
[
  {
    "title": "Binary Search in a Sorted Array",
    "expectedTopics": ["Binary Search", "Arrays"]
  }
]
```

Then run the evaluator:

```bash
cd server
node scripts/evaluateClassifier.js path/to/labelled-titles.json
```

It reports exact-match accuracy and micro-averaged precision, recall, and F1. The expected topics must be assigned by a human; the evaluator does not create ground truth.

## Deployment

### Backend — Render

Set the service root directory to `server`, install with `npm install`, and start with `npm start`. Configure the backend environment variables using `server/.env.example`.

### Frontend — Vercel

Set the project root directory to `client`, build with `npm run build`, and set `VITE_API_URL` to the deployed backend origin.

## Screenshots

Add current screenshots of the landing page, dashboard, and course detail page under `docs/screenshots/` and link them here. The repository does not currently contain these screenshots.

## Author

**Shubham Kumar** · [GitHub](https://github.com/shubhamm1210) · [LinkedIn](https://www.linkedin.com/in/shubhamkumar1210/)
