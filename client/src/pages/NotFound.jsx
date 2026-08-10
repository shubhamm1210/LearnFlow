import { Link } from "react-router-dom";
export default function NotFound() { return <main className="center-page"><div className="empty-icon">404</div><h1>Page not found</h1><p className="muted">The page you requested doesn't exist.</p><Link className="primary-btn" to="/">Back home →</Link></main>; }
