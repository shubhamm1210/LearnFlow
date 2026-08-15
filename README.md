# 📚 LearnFlow — YouTube Learning Tracker

LearnFlow turns public YouTube playlists into structured, trackable learning courses.

It imports playlist and video information from YouTube, organizes videos by topic, and tracks learning progress based on the topics identified during playlist import.

---

## 🚀 How It Works

1. Import a public YouTube playlist.
2. LearnFlow fetches the playlist and video metadata using the YouTube Data API v3.
3. Each video title is classified into one or more relevant topics.
4. The playlist becomes a structured learning course.
5. As videos are completed, topic-level progress is updated.

Topic classification is performed once when the playlist is imported. Completing a video only updates the existing topic performance instead of running the classifier again.

---

## 🧠 Topic Intelligence

LearnFlow uses a deterministic, local classification system to categorize video titles without making an AI request for every video.

A video can belong to multiple topics. If a title cannot be confidently classified, it falls back to `General`.

### Supported Domains

* **Computer Science & Technology:** Web, Cloud, Cybersecurity, Data & ML
* **Mathematics & Sciences**
* **Competitive Exams:** Maths, English, GK, Geography, History, Polity, Economics, Current Affairs, Defence, Aptitude & Reasoning
* **Marketing:** SEO, Sales, Lead Generation, Branding
* **Finance:** Accounting, Investing & Trading
* **Medicine & Health**
* **Languages**
* **Design & Creative Tools**
* **Engineering**
* **Personal Development & Career**

The classifier is deliberately deterministic and local, making playlist imports predictable and avoiding repeated external AI requests.

---

## ✨ Key Features

* Import public YouTube playlists as learning courses
* Fetch playlist and video metadata using YouTube Data API v3
* Automatic topic classification of video titles
* Support for multiple topics per video
* Topic-level learning progress tracking
* `General` fallback for ambiguous titles
* Local and deterministic classification
* MERN-based full-stack architecture

---

## 🏗️ Tech Stack

### Frontend

* React
* Vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### API

* YouTube Data API v3

---

## 📂 Project Structure

```text
LearnFlow/
├── client/
│   ├── ...
│   └──
│
├── server/
│   ├── ...
│   └──
│
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
```

### 2. Start the server

```bash
cd server
npm install
npm run dev
```

Create `server/.env` using `.env.example` and add your YouTube Data API v3 key.

Local MongoDB is used by default.

### 3. Start the client

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 🌐 Deployment

### Backend — Render

Set the service root directory to:

```text
server
```

Use:

```text
Build command: npm install
Start command: npm start
```

Add the following environment variables:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
YOUTUBE_API_KEY=your_youtube_api_key
CLIENT_URL=your_frontend_url
```

`CLIENT_URL` can contain comma-separated allowed frontend origins.

### Frontend — Vercel

Set the project root directory to:

```text
client
```

Configure:

```env
VITE_API_URL=https://your-service.onrender.com
```

The client automatically appends `/api` when required.

---

## 🗄️ MongoDB

The application reads its database connection entirely from `MONGO_URI`.

To use MongoDB Atlas instead of a local MongoDB instance, replace the `MONGO_URI` value in the deployment environment. No MongoDB-specific changes to the application code are required.

---

## 👨‍💻 Author

**Shubham Kumar**

Computer Engineering Undergraduate
NIAMT Ranchi

* GitHub: https://github.com/YOUR-USERNAME
* LinkedIn: https://www.linkedin.com/in/YOUR-USERNAME/
