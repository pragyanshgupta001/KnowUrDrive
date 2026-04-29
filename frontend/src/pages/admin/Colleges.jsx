import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh } from "../../styles/shared";

export default function AdminColleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("");
  const [toast, setToast]       = useState({ msg: "", type: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const fetchColleges = () => {
    const q = filter !== "" ? `?approved=${filter}` : "";
    setLoading(true);
    api.get(`/admin/colleges${q}`)
      .then(({ data }) => setColleges(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchColleges(); }, [filter]);

  const handleApproval = async (id, approve) => {
    try {
      await api.put(`/admin/colleges/${id}/approval`, { isApproved: approve });
      setColleges(colleges.map((c) => c._id === id ? { ...c, isApproved: approve } : c));
      showToast(approve ? "College approved!" : "Approval revoked.");
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed.", "error");
    }
  };

  const handlePolicyUpdate = async (id, minCTCMultiplier) => {
    try {
      await api.put(`/admin/colleges/${id}/policy`, { minCTCMultiplier: Number(minCTCMultiplier) });
      showToast("Policy updated.");
    } catch (err) {
      showToast("Policy update failed.", "error");
    }
  };

  return (
    <DashboardLayout>
      <h1 style={sh.pageTitle}>Colleges</h1>
      <p style={{ ...sh.pageSub, marginBottom: 20 }}>Manage all colleges on the platform</p>

      <div style={s.filterRow}>
        {[["", "All"], ["true", "Approved"], ["false", "Pending"]].map(([val, label]) => (
          <button key={val}
            style={{ ...sh.ghostBtn, ...(filter === val ? s.filterActive : {}) }}
            onClick={() => setFilter(val)}>
            {label}
          </button>
        ))}
      </div>

      {toast.msg && <div style={toast.type === "error" ? sh.errorToast : sh.successToast}>{toast.msg}</div>}

      {loading ? <div style={sh.loader}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {colleges.length === 0 && <div style={sh.empty}>No colleges found.</div>}
          {colleges.map((c) => (
            <div key={c._id} style={sh.panel}>
              <div style={s.cardTop}>
                <div style={s.avatar}>{c.name?.[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.name}>{c.name}</div>
                  <div style={s.meta}>
                    Code: <span style={s.code}>{c.code}</span>
                    {c.domain && ` · ${c.domain}`}
                    {c.address && ` · ${c.address}`}
                  </div>
                </div>
                <span style={{ ...s.statusPill, ...(c.isApproved ? s.pillGreen : s.pillAmber) }}>
                  {c.isApproved ? "Approved" : "Pending"}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  {!c.isApproved && (
                    <button style={s.approveBtn} onClick={() => handleApproval(c._id, true)}>Approve</button>
                  )}
                  {c.isApproved && (
                    <button style={s.revokeBtn} onClick={() => handleApproval(c._id, false)}>Revoke</button>
                  )}
                </div>
              </div>

              {/* policy row */}
              {c.isApproved && (
                <div style={s.policyRow}>
                  <span style={{ fontSize: 12, color: "#444" }}>
                    Lock multiplier:
                  </span>
                  <input
                    type="number" step="0.1" min="1" defaultValue={c.policyId?.minCTCMultiplier ?? 1.7}
                    style={{ ...sh.input, width: 80, padding: "5px 10px", fontSize: 13 }}
                    onBlur={(e) => handlePolicyUpdate(c._id, e.target.value)}
                  />
                  <span style={{ fontSize: 11, color: "#333" }}>× current offer CTC</span>
                  <span style={{ fontSize: 12, color: "#444", marginLeft: "auto" }}>
                    Max offers: <span style={{ color: "#888" }}>{c.policyId?.maxOffersAllowed ?? 3}</span>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

const s = {
  filterRow:   { display: "flex", gap: 8, marginBottom: 20 },
  filterActive:{ background: "rgba(108,99,255,0.12)", color: "#6c63ff", borderColor: "rgba(108,99,255,0.3)" },
  cardTop:     { display: "flex", alignItems: "center", gap: 16 },
  avatar:      { width: 42, height: 42, borderRadius: 10, background: "rgba(108,99,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#6c63ff", flexShrink: 0 },
  name:        { fontSize: 14, fontWeight: 700, color: "#ddd", marginBottom: 3 },
  meta:        { fontSize: 12, color: "#444" },
  code:        { fontFamily: "monospace", color: "#888" },
  statusPill:  { fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 6, flexShrink: 0 },
  pillGreen:   { background: "rgba(67,233,123,0.12)", color: "#43e97b" },
  pillAmber:   { background: "rgba(255,193,7,0.1)",   color: "#ffc107" },
  approveBtn:  { padding: "6px 14px", background: "rgba(67,233,123,0.12)", border: "1px solid rgba(67,233,123,0.3)", borderRadius: 7, fontSize: 12, color: "#43e97b", cursor: "pointer", fontFamily: "inherit" },
  revokeBtn:   { padding: "6px 14px", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 7, fontSize: 12, color: "#ff6b6b", cursor: "pointer", fontFamily: "inherit" },
  policyRow:   { display: "flex", alignItems: "center", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid #1a1a28" },
};