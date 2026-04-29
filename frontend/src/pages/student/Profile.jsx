import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import useAuthStore from "../../store/authStore";
import { sh } from "../../styles/shared";

const BRANCHES = ["CSE","IT","ECE","EEE","ME","CE","AIDS","CSIT","Other"];

export default function StudentProfile() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm]      = useState({ name: user?.name||"", department: user?.department||"", year: user?.year||"", cgpa: user?.cgpa||"", resumeUrl: user?.resumeUrl||"" });
  const [saving, setSaving]  = useState(false);
  const [toast, setToast]    = useState({ msg: "", type: "" });

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast({ msg:"", type:"" }), 3000); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await api.put("/auth/profile", form);
      updateUser(data);
      showToast("Profile updated!");
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed.", "error");
    } finally { setSaving(false); }
  };

  return (
    <DashboardLayout>
      <h1 style={sh.pageTitle}>My Profile</h1>
      <p style={{ ...sh.pageSub, marginBottom: 28 }}>Keep your details up to date for accurate eligibility checks</p>

      <div style={{ maxWidth: 520 }}>
        <div style={s.profileCard}>
          <div style={s.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: "#555" }}>{user?.email}</div>
            <div style={{ fontSize: 11, color: "#6c63ff", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>STUDENT</div>
          </div>
        </div>

        {toast.msg && <div style={{ ...(toast.type === "error" ? sh.errorToast : sh.successToast), marginBottom: 20 }}>{toast.msg}</div>}

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { name: "name",      label: "Full name",  type: "text", placeholder: "Rahul Sharma" },
            { name: "cgpa",      label: "CGPA",       type: "number", placeholder: "8.5" },
            { name: "resumeUrl", label: "Resume URL", type: "url", placeholder: "https://drive.google.com/..." },
          ].map((f) => (
            <div key={f.name} style={sh.field}>
              <label style={sh.label}>{f.label}</label>
              <input name={f.name} type={f.type} placeholder={f.placeholder}
                value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                style={sh.input} />
            </div>
          ))}

          <div style={sh.twoCol}>
            <div style={sh.field}>
              <label style={sh.label}>Branch</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} style={sh.select}>
                <option value="">Select branch</option>
                {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div style={sh.field}>
              <label style={sh.label}>Year</label>
              <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} style={sh.select}>
                <option value="">Select year</option>
                {[1,2,3,4].map((y) => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" style={sh.primaryBtn} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

const s = {
  profileCard: { background: "#111118", border: "1px solid #1a1a28", borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, marginBottom: 24 },
  avatar:      { width: 48, height: 48, borderRadius: 12, background: "rgba(108,99,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, color: "#6c63ff", flexShrink: 0 },
};