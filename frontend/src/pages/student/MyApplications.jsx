import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh, STATUS_COLOR, STATUS_BG } from "../../styles/shared";

const ALL = ["APPLIED","SHORTLISTED","INTERVIEW","SELECTED","REJECTED"];

export default function MyApplications() {
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("ALL");
  const [withdrawing, setWithdrawing] = useState(null);
  const [toast, setToast]     = useState({ msg: "", type: "" });

  useEffect(() => {
    api.get("/applications/my").then(({ data }) => setApps(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast({ msg:"", type:"" }), 3000); };

  const handleWithdraw = async (appId) => {
    try {
      setWithdrawing(appId);
      await api.delete(`/applications/${appId}/withdraw`);
      setApps(apps.filter((a) => a._id !== appId));
      showToast("Application withdrawn.");
    } catch (err) {
      showToast(err.response?.data?.message || "Cannot withdraw.", "error");
    } finally { setWithdrawing(null); }
  };

  const filtered = filter === "ALL" ? apps : apps.filter((a) => a.status === filter);

  return (
    <DashboardLayout>
      <h1 style={sh.pageTitle}>My Applications</h1>
      <p style={{ ...sh.pageSub, marginBottom: 20 }}>Track every company you've applied to</p>

      <div style={s.tabs}>
        {["ALL", ...ALL].map((st) => (
          <button key={st} style={{ ...s.tab, ...(filter === st ? s.tabActive : {}) }} onClick={() => setFilter(st)}>
            {st}{st !== "ALL" && <span style={s.cnt}> {apps.filter((a) => a.status === st).length}</span>}
          </button>
        ))}
      </div>

      {toast.msg && <div style={toast.type === "error" ? sh.errorToast : sh.successToast}>{toast.msg}</div>}

      {loading ? <div style={sh.loader}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.length === 0 && <div style={sh.empty}>No applications in this category.</div>}
          {filtered.map((app) => (
            <div key={app._id} style={s.row}>
              <div style={s.avatar}>{app.driveId?.companyName?.[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={s.co}>{app.driveId?.companyName}</div>
                <div style={s.meta}>{app.driveId?.role} · {app.driveId?.ctcOffered} LPA · {app.driveId?.jobType}</div>
                {app.remarks && <div style={s.remarks}>TPO note: {app.remarks}</div>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <span style={{ ...s.badge, color: STATUS_COLOR[app.status], background: STATUS_BG[app.status] }}>{app.status}</span>
                {app.status === "APPLIED" && (
                  <button style={s.withdrawBtn} disabled={withdrawing === app._id}
                    onClick={() => handleWithdraw(app._id)}>
                    {withdrawing === app._id ? "..." : "Withdraw"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

const s = {
  tabs:        { display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" },
  tab:         { padding: "7px 14px", background: "transparent", border: "1px solid #1e1e2e", borderRadius: 20, fontSize: 12, color: "#555", cursor: "pointer", fontFamily: "inherit" },
  tabActive:   { background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.3)", color: "#6c63ff" },
  cnt:         { fontSize: 10, opacity: 0.7 },
  row:         { background: "#111118", border: "1px solid #1a1a28", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 },
  avatar:      { width: 38, height: 38, borderRadius: 9, background: "#1a1a28", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#6c63ff", flexShrink: 0 },
  co:          { fontSize: 14, fontWeight: 600, color: "#ddd", marginBottom: 3 },
  meta:        { fontSize: 12, color: "#444" },
  remarks:     { fontSize: 11, color: "#6c63ff", marginTop: 4 },
  badge:       { fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 6 },
  withdrawBtn: { fontSize: 11, color: "#ff6b6b", background: "transparent", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" },
};