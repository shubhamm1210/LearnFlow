import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!form.name || !form.email || !form.password) return setError("All fields are required.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    try { setLoading(true); const data = await registerUser(form); localStorage.setItem("token", data.token); localStorage.setItem("user", JSON.stringify(data)); navigate("/dashboard", { replace: true }); }
    catch (err) { setError(err.response?.data?.message || "Registration failed."); }
    finally { setLoading(false); }
  };
  return <main className="auth-page"><div className="auth-decoration" /><section className="auth-card auth-card-new"><Link className="brand" to="/">Learn<span>Flow</span></Link><div className="auth-heading"><span className="eyebrow">GET STARTED</span><h1>Build your flow.</h1><p>Turn your learning playlists into a plan you can actually finish.</p></div>{error && <div className="error-box">{error}</div>}<form onSubmit={handleSubmit} className="form"><label>Name<input name="name" value={form.name} onChange={handleChange} placeholder="Your name" autoComplete="name" /></label><label>Email<input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" /></label><label>Password<input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Minimum 6 characters" autoComplete="new-password" /></label><button className="primary-btn auth-submit" disabled={loading}>{loading ? "Creating account…" : "Create account →"}</button></form><p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p></section></main>;
}
