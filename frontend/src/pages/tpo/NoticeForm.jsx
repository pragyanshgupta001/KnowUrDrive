import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh } from "../../styles/shared";

export default function NoticeForm() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ title: "", description: "", priority: "MEDIUM" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return setToast("Title and description are required");
    try {
      setLoading(true);
      await api.post("/tpo/notices", form);
      navigate("/tpo/notices");
    } catch (err) {
      setToast(err.response?.data?.message || "Failed to post notice.");
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <button style={sh.backBtn} onClick={() => navigate("/tpo/notices")}>← Back</button>
      <h1 style={sh.pageTitle}>Post Notice</h1>
      <p style={{ ...sh.pageSub, marginBottom: 28 }}>
        This will be visible to all students at your college
      </p>

      {toast && <div style={sh.errorToast}>{toast}</div>}

      <form onSubmit={onSubmit} style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 18 }}>

        <div style={sh.field}>
          <label style={sh.label}>Title *</label>
          <input value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={sh.input} placeholder="e.g. Schedule change for TCS drive" />
        </div>

        <div style={sh.field}>
          <label style={sh.label}>Description *</label>
          <textarea value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={sh.textarea} placeholder="Full details of the notice..." />
        </div>

        <div style={sh.field}>
          <label style={sh.label}>Priority</label>
          <select value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            style={sh.select}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" style={sh.primaryBtn} disabled={loading}>
            {loading ? "Posting..." : "Post notice"}
          </button>
          <button type="button" style={sh.ghostBtn} onClick={() => navigate("/tpo/notices")}>
            Cancel
          </button>
        </div>

      </form>
    </DashboardLayout>
  );
}