import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";

export default function CollegeRequest() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: "", code: "", tpoName: "", tpoDob: "",tpoEmail: "", domain: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.code || !form.tpoName || !form.tpoDob || !form.tpoEmail) {
      return setError("All fields marked with * are required");
    }
    try {
      setLoading(true);
      await api.post("/colleges/request", form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Request failed.");
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.card}>

        <div style={s.logoWrap} onClick={() => navigate("/")}>
          Know<span style={s.acc}>Ur</span>Drive
        </div>

        {success ? (
          <div style={s.successWrap}>
            <div style={s.checkCircle}>✓</div>
            <h2 style={s.successTitle}>Request submitted!</h2>
            <p style={s.successSub}>
              Our admin will review and approve your college. Students can sign up
              once your college is approved.
            </p>
            <button style={s.submitBtn} onClick={() => navigate("/")}>Back to home</button>
          </div>
        ) : (
          <>
            <h1 style={s.title}>Register your college</h1>
            <p style={s.sub}>Submit a request to join the KnowUrDrive platform</p>

            {error && (
              <div style={s.errBox}><span style={s.errDot} />{error}</div>
            )}

            <form onSubmit={onSubmit} style={s.form}>

              <div style={s.field}>
                <label style={s.label}>College name *</label>
                <input value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(""); }}
                  style={s.input} placeholder="ABES Engineering College" />
              </div>

              <div style={s.field}>
                <label style={s.label}>
                  College code *
                  <span style={s.hint}>Students use this code to sign up</span>
                </label>
                <input value={form.code}
                  onChange={(e) => { setForm({ ...form, code: e.target.value.toUpperCase() }); setError(""); }}
                  style={{ ...s.input, fontFamily: "monospace", textTransform: "uppercase" }}
                  placeholder="ABES2024" maxLength={12} />
              </div>

              <div style={s.field}>
                <label style={s.label}>TPO name *</label>
                <input value={form.tpoName}
                  onChange={(e) => { setForm({ ...form, tpoName: e.target.value }); setError(""); }}
                  style={s.input} placeholder="John Doe" />
              </div>

              <div style={s.field}>
                <label style={s.label}>TPO date of birth *</label>
                <input type="date" value={form.tpoDob}
                  onChange={(e) => { setForm({ ...form, tpoDob: e.target.value }); setError(""); }}
                  style={s.input} />
              </div>

              <div style={s.field}>
                <label style={s.label}>TPO email *</label>
                <input value={form.tpoEmail}
                  onChange={(e) => { setForm({ ...form, tpoEmail: e.target.value }); setError(""); }}
                  style={s.input} placeholder="john.doe@abes.ac.in" />
              </div>

              <div style={s.field}>
                <label style={s.label}>
                  Email domain
                  <span style={s.optional}>optional</span>
                </label>
                <input value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  style={s.input} placeholder="abes.ac.in" />
              </div>

              <div style={s.field}>
                <label style={s.label}>
                  Address
                  <span style={s.optional}>optional</span>
                </label>
                <input value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  style={s.input} placeholder="Ghaziabad, Uttar Pradesh" />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" style={s.submitBtn} disabled={loading}>
                  {loading ? "Submitting..." : "Submit request"}
                </button>
                <button type="button" style={s.cancelBtn} onClick={() => navigate("/")}>
                  Cancel
                </button>
              </div>

            </form>
          </>
        )}
      </div>
      <span style={s.back} onClick={() => navigate("/")}>← Back to home</span>
    </div>
  );
}

const s = {
  page:        { minHeight: "100vh", background: "#0a0a0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden", fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" },
  glow:        { position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, pointerEvents: "none", background: "radial-gradient(ellipse, rgba(108,99,255,0.1) 0%, transparent 70%)" },
  card:        { background: "#111118", border: "1px solid #1e1e2e", borderRadius: 18, padding: "40px", width: "100%", maxWidth: 480, position: "relative", zIndex: 1 },
  logoWrap:    { fontFamily: "'inter','DM Sans',sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: 28, cursor: "pointer", display: "inline-block" },
  acc:         { color: "#6c63ff" },
  title:       { fontFamily: "'inter','DM Sans',sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.35, marginBottom: 6 },
  sub:         { fontSize: 14, color: "#555", marginBottom: 28 },
  errBox:      { background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#ff6b6b", display: "flex", alignItems: "center", gap: 8, marginBottom: 18 },
  errDot:      { width: 6, height: 6, borderRadius: "50%", background: "#ff6b6b", flexShrink: 0 },
  form:        { display: "flex", flexDirection: "column", gap: 16 },
  field:       { display: "flex", flexDirection: "column", gap: 6 },
  label:       { fontSize: 13, fontWeight: 500, color: "#aaa", display: "flex", alignItems: "center", gap: 8 },
  hint:        { fontSize: 11, color: "#444", fontWeight: 400 },
  optional:    { fontSize: 10, color: "#333", background: "#1a1a28", padding: "1px 6px", borderRadius: 4, fontWeight: 400 },
  input:       { width: "100%", padding: "11px 14px", background: "#0e0e16", border: "1px solid #1e1e2e", borderRadius: 9, fontSize: 14, color: "#e8e8f0", fontFamily: "inherit", outline: "none" },
  submitBtn:   { flex: 1, padding: "12px", background: "#6c63ff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", minHeight: 44 },
  cancelBtn:   { padding: "12px 20px", background: "transparent", border: "1px solid #2a2a3e", borderRadius: 9, fontSize: 14, color: "#666", cursor: "pointer", fontFamily: "inherit" },
  successWrap: { textAlign: "center", padding: "10px 0" },
  checkCircle: { width: 56, height: 56, borderRadius: "50%", background: "rgba(67,233,123,0.12)", border: "2px solid rgba(67,233,123,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#43e97b", margin: "0 auto 20px" },
  successTitle:{ fontFamily: "'inter','DM Sans',sans-serif", fontSize: 22, fontWeight: 800, color: "#43e97b", marginBottom: 10, lineHeight: 1.35 },
  successSub:  { fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 28 },
  back:        { marginTop: 28, fontSize: 13, color: "#333", cursor: "pointer", position: "relative", zIndex: 1 },
};