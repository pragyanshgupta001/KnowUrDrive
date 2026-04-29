import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/axios";
import useAuthStore from "../../store/authStore";

export default function Login() {
  const navigate              = useNavigate();
  const { setAuth }           = useAuthStore();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Please fill in all fields");
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", form);
      setAuth(data, data.token);
      if      (data.role === "ADMIN") navigate("../admin/Dashboard");
      else if (data.role === "TPO")   navigate("../tpo/Dashboard");
      else                            navigate("../student/Dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.glow1} /><div style={s.glow2} />
      <div style={s.card}>

        <div style={s.logoWrap} onClick={() => navigate("/")}>
          Know<span style={s.acc}>Ur</span>Drive
        </div>

        <h1 style={s.title}>Welcome back</h1>
        <p style={s.sub}>Log in to your account to continue</p>

        {error && <div style={s.errBox}><span style={s.errDot} />{error}</div>}

        <form onSubmit={onSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input name="email" type="email" placeholder="you@college.edu"
              value={form.email} onChange={onChange} style={s.input} autoComplete="email" />
          </div>

          <div style={s.field}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label style={s.label}>Password</label>
              <span style={s.forgot}>Forgot password?</span>
            </div>
            <div style={{ position: "relative" }}>
              <input name="password" type={showPass ? "text" : "password"} placeholder="••••••••"
                value={form.password} onChange={onChange}
                style={{ ...s.input, paddingRight: 44 }} autoComplete="current-password" />
              <button type="button" style={s.eye} onClick={() => setShowPass(!showPass)}>
                {showPass ? "●" : "○"}
              </button>
            </div>
          </div>

          <button type="submit" style={s.submit} disabled={loading}>
            {loading ? <span style={s.spinner} /> : "Log in"}
          </button>
        </form>

        <div style={s.divider}><div style={s.divLine} /><span style={s.divText}>or</span><div style={s.divLine} /></div>

        <div style={s.hints}>
          {[
            { role: "Student", color: "#6c63ff", text: "Use your college email + password set during registration" },
            { role: "TPO",     color: "#ff6b6b", text: "Use credentials provided by your platform admin" },
          ].map((r) => (
            <div key={r.role} style={s.hintRow}>
              <span style={{ ...s.hintDot, background: r.color }} />
              <span style={{ fontSize: 12, color: "#444" }}>
                <span style={{ color: r.color, fontWeight: 700 }}>{r.role}</span> — {r.text}
              </span>
            </div>
          ))}
        </div>

        <p style={s.bottom}>Don't have an account?{" "}<Link to="/register" style={s.link}>Register here</Link></p>
      </div>
      <span style={s.back} onClick={() => navigate("/")}>← Back to home</span>
    </div>
  );
}

const s = {
  page:    { minHeight: "100vh", background: "#0a0a0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden", fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" },
  glow1:   { position: "absolute", top: "10%", left: "20%", width: 500, height: 500, pointerEvents: "none", background: "radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)" },
  glow2:   { position: "absolute", bottom: "10%", right: "15%", width: 400, height: 400, pointerEvents: "none", background: "radial-gradient(circle, rgba(255,107,107,0.07) 0%, transparent 70%)" },
  card:    { background: "#111118", border: "1px solid #1e1e2e", borderRadius: 18, padding: "40px", width: "100%", maxWidth: 440, position: "relative", zIndex: 1 },
  logoWrap:{ fontFamily: "'inter','DM Sans',sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: 28, cursor: "pointer", display: "inline-block" },
  acc:     { color: "#6c63ff" },
  title:   { fontFamily: "'inter','DM Sans',sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: 6, lineHeight: 1.35 },
  sub:     { fontSize: 14, color: "#555", marginBottom: 28 },
  errBox:  { background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#ff6b6b", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 },
  errDot:  { width: 6, height: 6, borderRadius: "50%", background: "#ff6b6b", flexShrink: 0 },
  form:    { display: "flex", flexDirection: "column", gap: 18 },
  field:   { display: "flex", flexDirection: "column", gap: 7 },
  label:   { fontSize: 13, fontWeight: 500, color: "#aaa" },
  forgot:  { fontSize: 12, color: "#6c63ff", cursor: "pointer" },
  input:   { width: "100%", padding: "11px 14px", background: "#0e0e16", border: "1px solid #1e1e2e", borderRadius: 9, fontSize: 14, color: "#e8e8f0", fontFamily: "inherit", outline: "none" },
  eye:     { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#444", fontSize: 12, cursor: "pointer", padding: 4 },
  submit:  { width: "100%", padding: "12px", background: "#6c63ff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", marginTop: 4, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" },
  spinner: { width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" },
  divider: { display: "flex", alignItems: "center", gap: 12, margin: "24px 0 20px" },
  divLine: { flex: 1, height: 1, background: "#1e1e2e" },
  divText: { fontSize: 12, color: "#333" },
  hints:   { display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 },
  hintRow: { display: "flex", alignItems: "flex-start", gap: 10, background: "#0e0e16", border: "1px solid #1a1a28", borderRadius: 8, padding: "10px 12px" },
  hintDot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0, marginTop: 3 },
  bottom:  { fontSize: 13, color: "#444", textAlign: "center" },
  link:    { color: "#6c63ff", textDecoration: "none", fontWeight: 500 },
  back:    { marginTop: 28, fontSize: 13, color: "#333", cursor: "pointer", position: "relative", zIndex: 1 },
};