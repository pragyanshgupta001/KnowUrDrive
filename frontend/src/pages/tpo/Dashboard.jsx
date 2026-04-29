import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh } from "../../styles/shared";

export default function TPODashboard() {
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tpo/dashboard").then(({ data }) => setData(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div style={sh.loader}>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={sh.header}>
        <div><h1 style={sh.pageTitle}>TPO Dashboard</h1><p style={sh.pageSub}>Manage your college's placement activity</p></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={sh.ghostBtn} onClick={() => navigate("/tpo/notices/new")}>+ Post notice</button>
          <button style={sh.primaryBtn} onClick={() => navigate("/tpo/drives/new")}>+ Post drive</button>
        </div>
      </div>

      <div style={sh.statGrid4}>
        {[
          { label: "Total students",   value: data?.stats?.totalStudents ?? 0,          color: "#e8e8f0" },
          { label: "Placed",           value: data?.stats?.placedStudents ?? 0,          color: "#43e97b" },
          { label: "Placement %",      value: data?.stats?.placementPercentage ?? "0%",  color: "#6c63ff" },
          { label: "Active drives",    value: data?.stats?.activeDrives ?? 0,            color: "#ffc107" },
        ].map((st) => (
          <div key={st.label} style={sh.statCard}>
            <div style={sh.statLabel}>{st.label}</div>
            <div style={{ ...sh.statValue, color: st.color }}>{st.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={sh.panel}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={sh.panelTitle}>Recent drives</span>
            <span style={s.link} onClick={() => navigate("/tpo/drives")}>View all →</span>
          </div>
          {data?.recentDrives?.map((d) => (
            <div key={d._id} style={s.driveRow}>
              <div style={s.avatar}>{d.companyName?.[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={s.driveCo}>{d.companyName}</div>
                <div style={s.driveMeta}>{d.role}</div>
              </div>
              <span style={{ ...s.statusPill, background: d.isActive ? "rgba(67,233,123,0.12)" : "#1a1a28", color: d.isActive ? "#43e97b" : "#444" }}>
                {d.isActive ? "Active" : "Closed"}
              </span>
            </div>
          ))}
        </div>

        <div style={sh.panel}>
          <div style={sh.panelTitle}>Quick actions</div>
          {[
            { label: "View all students",   path: "/tpo/students",  color: "#6c63ff" },
            { label: "Placement analytics", path: "/tpo/analytics", color: "#ffc107" },
            { label: "Manage notices",      path: "/tpo/notices",   color: "#43e97b" },
          ].map((a) => (
            <div key={a.path} style={s.action} onClick={() => navigate(a.path)}>
              <span style={{ ...s.dot, background: a.color }} />
              {a.label}
              <span style={{ marginLeft: "auto", color: "#333" }}>→</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

const s = {
  link:       { fontSize: 12, color: "#6c63ff", cursor: "pointer" },
  driveRow:   { display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #15151f" },
  avatar:     { width: 32, height: 32, borderRadius: 7, background: "#1a1a28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#6c63ff" },
  driveCo:    { fontSize: 13, fontWeight: 600, color: "#ddd" },
  driveMeta:  { fontSize: 11, color: "#444" },
  statusPill: { fontSize: 10, padding: "2px 8px", borderRadius: 5 },
  action:     { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#777", background: "#0e0e16", marginBottom: 8 },
  dot:        { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
};