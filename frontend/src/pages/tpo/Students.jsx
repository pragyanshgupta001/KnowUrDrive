import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh } from "../../styles/shared";

export default function TPOStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filters, setFilters]   = useState({ department: "", placementStatus: "", year: "" });

  const fetchStudents = () => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && p.append(k, v));
    setLoading(true);
    api.get(`/tpo/students?${p}`)
      .then(({ data }) => setStudents(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, [filters]);

  return (
    <DashboardLayout>
      <h1 style={sh.pageTitle}>Students</h1>
      <p style={{ ...sh.pageSub, marginBottom: 20 }}>All registered students at your college</p>

      <div style={s.filterRow}>
        {[
          { name: "department",      placeholder: "All branches", opts: ["CSE","IT","ECE","EEE","ME","CE","AIDS","CSIT"] },
          { name: "placementStatus", placeholder: "All statuses", opts: ["UNPLACED","PLACED","OFFER_PENDING"] },
          { name: "year",            placeholder: "All years",    opts: ["1","2","3","4"] },
        ].map((f) => (
          <select key={f.name} value={filters[f.name]}
            onChange={(e) => setFilters({ ...filters, [f.name]: e.target.value })}
            style={s.sel}>
            <option value="">{f.placeholder}</option>
            {f.opts.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        <button style={sh.ghostBtn} onClick={() => setFilters({ department:"", placementStatus:"", year:"" })}>
          Clear
        </button>
      </div>

      {loading ? <div style={sh.loader}>Loading...</div> : (
        <div style={sh.panel}>
          <div style={sh.tableWrap}>
            <table style={sh.table}>
              <thead>
                <tr>
                  {["Name", "Branch", "Year", "CGPA", "Placement status", "Offer CTC"].map((h) => (
                    <th key={h} style={sh.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr><td style={sh.td} colSpan={6}>No students found.</td></tr>
                )}
                {students.map((st) => (
                  <tr key={st._id}>
                    <td style={sh.td}>
                      <div style={{ fontWeight: 600, color: "#ddd" }}>{st.name}</div>
                      <div style={{ fontSize: 11, color: "#444" }}>{st.email}</div>
                    </td>
                    <td style={sh.td}>{st.department || "—"}</td>
                    <td style={sh.td}>{st.year ? `Year ${st.year}` : "—"}</td>
                    <td style={sh.td}>{st.cgpa ?? "—"}</td>
                    <td style={sh.td}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5,
                        color:       st.placementStatus === "PLACED" ? "#43e97b" : "#888",
                        background:  st.placementStatus === "PLACED" ? "rgba(67,233,123,0.12)" : "#1a1a28",
                      }}>
                        {st.placementStatus}
                      </span>
                    </td>
                    <td style={sh.td}>
                      {st.currentOfferCTC ? `${st.currentOfferCTC} LPA` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

const s = {
  filterRow: { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" },
  sel:       { padding: "9px 12px", background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, fontSize: 13, color: "#aaa", fontFamily: "inherit", outline: "none", cursor: "pointer" },
};