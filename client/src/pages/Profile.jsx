import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login", { replace: true }); };
  return <main className="app-shell"><nav className="topbar app-nav"><Link className="brand" to="/">Learn<span>Flow</span></Link><Link className="back-link" to="/dashboard">← Dashboard</Link></nav><section className="profile-wrap"><div className="profile-card profile-card-new"><div className="profile-avatar">{(user.name || "L").charAt(0).toUpperCase()}</div><span className="eyebrow">YOUR PROFILE</span><h1>{user.name || "Learner"}</h1><p>{user.email || "No email available"}</p><div className="profile-actions"><Link className="secondary-btn" to="/dashboard">Back to dashboard</Link><button className="danger-btn" onClick={logout}>Log out</button></div></div></section></main>;
}
