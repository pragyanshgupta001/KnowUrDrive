import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.inner}>
        <div style={s.code}>404</div>
        <h1 style={s.title}>Page not found</h1>
        <p style={s.sub}>The page you're looking for doesn't exist or has been moved.</p>
        <div style={s.btns}>
          <button style={s.primaryBtn} onClick={() => navigate("/")}>Back to home</button>
          <button style={s.ghostBtn}   onClick={() => navigate(-1)}>Go back</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:       { minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", color: "#e8e8f0", position: "relative", overflow: "hidden" },
  glow:       { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, pointerEvents: "none", background: "radial-gradient(ellipse, rgba(108,99,255,0.08) 0%, transparent 70%)" },
  inner:      { textAlign: "center", position: "relative", zIndex: 1 },
  code:       { fontFamily: "'inter','DM Sans',sans-serif", fontSize: 120, fontWeight: 800, color: "#1a1a28", lineHeight: 1, marginBottom: 24, letterSpacing: "-4px" },
  title:      { fontFamily: "'inter','DM Sans',sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12, lineHeight: 1.35 },
  sub:        { fontSize: 15, color: "#444", marginBottom: 36, maxWidth: 360, margin: "0 auto 36px" },
  btns:       { display: "flex", gap: 12, justifyContent: "center" },
  primaryBtn: { padding: "12px 28px", background: "#6c63ff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" },
  ghostBtn:   { padding: "12px 28px", background: "transparent", border: "1px solid #2a2a3e", borderRadius: 10, fontSize: 14, color: "#666", cursor: "pointer", fontFamily: "inherit" },
};