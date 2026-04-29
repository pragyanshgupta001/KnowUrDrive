import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import useAuthStore from "../../store/authStore";
import { sh, STATUS_COLOR, STATUS_BG } from "../../styles/shared";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/students/dashboard").then(({ data }) => setData(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div style={sh.loader}>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={sh.header}>
        <div>
          <h1 style={sh.pageTitle}>Good morning, {user?.name?.split(" ")[0]} 👋</h1>
          <p style={sh.pageSub}>Here's your placement overview</p>
        </div>
        {user?.placementStatus === "PLACED" && (
          <div style={s.placedBadge}>✓ Placed · {user?.currentOfferCTC} LPA</div>
        )}
      </div>

      <div style={sh.statGrid4}>
        {[
          { label: "Total applied",  value: data?.stats?.totalApplications ?? 0, color: "#6c63ff" },
          { label: "Shortlisted",    value: data?.stats?.shortlisted ?? 0,       color: "#ffc107" },
          { label: "Selected",       value: data?.stats?.selected ?? 0,          color: "#43e97b" },
          { label: "Active drives",  value: data?.stats?.activeDrives ?? 0,      color: "#ff6b6b" },
        ].map((st) => (
          <div key={st.label} style={sh.statCard}>
            <div style={sh.statLabel}>{st.label}</div>
            <div style={{ ...sh.statValue, color: st.color }}>{st.value}</div>
          </div>
        ))}
      </div>

      <div style={s.twoCol}>
        <div style={sh.panel}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={sh.panelTitle}>Recent applications</span>
            <span style={s.panelLink} onClick={() => navigate("/student/applications")}>View all →</span>
          </div>
          {!data?.recentApplications?.length && <div style={sh.empty}>No applications yet. Browse drives to apply.</div>}
          {data?.recentApplications?.map((app) => (
            <div key={app._id} style={s.appRow}>
              <div style={s.appAvatar}>{app.driveId?.companyName?.[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={s.appCo}>{app.driveId?.companyName}</div>
                <div style={s.appMeta}>{app.driveId?.role} · {app.driveId?.ctcOffered} LPA</div>
              </div>
              <span style={{ ...s.badge, color: STATUS_COLOR[app.status], background: STATUS_BG[app.status] }}>{app.status}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={sh.panel}>
            <div style={sh.panelTitle}>Quick actions</div>
            {[
              { label: "Browse open drives",   path: "/student/drives",       color: "#6c63ff" },
              { label: "My applications",      path: "/student/applications", color: "#ffc107" },
              { label: "College notices",      path: "/student/notices",      color: "#43e97b" },
              { label: "Edit my profile",      path: "/student/profile",      color: "#ff6b6b" },
            ].map((a) => (
              <div key={a.path} style={s.action} onClick={() => navigate(a.path)}>
                <span style={{ ...s.actionDot, background: a.color }} />
                {a.label}
                <span style={{ marginLeft: "auto", color: "#333" }}>→</span>
              </div>
            ))}
          </div>

          <div style={{ ...sh.panel, border: "1px solid rgba(108,99,255,0.2)" }}>
            <div style={sh.panelTitle}>Placement status</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: user?.placementStatus === "PLACED" ? "#43e97b" : "#555", marginTop: 8 }}>
              {user?.placementStatus ?? "UNPLACED"}
            </div>
            {user?.currentOfferCTC && (
              <div style={{ fontSize: 13, color: "#555", marginTop: 8 }}>
                Best offer: <span style={{ color: "#43e97b", fontWeight: 600 }}>{user.currentOfferCTC} LPA</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const s = {
  placedBadge: { background: "rgba(67,233,123,0.12)", border: "1px solid rgba(67,233,123,0.3)", color: "#43e97b", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 20 },
  twoCol:    { display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 },
  panelLink: { fontSize: 12, color: "#6c63ff", cursor: "pointer" },
  appRow:    { display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid #15151f" },
  appAvatar: { width: 34, height: 34, borderRadius: 8, background: "#1a1a28", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#6c63ff", flexShrink: 0 },
  appCo:     { fontSize: 13, fontWeight: 600, color: "#ddd", marginBottom: 2 },
  appMeta:   { fontSize: 11, color: "#444" },
  badge:     { fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6 },
  action:    { display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#777", background: "#0e0e16", marginBottom: 6 },
  actionDot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
};