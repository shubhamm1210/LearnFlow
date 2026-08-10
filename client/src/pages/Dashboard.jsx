import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyCourses, importPlaylist } from "../services/courseService";
import { getVideoTopics } from "../utils";

const percent = (value) => Math.max(0, Math.min(100, Number(value) || 0));

function getStats(courses) {
  const videos = courses.flatMap((course) => Array.isArray(course.videos) ? course.videos : []);
  const completed = videos.filter((video) => video.completed);
  const total = courses.reduce((sum, course) => sum + (Number(course.totalVideos) || course.videos?.length || 0), 0);
  const completedCount = completed.length;
  const average = courses.length
    ? Math.round(courses.reduce((sum, course) => sum + percent(course.progress), 0) / courses.length)
    : 0;
  return { total, completedCount, average, courses: courses.length, videos };
}

function getLast7Days(videos) {
  const today = new Date();
  return Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(today);
    day.setHours(0, 0, 0, 0);
    day.setDate(today.getDate() - (6 - offset));
    const key = day.toISOString().slice(0, 10);
    const count = videos.filter((video) => video.completed && video.watchedAt?.slice?.(0, 10) === key).length;
    return { key, label: day.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2), count };
  });
}

function buildInsight(stats, activity) {
  if (!stats.courses) return "Import your first playlist and LearnFlow will start building your learning picture.";
  if (!stats.completedCount) return `You have ${stats.total} lessons waiting across ${stats.courses} course${stats.courses > 1 ? "s" : ""}. Start with one lesson today.`;
  const activeDays = activity.filter((day) => day.count > 0).length;
  if (stats.average >= 80) return `Excellent momentum — you're at ${stats.average}% average progress. Keep the streak going and finish the closest course next.`;
  if (activeDays >= 4) return `You're learning consistently across ${activeDays} of the last 7 days. A little more consistency can push your ${stats.average}% average even higher.`;
  return `You've completed ${stats.completedCount} of ${stats.total} lessons. Pick one unfinished lesson today to keep your progress moving.`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const stats = useMemo(() => getStats(courses), [courses]);
  const activity = useMemo(() => getLast7Days(stats.videos), [stats.videos]);
  const maxActivity = Math.max(1, ...activity.map((day) => day.count));
  const insight = buildInsight(stats, activity);
  const topicPerformance = useMemo(() => {
    const map = new Map();
    stats.videos.forEach((video) => {
      getVideoTopics(video).forEach((name) => {
        const item = map.get(name) || { name, total: 0, completed: 0 };
        item.total += 1;
        if (video.completed) item.completed += 1;
        map.set(name, item);
      });
    });
    return [...map.values()].sort((a, b) => {
      const ap = a.total ? a.completed / a.total : 0;
      const bp = b.total ? b.completed / b.total : 0;
      return bp - ap || b.total - a.total;
    });
  }, [stats.videos]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCourses(); }, []);

  const handleImport = async (e) => {
    e.preventDefault();
    if (!playlistUrl.trim()) return setError("Paste a YouTube playlist URL first.");
    try {
      setImporting(true);
      setError("");
      await importPlaylist(playlistUrl.trim());
      setPlaylistUrl("");
      await loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to import playlist.");
    } finally {
      setImporting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <main className="app-shell">
      <nav className="topbar app-nav">
        <Link className="brand" to="/">Learn<span>Flow</span></Link>
        <div className="nav-actions">
          <span className="welcome">Hi, {user.name?.split(" ")[0] || "Learner"}</span>
          <Link className="avatar-link" to="/profile">{(user.name || "L").charAt(0).toUpperCase()}</Link>
          <button className="ghost-btn" onClick={logout}>Log out</button>
        </div>
      </nav>

      <section className="dashboard-content">
        <div className="page-heading dashboard-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> DASHBOARD</div>
            <h1>Keep the momentum.</h1>
            <p className="muted">One lesson at a time. Your progress lives here.</p>
          </div>
          <span className="course-count">{stats.courses} course{stats.courses !== 1 ? "s" : ""}</span>
        </div>

        <div className="stats-grid">
          <article className="stat-card"><span className="stat-icon purple">◫</span><div><strong>{stats.courses}</strong><small>Courses</small></div></article>
          <article className="stat-card"><span className="stat-icon green">✓</span><div><strong>{stats.completedCount}</strong><small>Lessons completed</small></div></article>
          <article className="stat-card"><span className="stat-icon blue">↗</span><div><strong>{stats.average}%</strong><small>Average progress</small></div></article>
          <article className="stat-card"><span className="stat-icon orange">◷</span><div><strong>{stats.total}</strong><small>Total lessons</small></div></article>
        </div>

        <form onSubmit={handleImport} className="import-card import-card-new">
          <div className="import-copy"><div className="import-icon">＋</div><div><h2>Import a YouTube playlist</h2><p className="muted">Paste a public playlist URL. We'll turn it into a trackable course.</p></div></div>
          <div className="import-row"><input value={playlistUrl} onChange={(e) => setPlaylistUrl(e.target.value)} placeholder="https://youtube.com/playlist?list=..." /><button className="primary-btn" disabled={importing}>{importing ? "Importing…" : "Import Playlist"}</button></div>
        </form>

        {error && <div className="error-box">{error}</div>}

        {!loading && stats.courses > 0 && (
          <div className="analytics-grid">
            <article className="panel activity-panel">
              <div className="panel-heading"><div><span className="panel-kicker">ACTIVITY</span><h2>Last 7 days</h2></div><span className="panel-note">completed lessons</span></div>
              <div className="activity-chart">
                {activity.map((day) => <div className="bar-column" key={day.key}><span>{day.count || ""}</span><div className="bar-track"><i style={{ height: `${Math.max(6, (day.count / maxActivity) * 100)}%` }} /></div><small>{day.label}</small></div>)}
              </div>
            </article>
            <article className="panel insight-panel">
              <div className="panel-heading"><div><span className="panel-kicker">SMART INSIGHT</span><h2>Learning summary</h2></div><span className="spark">✦</span></div>
              <p className="insight-copy">{insight}</p>
              <div className="insight-footer"><span>Based on your completion activity</span><strong>{stats.average}% avg.</strong></div>
            </article>
          </div>
        )}

        {!loading && topicPerformance.length > 0 && (
          <section className="panel dashboard-topic-performance">
            <div className="panel-heading"><div><span className="panel-kicker">PERFORMANCE</span><h2>Topic-wise performance</h2></div><span className="panel-note">across your courses</span></div>
            <div className="dashboard-topic-list">
              {topicPerformance.map((item) => {
                const p = item.total ? Math.round((item.completed / item.total) * 100) : 0;
                return <div className="dashboard-topic-row" key={item.name}><div className="dashboard-topic-name"><strong>{item.name}</strong><span>{item.completed}/{item.total}</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${p}%` }} /></div><b>{p}%</b></div>;
              })}
            </div>
          </section>
        )}

        <div className="section-heading"><div><span className="panel-kicker">YOUR LIBRARY</span><h2>My courses</h2></div></div>

        {loading ? <div className="empty-state"><div className="loader" />Loading your courses…</div> : courses.length === 0 ? (
          <div className="empty-state empty-large"><div className="empty-icon">◒</div><h2>No courses yet</h2><p>Import your first YouTube playlist above and start building your learning plan.</p></div>
        ) : (
          <div className="course-grid">
            {courses.map((course) => (
              <article className="course-card" key={course._id} onClick={() => navigate(`/course/${course._id}`)}>
                <div className="course-thumb-wrap"><img src={course.thumbnail} alt="" /><span>{course.totalVideos || course.videos?.length || 0} lessons</span></div>
                <div className="course-card-body">
                  <h2>{course.playlistTitle || "Untitled Course"}</h2>
                  <div className="course-progress-row"><span>Progress</span><strong>{percent(course.progress)}%</strong></div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${percent(course.progress)}%` }} /></div>
                  <div className="course-card-footer"><span>{course.videos?.filter((v) => v.completed).length || 0} completed</span><b>Open course →</b></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
