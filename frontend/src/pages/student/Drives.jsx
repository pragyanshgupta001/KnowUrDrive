import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh } from "../../styles/shared";

export default function StudentDrives() {
  const navigate = useNavigate();
  const [drives, setDrives]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [applying, setApplying] = useState(null);
  const [toast, setToast]       = useState({ msg: "", type: "" });
  const [filters, setFilters]   = useState({ branch: "", minCTC: "", jobType: "" });

  const fetchDrives = () => {
    const p = new URLSearchParams();
    if (filters.branch)  p.append("branch",  filters.branch);
    if (filters.minCTC)  p.append("minCTC",  filters.minCTC);
    if (filters.jobType) p.append("jobType", filters.jobType);
    setLoading(true);
    api.get(`/drives?${p}`).then(({ data }) => setDrives(data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDrives(); }, [filters]);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast({ msg: "", type: "" }), 3000); };

  const handleApply = async (driveId) => {
    try {
      setApplying(driveId);
      await api.post(`/applications/${driveId}/apply`);
      showToast("Application submitted!");
      fetchDrives();
    } catch (err) {
      showToast(err.response?.data?.message || "Could not apply", "error");
    } finally { setApplying(null); }
  };

  return (
    <DashboardLayout>
      <div style={sh.header}>
        <div><h1 style={sh.pageTitle}>Placement Drives</h1><p style={sh.pageSub}>All active drives at your college</p></div>
      </div>

      <div style={s.filterRow}>
        {[
          { name: "branch",  placeholder: "All branches",  opts: ["CSE","IT","ECE","EEE","ME","CE"] },
          { name: "jobType", placeholder: "All job types", opts: ["FULL_TIME","INTERNSHIP","PPO"] },
        ].map((f) => (
          <select key={f.name} value={filters[f.name]}
            onChange={(e) => setFilters({ ...filters, [f.name]: e.target.value })} style={s.filterSel}>
            <option value="">{f.placeholder}</option>
            {f.opts.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        <input type="number" placeholder="Min CTC (LPA)" value={filters.minCTC}
          onChange={(e) => setFilters({ ...filters, minCTC: e.target.value })} style={s.filterInput} />
        <button style={sh.ghostBtn} onClick={() => setFilters({ branch:"", minCTC:"", jobType:"" })}>Clear</button>
      </div>

      {toast.msg && <div style={toast.type === "error" ? sh.errorToast : sh.successToast}>{toast.msg}</div>}

      {loading ? <div style={sh.loader}>Loading drives...</div> : (
        <div style={s.grid}>
          {drives.length === 0 && <div style={{ ...sh.empty, gridColumn: "1/-1" }}>No drives found.</div>}
          {drives.map((drive) => (
            <div key={drive._id} style={{ ...s.card, ...(!drive.eligibilityCheck?.eligible ? { opacity: 0.6 } : {}) }}>
              <div style={s.cardTop}>
                <div style={s.avatar}>{drive.companyName?.[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.co}>{drive.companyName}</div>
                  <div style={s.role}>{drive.role}</div>
                </div>
                <div style={s.ctc}>{drive.ctcOffered} LPA</div>
              </div>

              <div style={s.tags}>
                <span style={s.tag}>{drive.jobType}</span>
                {drive.eligibility?.branches?.length > 0 && <span style={s.tag}>{drive.eligibility.branches.join(", ")}</span>}
                {drive.eligibility?.minCGPA > 0 && <span style={s.tag}>CGPA ≥ {drive.eligibility.minCGPA}</span>}
              </div>

              {drive.deadline && <div style={s.deadline}>Deadline: {new Date(drive.deadline).toDateString()}</div>}

              {!drive.eligibilityCheck?.eligible && drive.eligibilityCheck?.reasons?.length > 0 && (
                <div style={s.ineligNote}>{drive.eligibilityCheck.reasons[0]}</div>
              )}

              <div style={s.cardBtns}>
                <button style={sh.ghostBtn} onClick={() => navigate(`/student/drives/${drive._id}`)}>View details</button>
                {drive.alreadyApplied
                  ? <span style={s.appliedBadge}>✓ Applied</span>
                  : <button
                      style={{ ...s.applyBtn, ...(!drive.eligibilityCheck?.eligible ? s.applyDisabled : {}) }}
                      disabled={!drive.eligibilityCheck?.eligible || applying === drive._id}
                      onClick={() => handleApply(drive._id)}>
                      {applying === drive._id ? "Applying..." : "Apply"}
                    </button>
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

const s = {
  filterRow:   { display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" },
  filterSel:   { padding: "9px 12px", background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, fontSize: 13, color: "#aaa", fontFamily: "inherit", outline: "none", cursor: "pointer" },
  filterInput: { padding: "9px 12px", background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, fontSize: 13, color: "#aaa", fontFamily: "inherit", outline: "none", width: 140 },
  grid:        { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
  card:        { background: "#111118", border: "1px solid #1a1a28", borderRadius: 14, padding: "20px" },
  cardTop:     { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 },
  avatar:      { width: 40, height: 40, borderRadius: 10, background: "#1a1a28", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "#6c63ff", flexShrink: 0 },
  co:          { fontSize: 15, fontWeight: 700, color: "#e8e8f0", marginBottom: 2 },
  role:        { fontSize: 12, color: "#555" },
  ctc:         { fontFamily: "'inter','DM Sans',sans-serif", fontSize: 16, fontWeight: 800, color: "#6c63ff", flexShrink: 0 },
  tags:        { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 },
  tag:         { fontSize: 11, padding: "3px 8px", background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 5, color: "#555" },
  deadline:    { fontSize: 12, color: "#444", marginBottom: 12 },
  ineligNote:  { fontSize: 11, color: "#ff6b6b", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 6, padding: "7px 10px", marginBottom: 12 },
  cardBtns:    { display: "flex", gap: 10, alignItems: "center" },
  applyBtn:    { padding: "8px 20px", background: "#6c63ff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" },
  applyDisabled:{ background: "#1a1a28", color: "#333", cursor: "not-allowed" },
  appliedBadge:{ fontSize: 12, color: "#43e97b", fontWeight: 600 },
};