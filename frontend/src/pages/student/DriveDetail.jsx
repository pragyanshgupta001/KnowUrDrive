import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh } from "../../styles/shared";

export default function DriveDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [drive, setDrive]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [toast, setToast]     = useState({ msg: "", type: "" });

  useEffect(() => {
    api.get(`/drives/${id}`).then(({ data }) => setDrive(data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast({ msg:"", type:"" }), 3000); };

  const handleApply = async () => {
    try {
      setApplying(true);
      await api.post(`/applications/${id}/apply`);
      showToast("Application submitted!");
      setDrive((d) => ({ ...d, alreadyApplied: true }));
    } catch (err) {
      showToast(err.response?.data?.message || "Could not apply.", "error");
    } finally { setApplying(false); }
  };

  if (loading) return <DashboardLayout><div style={sh.loader}>Loading...</div></DashboardLayout>;
  if (!drive)  return <DashboardLayout><div style={sh.loader}>Drive not found.</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <button style={sh.backBtn} onClick={() => navigate("/student/drives")}>← Back to drives</button>
      {toast.msg && <div style={toast.type === "error" ? sh.errorToast : sh.successToast}>{toast.msg}</div>}

      <div style={s.card}>
        <div style={s.top}>
          <div style={s.avatar}>{drive.companyName?.[0]}</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ ...sh.pageTitle, marginBottom: 4 }}>{drive.companyName}</h1>
            <div style={{ fontSize: 15, color: "#777" }}>{drive.role}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={s.ctc}>{drive.ctcOffered} LPA</div>
            <div style={{ fontSize: 12, color: "#444", marginTop: 2 }}>{drive.ctcType}</div>
          </div>
        </div>

        <div style={s.grid}>
          {[
            { label: "Job type",   value: drive.jobType },
            { label: "Location",   value: drive.jobLocation || "Not specified" },
            { label: "Drive date", value: drive.driveDate ? new Date(drive.driveDate).toDateString() : "TBD" },
            { label: "Deadline",   value: drive.deadline   ? new Date(drive.deadline).toDateString()  : "Not specified" },
            { label: "Min CGPA",   value: drive.eligibility?.minCGPA || "No minimum" },
            { label: "Branches",   value: drive.eligibility?.branches?.join(", ") || "All branches" },
            { label: "Backlogs",   value: drive.eligibility?.backlogAllowed ? `Allowed (max ${drive.eligibility.maxBacklogs})` : "Not allowed" },
          ].map((item) => (
            <div key={item.label} style={s.infoItem}>
              <div style={s.infoLabel}>{item.label}</div>
              <div style={s.infoValue}>{item.value}</div>
            </div>
          ))}
        </div>

        {drive.description && (
          <div style={s.section}>
            <div style={s.sectionTitle}>About the role</div>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.75 }}>{drive.description}</p>
          </div>
        )}

        {drive.selectionProcess?.length > 0 && (
          <div style={s.section}>
            <div style={s.sectionTitle}>Selection process</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {drive.selectionProcess.map((step, i) => (
                <div key={i} style={s.processStep}>
                  <span style={s.processNum}>{i+1}</span>{step}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={s.actions}>
          {drive.alreadyApplied
            ? <span style={{ fontSize: 14, color: "#43e97b", fontWeight: 600 }}>✓ Already applied</span>
            : <button style={s.applyBtn} disabled={applying} onClick={handleApply}>
                {applying ? "Submitting..." : "Apply now"}
              </button>
          }
        </div>
      </div>
    </DashboardLayout>
  );
}

const s = {
  card:        { background: "#111118", border: "1px solid #1a1a28", borderRadius: 16, padding: "28px" },
  top:         { display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #1a1a28" },
  avatar:      { width: 52, height: 52, borderRadius: 12, background: "#1a1a28", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, color: "#6c63ff", flexShrink: 0 },
  ctc:         { fontFamily: "'inter','DM Sans',sans-serif", fontSize: 24, fontWeight: 800, color: "#6c63ff" },
  grid:        { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 },
  infoItem:    { background: "#0e0e16", borderRadius: 10, padding: "14px 16px" },
  infoLabel:   { fontSize: 11, color: "#444", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  infoValue:   { fontSize: 14, fontWeight: 600, color: "#ccc" },
  section:     { marginBottom: 24, paddingTop: 24, borderTop: "1px solid #1a1a28" },
  sectionTitle:{ fontSize: 14, fontWeight: 700, color: "#aaa", marginBottom: 12 },
  processStep: { display: "flex", alignItems: "center", gap: 8, background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#888" },
  processNum:  { width: 20, height: 20, borderRadius: "50%", background: "rgba(108,99,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#6c63ff" },
  actions:     { paddingTop: 24, borderTop: "1px solid #1a1a28" },
  applyBtn:    { padding: "13px 36px", background: "#6c63ff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" },
};