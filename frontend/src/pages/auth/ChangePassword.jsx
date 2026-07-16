import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import useAuthStore from "../../store/authStore";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  // isFirstLogin true = TPO forced here after login with DOB password
  const isForced = user?.isFirstLogin;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return setError("Please fill in all fields");
    }
    if (form.newPassword.length < 6) {
      return setError("New password must be at least 6 characters");
    }
    if (form.newPassword !== form.confirmPassword) {
      return setError("New passwords do not match");
    }
    if (form.currentPassword === form.newPassword) {
      return setError("New password must be different from your current password");
    }

    try {
      setLoading(true);
      await api.put("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword
      });

      // Clear isFirstLogin flag in local store
      updateUser({ isFirstLogin: false });

      // Redirect to correct dashboard
      if (user?.role === "ADMIN") navigate("/admin/dashboard");
      else if (user?.role === "TPO") navigate("/tpo/dashboard");
      else navigate("/student/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Password change failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.card}>

        <div style={s.logoWrap} onClick={() => !isForced && navigate("/")}>
          Know<span style={s.acc}>Ur</span>Drive
        </div>

        {/* forced banner */}
        {isForced && (
          <div style={s.forcedBanner}>
            <span style={s.forcedIcon}>⚠️</span>
            <div>
              <div style={s.forcedTitle}>Password change required</div>
              <div style={s.forcedSub}>
                Your account was created with a temporary password (your date of birth).
                You must set a new password before continuing.
              </div>
            </div>
          </div>
        )}

        <h1 style={s.title}>{isForced ? "Set your password" : "Change password"}</h1>
        <p style={s.sub}>
          {isForced
            ? "Enter your date of birth as the current password (YYYY-MM-DD format)"
            : "Update your account password"
          }
        </p>

        {error && <div style={s.errBox}><span style={s.errDot} />{error}</div>}

        <form onSubmit={onSubmit} style={s.form}>

          <div style={s.field}>
            <label style={s.label}>
              {isForced ? "Current password (your DOB)" : "Current password"}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                placeholder={isForced ? "e.g. 1990-08-15" : "Current password"}
                value={form.currentPassword}
                onChange={(e) => { setForm({ ...form, currentPassword: e.target.value }); setError(""); }}
                style={{ ...s.input, paddingRight: 44 }}
                autoComplete="current-password"
              />
              <button type="button" style={s.eye} onClick={() => setShowPass(!showPass)}>
                {showPass ? "●" : "○"}
              </button>
            </div>
            {isForced && (
              <span style={s.hint}>
                Format: YYYY-MM-DD — e.g. if born 15 Aug 1990, enter 1990-08-15
              </span>
            )}
          </div>

          <div style={s.field}>
            <label style={s.label}>New password</label>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Min 6 characters"
              value={form.newPassword}
              onChange={(e) => { setForm({ ...form, newPassword: e.target.value }); setError(""); }}
              style={s.input}
              autoComplete="new-password"
            />
            {/* password strength */}
            {form.newPassword && <PasswordStrength password={form.newPassword} />}
          </div>

          <div style={s.field}>
            <label style={s.label}>Confirm new password</label>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Re-enter new password"
              value={form.confirmPassword}
              onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setError(""); }}
              style={s.input}
            />
            {/* match indicator */}
            {form.confirmPassword && (
              <span style={{
                fontSize: 11,
                color: form.newPassword === form.confirmPassword ? "#43e97b" : "#ff6b6b"
              }}>
                {form.newPassword === form.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
              </span>
            )}
          </div>

          <button type="submit" style={s.submit} disabled={loading}>
            {loading ? <span style={s.spinner} /> : isForced ? "Set password & continue" : "Change password"}
          </button>

          {/* only show cancel if not forced */}
          {!isForced && (
            <button
              type="button"
              style={s.cancelBtn}
              onClick={() => navigate(-1)}>
              Cancel
            </button>
          )}

        </form>
      </div>
    </div>
  );
}

function PasswordStrength({ password }) {
  const score = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password)
  ].filter(Boolean).length;

  const colors = ["#ff6b6b","#ff6b6b","#ffc107","#43e97b","#43e97b"];
  const labels = ["Too short","Weak","Fair","Good","Strong"];

  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[0,1,2,3].map((i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i < score ? colors[score] : "#1e1e2e",
            transition: "background 0.3s"
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: colors[score] }}>{labels[score]}</span>
    </div>
  );
}

const s = {
  page:         { minHeight: "100vh", background: "#0a0a0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden", fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" },
  glow:         { position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, pointerEvents: "none", background: "radial-gradient(ellipse, rgba(108,99,255,0.1) 0%, transparent 70%)" },
  card:         { background: "#111118", border: "1px solid #1e1e2e", borderRadius: 18, padding: "40px", width: "100%", maxWidth: 440, position: "relative", zIndex: 1 },
  logoWrap:     { fontFamily: "'inter','DM Sans',sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: 24, display: "inline-block" },
  acc:          { color: "#6c63ff" },
  forcedBanner: { background: "rgba(255,193,7,0.08)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: 10, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 24 },
  forcedIcon:   { fontSize: 18, flexShrink: 0, marginTop: 1 },
  forcedTitle:  { fontSize: 13, fontWeight: 700, color: "#ffc107", marginBottom: 4 },
  forcedSub:    { fontSize: 12, color: "#888", lineHeight: 1.6 },
  title:        { fontFamily: "'inter','DM Sans',sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.35, marginBottom: 6 },
  sub:          { fontSize: 13, color: "#555", marginBottom: 28, lineHeight: 1.6 },
  errBox:       { background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#ff6b6b", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 },
  errDot:       { width: 6, height: 6, borderRadius: "50%", background: "#ff6b6b", flexShrink: 0 },
  form:         { display: "flex", flexDirection: "column", gap: 18 },
  field:        { display: "flex", flexDirection: "column", gap: 6 },
  label:        { fontSize: 13, fontWeight: 500, color: "#aaa" },
  hint:         { fontSize: 11, color: "#444", marginTop: 2 },
  input:        { width: "100%", padding: "11px 14px", background: "#0e0e16", border: "1px solid #1e1e2e", borderRadius: 9, fontSize: 14, color: "#e8e8f0", fontFamily: "inherit", outline: "none" },
  eye:          { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#444", fontSize: 12, cursor: "pointer", padding: 4 },
  submit:       { width: "100%", padding: "12px", background: "#6c63ff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" },
  cancelBtn:    { width: "100%", padding: "10px", background: "transparent", border: "1px solid #2a2a3e", borderRadius: 9, fontSize: 13, color: "#555", cursor: "pointer", fontFamily: "inherit" },
  spinner:      { width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" },
};