import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh } from "../../styles/shared";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div style={sh.loader}>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={sh.header}>
        <div>
          <h1 style={sh.pageTitle}>Admin Dashboard</h1>
          <p style={sh.pageSub}>Platform-wide overview</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={sh.ghostBtn}   onClick={() => navigate("/admin/colleges")}>Manage colleges</button>
          <button style={sh.primaryBtn} onClick={() => navigate("/admin/tpo/new")}>+ Create TPO</button>
        </div>
      </div>

      <div style={sh.statGrid3}>
        {[
          { label: "Total colleges",   value: stats?.totalColleges    ?? 0, color: "#e8e8f0" },
          { label: "Approved",         value: stats?.approvedColleges ?? 0, color: "#43e97b" },
          { label: "Pending approval", value: stats?.pendingColleges  ?? 0, color: "#ffc107" },
          { label: "Total students",   value: stats?.totalStudents    ?? 0, color: "#6c63ff" },
          { label: "Total TPOs",       value: stats?.totalTPOs        ?? 0, color: "#ff6b6b" },
          { label: "Total drives",     value: stats?.totalDrives      ?? 0, color: "#e8e8f0" },
        ].map((st) => (
          <div key={st.label} style={sh.statCard}>
            <div style={sh.statLabel}>{st.label}</div>
            <div style={{ ...sh.statValue, color: st.color }}>{st.value}</div>
          </div>
        ))}
      </div>

      {stats?.pendingColleges > 0 && (
        <div style={s.pendingBanner}>
          <span style={{ fontSize: 13, color: "#ffc107" }}>
            {stats.pendingColleges} college(s) waiting for approval
          </span>
          <button
            style={{ ...sh.primaryBtn, background: "#ffc107", color: "#1a1a1a" }}
            onClick={() => navigate("/admin/colleges")}>
            Review now →
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}

const s = {
  pendingBanner: {
    background: "rgba(255,193,7,0.08)", border: "1px solid rgba(255,193,7,0.25)",
    borderRadius: 10, padding: "14px 18px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginTop: 8,
  },
};