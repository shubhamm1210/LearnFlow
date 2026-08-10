import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!form.email || !form.password) return setError("Please enter your email and password.");
    try { setLoading(true); const data = await loginUser(form); localStorage.setItem("token", data.token); localStorage.setItem("user", JSON.stringify(data)); navigate("/dashboard", { replace: true }); }
    catch (err) { setError(err.response?.data?.message || "Login failed."); }
    finally { setLoading(false); }
  };
  return <main className="auth-page"><div className="auth-decoration" /><section className="auth-card auth-card-new"><Link className="brand" to="/">Learn<span>Flow</span></Link><div className="auth-heading"><span className="eyebrow">WELCOME BACK</span><h1>Keep learning.</h1><p>Pick up exactly where you left off.</p></div>{error && <div className="error-box">{error}</div>}<form onSubmit={handleSubmit} className="form"><label>Email<input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" /></label><label>Password<input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" autoComplete="current-password" /></label><button className="primary-btn auth-submit" disabled={loading}>{loading ? "Signing in…" : "Login →"}</button></form><p className="auth-footer">Don't have an account? <Link to="/register">Create one</Link></p></section></main>;
}
