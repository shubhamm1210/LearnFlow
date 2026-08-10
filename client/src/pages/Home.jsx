import { Link } from "react-router-dom";

const features = [
  ["01", "Import playlists", "Turn any YouTube learning playlist into a structured course."],
  ["02", "Track completion", "Mark lessons complete and watch your progress update instantly."],
  ["03", "See the bigger picture", "Use course analytics and smart insights to keep your learning on track."],
];

export default function Home() {
  return (
    <main className="home-page">
      <nav className="topbar landing-nav">
        <Link className="brand" to="/">Learn<span>Flow</span></Link>
        <div className="nav-actions">
          <Link className="nav-link" to="/login">Login</Link>
          <Link className="primary-btn small" to="/register">Get Started <span>→</span></Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR LEARNING, ORGANIZED</div>
          <h1>Stop watching.<br /><em>Start finishing.</em></h1>
          <p>
            LearnFlow turns YouTube playlists into focused learning plans —
            with progress tracking, course analytics and smart study insights.
          </p>
          <div className="hero-actions">
            <Link className="primary-btn hero-btn" to="/register">Start Learning <span>→</span></Link>
            <Link className="secondary-btn hero-btn" to="/login">I already have an account</Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="floating-card mini-card top-card">
            <span className="mini-icon">✓</span>
            <div><strong>Lesson completed</strong><small>Just now</small></div>
          </div>
          <div className="dashboard-preview">
            <div className="preview-top"><span>My learning</span><b>82%</b></div>
            <div className="preview-title">DSA — Complete Roadmap</div>
            <div className="preview-bar"><i style={{ width: "82%" }} /></div>
            <div className="preview-stats"><span>147 lessons</span><span>121 completed</span></div>
            <div className="preview-chart">
              {[42, 57, 48, 72, 64, 88, 76].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}
            </div>
            <div className="preview-labels"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
          </div>
          <div className="floating-card insight-card">
            <span className="spark">✦</span>
            <div><small>Study insight</small><strong>You're on a 5-day streak.</strong></div>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        {features.map(([number, title, text]) => (
          <article key={number} className="feature-item">
            <span>{number}</span><div><h3>{title}</h3><p>{text}</p></div>
          </article>
        ))}
      </section>

      <section className="landing-bottom">
        <span className="eyebrow">BUILT FOR CONSISTENCY</span>
        <h2>Your playlist is the content.<br />LearnFlow is the system.</h2>
        <Link className="primary-btn" to="/register">Build your learning plan <span>→</span></Link>
      </section>
    </main>
  );
}
