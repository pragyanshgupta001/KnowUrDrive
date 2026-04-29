import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh } from "../../styles/shared";

export default function CreateTPO() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [form, setForm]         = useState({ name: "", email: "", password: "", collegeId: "" });
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState({ msg: "", type: "" });

  useEffect(() => {
    api.get("/admin/colleges?approved=true")
      .then(({ data }) => setColleges(data))
      .catch(console.error);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.collegeId)
      return showToast("All fields are required", "error");
    try {
      setLoading(true);
      await api.post("/admin/tpo", form);
      showToast("TPO account created!");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create TPO.", "error");
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <button style={sh.backBtn} onClick={() => navigate("/admin/dashboard")}>← Back</button>
      <h1 style={sh.pageTitle}>Create TPO Account</h1>
      <p style={{ ...sh.pageSub, marginBottom: 28 }}>
        Assign a TPO coordinator to an approved college
      </p>

      {toast.msg && (
        <div style={toast.type === "error" ? sh.errorToast : sh.successToast}>
          {toast.msg}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 18 }}>

        <div style={sh.field}>
          <label style={sh.label}>Full name *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={sh.input} placeholder="Dr. Priya Sharma" />
        </div>

        <div style={sh.field}>
          <label style={sh.label}>Email *</label>
          <input type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={sh.input} placeholder="tpo@college.edu" />
        </div>

        <div style={sh.field}>
          <label style={sh.label}>Password *</label>
          <input type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={sh.input} placeholder="Min 6 characters" />
        </div>

        <div style={sh.field}>
          <label style={sh.label}>Assign to college *</label>
          <select value={form.collegeId}
            onChange={(e) => setForm({ ...form, collegeId: e.target.value })}
            style={sh.select}>
            <option value="">Select approved college</option>
            {colleges.map((c) => (
              <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" style={sh.primaryBtn} disabled={loading}>
            {loading ? "Creating..." : "Create TPO account"}
          </button>
          <button type="button" style={sh.ghostBtn} onClick={() => navigate("/admin/dashboard")}>
            Cancel
          </button>
        </div>

      </form>
    </DashboardLayout>
  );
}