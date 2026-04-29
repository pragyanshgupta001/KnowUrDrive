import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh } from "../../styles/shared";

const PC = { HIGH: "#ff6b6b", MEDIUM: "#ffc107", LOW: "#43e97b" };

export default function TPONotices() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState({ msg: "", type: "" });

  useEffect(() => {
    api.get("/notices")
      .then(({ data }) => setNotices(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await api.delete(`/notices/${id}`);
      setNotices(notices.filter((n) => n._id !== id));
      showToast("Notice deleted.");
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed.", "error");
    }
  };

  return (
    <DashboardLayout>
      <div style={sh.header}>
        <div>
          <h1 style={sh.pageTitle}>Notices</h1>
          <p style={sh.pageSub}>Manage college announcements</p>
        </div>
        <button style={sh.primaryBtn} onClick={() => navigate("/tpo/notices/new")}>+ Post notice</button>
      </div>

      {toast.msg && <div style={toast.type === "error" ? sh.errorToast : sh.successToast}>{toast.msg}</div>}

      {loading ? <div style={sh.loader}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {notices.length === 0 && <div style={sh.empty}>No notices posted yet.</div>}
          {notices.map((n) => (
            <div key={n._id} style={sh.panel}>
              <div style={s.top}>
                <span style={{ ...s.priority, color: PC[n.priority], background: PC[n.priority] + "15", borderColor: PC[n.priority] + "40" }}>
                  {n.priority}
                </span>
                <span style={s.date}>{new Date(n.createdAt).toDateString()}</span>
              </div>
              <div style={s.title}>{n.title}</div>
              <div style={s.desc}>{n.description}</div>
              <div style={s.actions}>
                <button style={sh.ghostBtn} onClick={() => navigate(`/tpo/notices/${n._id}/edit`)}>Edit</button>
                <button style={{ ...sh.ghostBtn, color: "#ff6b6b", borderColor: "rgba(255,107,107,0.3)" }}
                  onClick={() => handleDelete(n._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

const s = {
  top:      { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  priority: { fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 5, border: "1px solid", textTransform: "uppercase", letterSpacing: 0.5 },
  date:     { fontSize: 11, color: "#333", marginLeft: "auto" },
  title:    { fontSize: 15, fontWeight: 700, color: "#e8e8f0", marginBottom: 8 },
  desc:     { fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 14 },
  actions:  { display: "flex", gap: 8 },
};