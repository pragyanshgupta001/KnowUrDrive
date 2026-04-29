import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh } from "../../styles/shared";

export default function TPOAnalytics() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tpo/analytics")
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div style={sh.loader}>Loading analytics...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 style={sh.pageTitle}>Placement Analytics</h1>
      <p style={{ ...sh.pageSub, marginBottom: 28 }}>Statistics for your college's placement season</p>

      <div style={sh.statGrid4}>
        {[
          { label: "Total placed",  value: data?.totalPlaced ?? 0,                color: "#43e97b" },
          { label: "Average CTC",   value: `${data?.ctcStats?.avgCTC ?? 0} LPA`,  color: "#6c63ff" },
          { label: "Highest CTC",   value: `${data?.ctcStats?.maxCTC ?? 0} LPA`,  color: "#ffc107" },
          { label: "Lowest CTC",    value: `${data?.ctcStats?.minCTC ?? 0} LPA`,  color: "#ff6b6b" },
        ].map((st) => (
          <div key={st.label} style={sh.statCard}>
            <div style={sh.statLabel}>{st.label}</div>
            <div style={{ ...sh.statValue, color: st.color }}>{st.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* top companies */}
        <div style={sh.panel}>
          <div style={sh.panelTitle}>Top recruiting companies</div>
          {!data?.topCompanies?.length && <div style={{ fontSize: 13, color: "#333" }}>No placement data yet.</div>}
          {data?.topCompanies?.map((c, i) => (
            <div key={c.company} style={s.row}>
              <span style={s.rank}>#{i + 1}</span>
              <span style={{ flex: 1, fontSize: 13, color: "#ccc" }}>{c.company}</span>
              <span style={s.count}>{c.count} selected</span>
            </div>
          ))}
        </div>

        {/* branch-wise */}
        <div style={sh.panel}>
          <div style={sh.panelTitle}>Branch-wise placements</div>
          {!Object.keys(data?.branchWisePlacement ?? {}).length && (
            <div style={{ fontSize: 13, color: "#333" }}>No placement data yet.</div>
          )}
          {Object.entries(data?.branchWisePlacement ?? {}).map(([branch, count]) => (
            <div key={branch} style={s.row}>
              <span style={{ flex: 1, fontSize: 13, color: "#ccc" }}>{branch}</span>
              <span style={{ ...s.count, color: "#43e97b" }}>{count} placed</span>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}

const s = {
  row:   { display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #15151f" },
  rank:  { fontSize: 13, fontWeight: 700, color: "#6c63ff", width: 28 },
  count: { fontSize: 13, fontWeight: 600, color: "#aaa" },
};