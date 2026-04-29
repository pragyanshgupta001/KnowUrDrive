import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh } from "../../styles/shared";

const PC = { HIGH: "#ff6b6b", MEDIUM: "#ffc107", LOW: "#43e97b" };

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/notices").then(({ data }) => setNotices(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <h1 style={sh.pageTitle}>Notices & Circulars</h1>
      <p style={{ ...sh.pageSub, marginBottom: 24 }}>Announcements from your TPO</p>

      {loading ? <div style={sh.loader}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {notices.length === 0 && <div style={sh.empty}>No notices posted yet.</div>}
          {notices.map((n) => (
            <div key={n._id} style={s.card}>
              <div style={s.top}>
                <span style={{ ...s.priority, color: PC[n.priority], background: PC[n.priority] + "15", borderColor: PC[n.priority] + "40" }}>
                  {n.priority}
                </span>
                <span style={s.date}>{new Date(n.createdAt).toDateString()}</span>
              </div>
              <div style={s.title}>{n.title}</div>
              <div style={s.desc}>{n.description}</div>
              {n.postedBy && <div style={s.by}>Posted by {n.postedBy.name}</div>}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

const s = {
  card:     { background: "#111118", border: "1px solid #1a1a28", borderRadius: 13, padding: "20px 22px" },
  top:      { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  priority: { fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 5, border: "1px solid", textTransform: "uppercase", letterSpacing: 0.5 },
  date:     { fontSize: 11, color: "#333", marginLeft: "auto" },
  title:    { fontSize: 15, fontWeight: 700, color: "#e8e8f0", marginBottom: 8 },
  desc:     { fontSize: 13, color: "#666", lineHeight: 1.7 },
  by:       { fontSize: 11, color: "#333", marginTop: 10 },
};