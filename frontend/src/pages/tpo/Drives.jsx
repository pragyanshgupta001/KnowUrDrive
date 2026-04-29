// ─── pages/tpo/Drives.jsx ────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh } from "../../styles/shared";

export function TPODrives() {
  const navigate = useNavigate();
  const [drives, setDrives]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/drives?active=all").then(({ data }) => setDrives(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleClose = async (id) => {
    await api.delete(`/drives/${id}`);
    setDrives(drives.map((d) => d._id === id ? { ...d, isActive: false } : d));
  };

  return (
    <DashboardLayout>
      <div style={sh.header}>
        <div><h1 style={sh.pageTitle}>Manage Drives</h1><p style={sh.pageSub}>All drives at your college</p></div>
        <button style={sh.primaryBtn} onClick={() => navigate("/tpo/drives/new")}>+ Post new drive</button>
      </div>
      {loading ? <div style={sh.loader}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {drives.length === 0 && <div style={sh.empty}>No drives posted yet.</div>}
          {drives.map((d) => (
            <div key={d._id} style={s.row}>
              <div style={s.avatar}>{d.companyName?.[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={s.co}>{d.companyName} — {d.role}</div>
                <div style={s.meta}>{d.ctcOffered} LPA · {d.jobType} · Deadline: {d.deadline ? new Date(d.deadline).toDateString() : "N/A"}</div>
              </div>
              <span style={{ ...s.pill, background: d.isActive ? "rgba(67,233,123,0.12)" : "#1a1a28", color: d.isActive ? "#43e97b" : "#444" }}>
                {d.isActive ? "Active" : "Closed"}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={sh.ghostBtn} onClick={() => navigate(`/tpo/drives/${d._id}/applicants`)}>Applicants</button>
                <button style={sh.ghostBtn} onClick={() => navigate(`/tpo/drives/${d._id}/edit`)}>Edit</button>
                {d.isActive && <button style={{ ...sh.ghostBtn, color: "#ff6b6b", borderColor: "rgba(255,107,107,0.3)" }} onClick={() => handleClose(d._id)}>Close</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

const s = {
  row:    { background: "#111118", border: "1px solid #1a1a28", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 },
  avatar: { width: 40, height: 40, borderRadius: 9, background: "#1a1a28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#6c63ff", flexShrink: 0 },
  co:     { fontSize: 14, fontWeight: 700, color: "#ddd" },
  meta:   { fontSize: 12, color: "#444", marginTop: 2 },
  pill:   { fontSize: 10, padding: "3px 8px", borderRadius: 5 },
};

export default TPODrives;