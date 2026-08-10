import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourse, toggleVideoComplete } from "../services/courseService";
import { getVideoTopics } from "../utils";

const percent = (value) => Math.max(0, Math.min(100, Number(value) || 0));

export default function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [topic, setTopic] = useState("all");
  const [sort, setSort] = useState("position");
  const [search, setSearch] = useState("");

  const loadCourse = async () => {
    try { setLoading(true); setError(""); setCourse(await getCourse(id)); }
    catch (err) { setError(err.response?.data?.message || "Failed to load course."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadCourse(); }, [id]);

  const handleToggle = async (videoId) => {
    try { setCourse(await toggleVideoComplete(id, videoId)); }
    catch (err) { setError(err.response?.data?.message || "Failed to update lesson."); }
  };

  const videos = Array.isArray(course?.videos) ? course.videos : [];
  const completed = videos.filter((video) => video.completed).length;

  const topics = useMemo(() => {
    const map = new Map();
    videos.forEach((video) => {
      getVideoTopics(video).forEach((name) => {
        const item = map.get(name) || { name, total: 0, completed: 0 };
        item.total += 1;
        if (video.completed) item.completed += 1;
        map.set(name, item);
      });
    });
    return [...map.values()].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  }, [videos]);

  const filteredVideos = useMemo(() => {
    const list = videos.filter((video) => {
      const matchesFilter = filter === "all" || (filter === "completed" ? video.completed : !video.completed);
      const videoTopics = getVideoTopics(video);
      const matchesTopic = topic === "all" || videoTopics.includes(topic);
      const matchesSearch = video.title.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesTopic && matchesSearch;
    });

    return [...list].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "topic") return getVideoTopics(a)[0].localeCompare(getVideoTopics(b)[0]) || (a.position ?? 0) - (b.position ?? 0);
      if (sort === "completed") return Number(a.completed) - Number(b.completed) || (a.position ?? 0) - (b.position ?? 0);
      return (a.position ?? 0) - (b.position ?? 0);
    });
  }, [videos, filter, topic, sort, search]);

  if (loading) return <main className="center-page"><div className="loader" /><p>Loading course…</p></main>;
  if (error || !course) return <main className="center-page"><div className="empty-icon">!</div><h1>Unable to load course</h1><p className="error-text">{error || "Course not found."}</p><Link className="primary-btn" to="/dashboard">Back to Dashboard</Link></main>;

  return (
    <main className="app-shell course-page">
      <nav className="topbar app-nav">
        <Link className="brand" to="/">Learn<span>Flow</span></Link>
        <Link className="back-link" to="/dashboard">← Dashboard</Link>
      </nav>

      <section className="course-header course-header-new">
        <div className="course-header-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> COURSE</span>
          <h1>{course.playlistTitle || "Untitled Course"}</h1>
          <p>{videos.length} lessons · {completed} completed · {topics.length} detected topics</p>
        </div>
        <div className="progress-panel-new">
          <div className="ring" style={{ "--progress": `${percent(course.progress)}%` }}>
            <span>{percent(course.progress)}<small>%</small></span>
          </div>
          <div>
            <span className="panel-kicker">COURSE PROGRESS</span>
            <strong>{percent(course.progress)}% complete</strong>
            <small>{completed} of {videos.length} lessons completed.</small>
          </div>
        </div>
      </section>

      <section className="topic-performance">
        <div className="panel-heading">
          <div><span className="panel-kicker">PERFORMANCE</span><h2>Topic-wise performance</h2></div>
          <span className="panel-note">multi-topic lessons counted in each relevant topic</span>
        </div>

        <div className="topic-grid">
          {topics.map((item) => {
            const p = item.total ? Math.round((item.completed / item.total) * 100) : 0;
            return (
              <button
                className={`topic-card ${topic === item.name ? "selected" : ""}`}
                key={item.name}
                onClick={() => setTopic(topic === item.name ? "all" : item.name)}
              >
                <div className="topic-card-top"><strong>{item.name}</strong><span>{p}%</span></div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${p}%` }} /></div>
                <small>{item.completed}/{item.total} completed</small>
              </button>
            );
          })}
        </div>
      </section>

      <section className="video-list">
        <div className="course-toolbar extended-toolbar">
          <div className="filter-tabs">
            <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All <span>{videos.length}</span></button>
            <button className={filter === "pending" ? "active" : ""} onClick={() => setFilter("pending")}>To do <span>{videos.length - completed}</span></button>
            <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Completed <span>{completed}</span></button>
          </div>

          <div className="course-controls">
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="all">All topics</option>
              {topics.map((item) => <option value={item.name} key={item.name}>{item.name}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="position">Playlist order</option>
              <option value="topic">Topic</option>
              <option value="title">Title A–Z</option>
              <option value="completed">Incomplete first</option>
            </select>
            <input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lessons…" />
          </div>
        </div>

        <div className="results-note">
          Showing <strong>{filteredVideos.length}</strong> of {videos.length} lessons
          {topic !== "all" ? <> in <strong>{topic}</strong></> : ""}.
        </div>

        {filteredVideos.map((video, index) => (
          <article className={`video-row video-row-new ${video.completed ? "completed" : ""}`} key={video._id}>
            <div className="video-number">{String(index + 1).padStart(2, "0")}</div>
            <img src={video.thumbnail} alt="" />
            <div className="video-info">
              <div className="video-title-line">
                <h3>{video.title}</h3>
                {video.completed && <span className="done-pill">Completed</span>}
              </div>
              <div className="video-meta">
                <div className="topic-pills">
                  {getVideoTopics(video).map((name) => <span className="topic-pill" key={name}>{name}</span>)}
                </div>
                <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
              </div>
            </div>
            <button className={video.completed ? "complete-btn done" : "complete-btn"} onClick={() => handleToggle(video._id)}>
              {video.completed ? "✓ Done" : "Mark complete"}
            </button>
          </article>
        ))}

        {!filteredVideos.length && <div className="empty-state">No lessons match these filters.</div>}
      </section>
    </main>
  );
}
