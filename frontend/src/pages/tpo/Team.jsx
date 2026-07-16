import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import useAuthStore from "../../store/authStore";
import { sh } from "../../styles/shared";

export default function TPOTeam() {
  const { user } = useAuthStore();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [showForm, setShowForm] = useState(false);
  const [removing, setRemoving] = useState(null);

  const [form, setForm] = useState({ name: "", email: "", dob: "", phone: "" });
  const [formErr, setFormErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isPrimary = user?.isPrimary;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3500);
  };

  const fetchTeam = () => {
    setLoading(true);
    api.get("/tpo/team")
      .then(({ data }) => setTeam(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormErr("");

    if (!form.name || !form.email || !form.dob) {
      return setFormErr("Name, email and date of birth are required");
    }

    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(form.dob)) {
      return setFormErr("Date of birth must be in YYYY-MM-DD format (e.g. 1990-08-15)");
    }

    try {
      setSubmitting(true);
      await api.post("/tpo/team", form);
      showToast("TPO account created. They will receive login instructions via email.");
      setForm({ name: "", email: "", dob: "", phone: "" });
      setShowForm(false);
      fetchTeam();
    } catch (err) {
      setFormErr(err.response?.data?.message || "Failed to add TPO.");
    } finally { setSubmitting(false); }
  };

  const handleRemove = async (tpoId, tpoName) => {
    if (!window.confirm(`Remove ${tpoName} from the team?`)) return;
    try {
      setRemoving(tpoId);
      await api.delete(`/tpo/team/${tpoId}`);
      showToast(`${tpoName} removed successfully.`);
      setTeam(team.filter((t) => t._id !== tpoId));
    } catch (err) {
      showToast(err.response?.data?.message || "Could not remove TPO.", "error");
    } finally { setRemoving(null); }
  };

  return (
    <DashboardLayout>
      <div style={sh.header}>
        <div>
          <h1 style={sh.pageTitle}>TPO Team</h1>
          <p style={sh.pageSub}>
            {isPrimary
              ? "Manage your placement cell coordinators"
              : "Your placement cell team"}
          </p>
        </div>
        {isPrimary && team.length < 5 && !showForm && (
          <button style={sh.primaryBtn} onClick={() => setShowForm(true)}>
            + Add TPO
          </button>
        )}
        {isPrimary && team.length >= 5 && (
          <div style={s.maxNote}>Max 5 TPOs reached</div>
        )}
      </div>

      {toast.msg && (
        <div style={toast.type === "error" ? sh.errorToast : sh.successToast}>
          {toast.msg}
        </div>
      )}

      {/* non-primary info banner */}
      {!isPrimary && (
        <div style={s.infoBanner}>
          Only the primary TPO coordinator can add or remove team members.
          Contact <span style={{ color: "#6c63ff" }}>{team.find((t) => t.isPrimary)?.name || "your primary TPO"}</span> to make changes.
        </div>
      )}

      {/* add TPO form — primary only */}
      {isPrimary && showForm && (
        <div style={s.formCard}>
          <div style={s.formTitle}>Add new TPO coordinator</div>
          <p style={s.formSub}>
            Their date of birth will be used as a temporary password.
            They will be required to change it on first login.
          </p>

          {formErr && <div style={sh.errorToast}>{formErr}</div>}

          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={sh.twoCol}>
              <div style={sh.field}>
                <label style={sh.label}>Full name *</label>
                <input value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setFormErr(""); }}
                  style={sh.input} placeholder="Dr. Rahul Verma" />
              </div>
              <div style={sh.field}>
                <label style={sh.label}>Email *</label>
                <input type="email" value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setFormErr(""); }}
                  style={sh.input} placeholder="rahul@college.edu" />
              </div>
            </div>

            <div style={sh.twoCol}>
              <div style={sh.field}>
                <label style={sh.label}>
                  Date of birth *
                  <span style={s.dobHint}>(used as temp password)</span>
                </label>
                <input type="date" value={form.dob}
                  onChange={(e) => { setForm({ ...form, dob: e.target.value }); setFormErr(""); }}
                  style={sh.input} />
              </div>
              <div style={sh.field}>
                <label style={sh.label}>
                  Phone
                  <span style={s.optional}>optional</span>
                </label>
                <input value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={sh.input} placeholder="98XXXXXXXX" />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" style={sh.primaryBtn} disabled={submitting}>
                {submitting ? "Creating..." : "Create account & send email"}
              </button>
              <button type="button" style={sh.ghostBtn}
                onClick={() => { setShowForm(false); setFormErr(""); setForm({ name:"", email:"", dob:"", phone:"" }); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* team list */}
      {loading ? <div style={sh.loader}>Loading team...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {team.length === 0 && <div style={sh.empty}>No TPO coordinators found.</div>}
          {team.map((tpo) => (
            <div key={tpo._id} style={s.tpoCard}>
              <div style={s.tpoAvatar}>{tpo.name?.[0]?.toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={s.tpoName}>
                  {tpo.name}
                  {tpo.isPrimary && <span style={s.primaryBadge}>Primary</span>}
                  {tpo._id === user?._id && <span style={s.youBadge}>You</span>}
                </div>
                <div style={s.tpoEmail}>{tpo.email}</div>
                {tpo.isFirstLogin && (
                  <div style={s.firstLoginNote}>
                    ⚠ Has not logged in yet / password not changed
                  </div>
                )}
              </div>

              {/* only primary TPO sees remove button, and only on non-primary, non-self TPOs */}
              {isPrimary && !tpo.isPrimary && tpo._id !== user?._id && (
                <button
                  style={s.removeBtn}
                  disabled={removing === tpo._id}
                  onClick={() => handleRemove(tpo._id, tpo.name)}>
                  {removing === tpo._id ? "Removing..." : "Remove"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* capacity indicator */}
      {team.length > 0 && (
        <div style={s.capacity}>
          {team.length}/5 TPO slots used
          {team.length >= 5 && " — contact platform admin to increase limit"}
        </div>
      )}
    </DashboardLayout>
  );
}

const s = {
  maxNote:       { fontSize: 13, color: "#ffc107", background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.25)", padding: "8px 14px", borderRadius: 8 },
  infoBanner:    { background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#888", marginBottom: 20 },
  formCard:      { background: "#111118", border: "1px solid rgba(108,99,255,0.25)", borderRadius: 14, padding: "22px", marginBottom: 24 },
  formTitle:     { fontFamily: "'Syne','DM Sans',sans-serif", fontSize: 16, fontWeight: 700, color: "#e8e8f0", marginBottom: 6 },
  formSub:       { fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 20 },
  dobHint:       { fontSize: 10, color: "#444", fontWeight: 400, marginLeft: 6 },
  optional:      { fontSize: 10, color: "#333", background: "#1a1a28", padding: "1px 6px", borderRadius: 4, fontWeight: 400, marginLeft: 6 },
  tpoCard:       { background: "#111118", border: "1px solid #1a1a28", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 },
  tpoAvatar:     { width: 42, height: 42, borderRadius: 10, background: "rgba(255,107,107,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "#ff6b6b", flexShrink: 0 },
  tpoName:       { fontSize: 14, fontWeight: 600, color: "#e8e8f0", display: "flex", alignItems: "center", gap: 8, marginBottom: 3 },
  tpoEmail:      { fontSize: 12, color: "#444" },
  primaryBadge:  { fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: "rgba(255,193,7,0.12)", color: "#ffc107", border: "1px solid rgba(255,193,7,0.3)" },
  youBadge:      { fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: "rgba(108,99,255,0.12)", color: "#6c63ff", border: "1px solid rgba(108,99,255,0.3)" },
  firstLoginNote:{ fontSize: 11, color: "#ffc107", marginTop: 4 },
  removeBtn:     { padding: "7px 16px", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 8, fontSize: 12, color: "#ff6b6b", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 },
  capacity:      { fontSize: 12, color: "#333", marginTop: 16, textAlign: "right" },
};