import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import useAuthStore from "../../store/authStore";
import { sh } from "../../styles/shared";

export default function AddTPO() {
  const navigate    = useNavigate();
  const { user }    = useAuthStore();

  const [form, setForm]       = useState({ name: "", email: "", dob: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  if (!user?.isPrimary) {
    return (
      <DashboardLayout>
        <div style={s.blocked}>
          <div style={s.blockedIcon}>🔒</div>
          <h2 style={s.blockedTitle}>Access restricted</h2>
          <p style={s.blockedSub}>
            Only the primary TPO coordinator can add new team members.
          </p>
          <button style={sh.ghostBtn} onClick={() => navigate("/tpo/team")}>
            View team →
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.dob) {
      return setError("Name, email and date of birth are required");
    }

    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(form.dob)) {
      return setError("Date of birth must be in YYYY-MM-DD format (e.g. 1990-08-15)");
    }

    try {
      setLoading(true);
      await api.post("/tpo/team", form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create TPO account.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout>
        <div style={s.successWrap}>
          <div style={s.successIcon}>✓</div>
          <h2 style={s.successTitle}>TPO account created!</h2>
          <p style={s.successSub}>
            <strong>{form.name}</strong> will receive an email with login instructions.
            Their temporary password is their date of birth in YYYY-MM-DD format.
            They will be required to change it on first login.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button style={sh.primaryBtn} onClick={() => navigate("/tpo/team")}>
              View team
            </button>
            <button style={sh.ghostBtn} onClick={() => {
              setForm({ name: "", email: "", dob: "", phone: "" });
              setSuccess(false);
            }}>
              Add another
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <button style={sh.backBtn} onClick={() => navigate("/tpo/team")}>
        ← Back to team
      </button>

      <h1 style={sh.pageTitle}>Add TPO Coordinator</h1>
      <p style={{ ...sh.pageSub, marginBottom: 28 }}>
        Their date of birth will be used as a temporary password.
        They will be asked to change it on first login.
      </p>

      {/* how it works info box */}
      <div style={s.infoBox}>
        <div style={s.infoTitle}>How this works</div>
        <div style={s.infoSteps}>
          <div style={s.infoStep}><span style={s.stepNum}>1</span> You fill in their details below</div>
          <div style={s.infoStep}><span style={s.stepNum}>2</span> System creates their account with DOB as password</div>
          <div style={s.infoStep}><span style={s.stepNum}>3</span> They receive an email with login instructions</div>
          <div style={s.infoStep}><span style={s.stepNum}>4</span> On first login they are forced to set a new password</div>
        </div>
      </div>

      {error && <div style={sh.errorToast}>{error}</div>}

      <form onSubmit={onSubmit} style={{ maxWidth: 520, display: "flex", flexDirection: "column", gap: 18 }}>

        <div style={sh.field}>
          <label style={sh.label}>Full name *</label>
          <input
            name="name" value={form.name} onChange={onChange}
            style={sh.input} placeholder="Dr. Rahul Verma"
          />
        </div>

        <div style={sh.field}>
          <label style={sh.label}>Email address *</label>
          <input
            name="email" type="email" value={form.email} onChange={onChange}
            style={sh.input} placeholder="rahul@college.edu"
          />
        </div>

        <div style={sh.twoCol}>
          <div style={sh.field}>
            <label style={{ ...sh.label, display: "flex", flexDirection: "column", gap: 2 }}>
              Date of birth *
              <span style={s.dobNote}>Used as temporary password</span>
            </label>
            <input
              name="dob" type="date" value={form.dob} onChange={onChange}
              style={sh.input}
            />
          </div>

          <div style={sh.field}>
            <label style={{ ...sh.label, display: "flex", alignItems: "center", gap: 8 }}>
              Phone
              <span style={s.optional}>optional</span>
            </label>
            <input
              name="phone" value={form.phone} onChange={onChange}
              style={sh.input} placeholder="98XXXXXXXX"
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" style={sh.primaryBtn} disabled={loading}>
            {loading ? "Creating account..." : "Create account & send email"}
          </button>
          <button type="button" style={sh.ghostBtn} onClick={() => navigate("/tpo/team")}>
            Cancel
          </button>
        </div>

      </form>
    </DashboardLayout>
  );
}

const s = {
  blocked:      { textAlign: "center", padding: "80px 40px" },
  blockedIcon:  { fontSize: 40, marginBottom: 16 },
  blockedTitle: { fontFamily: "'Syne','DM Sans',sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 10, lineHeight: 1.35 },
  blockedSub:   { fontSize: 14, color: "#555", marginBottom: 28 },
  successWrap:  { textAlign: "center", maxWidth: 480, margin: "80px auto 0" },
  successIcon:  { width: 60, height: 60, borderRadius: "50%", background: "rgba(67,233,123,0.12)", border: "2px solid rgba(67,233,123,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#43e97b", margin: "0 auto 20px" },
  successTitle: { fontFamily: "'Syne','DM Sans',sans-serif", fontSize: 22, fontWeight: 800, color: "#43e97b", marginBottom: 12, lineHeight: 1.35 },
  successSub:   { fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 28 },
  infoBox:      { background: "#111118", border: "1px solid #1a1a28", borderRadius: 12, padding: "18px 20px", marginBottom: 24, maxWidth: 520 },
  infoTitle:    { fontSize: 13, fontWeight: 600, color: "#aaa", marginBottom: 12 },
  infoSteps:    { display: "flex", flexDirection: "column", gap: 8 },
  infoStep:     { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#666" },
  stepNum:      { width: 22, height: 22, borderRadius: "50%", background: "rgba(108,99,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#6c63ff", flexShrink: 0 },
  dobNote:      { fontSize: 10, color: "#444", fontWeight: 400 },
  optional:     { fontSize: 10, color: "#333", background: "#1a1a28", padding: "1px 6px", borderRadius: 4, fontWeight: 400 },
};