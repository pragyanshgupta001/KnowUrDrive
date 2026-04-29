import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh } from "../../styles/shared";

export default function DriveForm() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const isEdit    = Boolean(id);

  const [form, setForm] = useState({ companyName:"", role:"", description:"", ctcOffered:"", ctcType:"FIXED", jobType:"FULL_TIME", jobLocation:"", driveDate:"", deadline:"", branches:"", minCGPA:"", backlogAllowed:false, selectionProcess:"" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState("");

  useEffect(() => {
    if (isEdit) {
      api.get(`/drives/${id}`).then(({ data }) => {
        setForm({
          ...data,
          branches:         data.eligibility?.branches?.join(", ") || "",
          minCGPA:          data.eligibility?.minCGPA || "",
          backlogAllowed:   data.eligibility?.backlogAllowed || false,
          selectionProcess: data.selectionProcess?.join(", ") || "",
          driveDate:        data.driveDate?.split("T")[0] || "",
          deadline:         data.deadline?.split("T")[0] || "",
        });
      }).catch(console.error);
    }
  }, [id]);

  const onChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName || !form.role || !form.ctcOffered) return setToast("Company name, role and CTC are required");
    try {
      setLoading(true);
      const payload = {
        ...form,
        ctcOffered: Number(form.ctcOffered),
        eligibility: {
          branches:       form.branches ? form.branches.split(",").map((b) => b.trim()) : [],
          minCGPA:        Number(form.minCGPA) || 0,
          backlogAllowed: form.backlogAllowed,
        },
        selectionProcess: form.selectionProcess ? form.selectionProcess.split(",").map((s) => s.trim()) : [],
      };
      if (isEdit) await api.put(`/drives/${id}`, payload);
      else        await api.post("/tpo/drives", payload);
      navigate("/tpo/drives");
    } catch (err) {
      setToast(err.response?.data?.message || "Failed to save drive.");
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <button style={sh.backBtn} onClick={() => navigate("/tpo/drives")}>← Back to drives</button>
      <h1 style={sh.pageTitle}>{isEdit ? "Edit Drive" : "Post New Drive"}</h1>
      <p style={{ ...sh.pageSub, marginBottom: 28 }}>Fill in company and eligibility details</p>

      {toast && <div style={sh.errorToast}>{toast}</div>}

      <form onSubmit={onSubmit} style={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={sh.twoCol}>
          <div style={sh.field}><label style={sh.label}>Company name *</label>
            <input name="companyName" value={form.companyName} onChange={onChange} style={sh.input} placeholder="e.g. Google" /></div>
          <div style={sh.field}><label style={sh.label}>Role *</label>
            <input name="role" value={form.role} onChange={onChange} style={sh.input} placeholder="e.g. Software Engineer" /></div>
        </div>

        <div style={sh.threeCol}>
          <div style={sh.field}><label style={sh.label}>CTC (LPA) *</label>
            <input name="ctcOffered" type="number" value={form.ctcOffered} onChange={onChange} style={sh.input} placeholder="12" /></div>
          <div style={sh.field}><label style={sh.label}>CTC type</label>
            <select name="ctcType" value={form.ctcType} onChange={onChange} style={sh.select}><option value="FIXED">Fixed</option><option value="UPTO">Upto</option></select></div>
          <div style={sh.field}><label style={sh.label}>Job type</label>
            <select name="jobType" value={form.jobType} onChange={onChange} style={sh.select}><option value="FULL_TIME">Full time</option><option value="INTERNSHIP">Internship</option><option value="PPO">PPO</option></select></div>
        </div>

        <div style={sh.twoCol}>
          <div style={sh.field}><label style={sh.label}>Drive date</label>
            <input name="driveDate" type="date" value={form.driveDate} onChange={onChange} style={sh.input} /></div>
          <div style={sh.field}><label style={sh.label}>Deadline</label>
            <input name="deadline" type="date" value={form.deadline} onChange={onChange} style={sh.input} /></div>
        </div>

        <div style={sh.field}><label style={sh.label}>Job location</label>
          <input name="jobLocation" value={form.jobLocation} onChange={onChange} style={sh.input} placeholder="e.g. Bengaluru / Remote" /></div>

        <div style={sh.field}><label style={sh.label}>Description</label>
          <textarea name="description" value={form.description} onChange={onChange} style={sh.textarea} placeholder="Role description and responsibilities..." /></div>

        <div style={{ ...sh.field, background:"#111118", border:"1px solid #1a1a28", borderRadius:12, padding:20, gap:16 }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#aaa" }}>Eligibility criteria</div>
          <div style={sh.twoCol}>
            <div style={sh.field}><label style={sh.label}>Eligible branches</label>
              <input name="branches" value={form.branches} onChange={onChange} style={sh.input} placeholder="CSE, IT, ECE (comma separated)" /></div>
            <div style={sh.field}><label style={sh.label}>Minimum CGPA</label>
              <input name="minCGPA" type="number" step="0.1" min="0" max="10" value={form.minCGPA} onChange={onChange} style={sh.input} placeholder="e.g. 7.5" /></div>
          </div>
          <label style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:"#aaa", cursor:"pointer" }}>
            <input type="checkbox" name="backlogAllowed" checked={form.backlogAllowed} onChange={onChange} />
            Backlogs allowed
          </label>
        </div>

        <div style={sh.field}><label style={sh.label}>Selection process</label>
          <input name="selectionProcess" value={form.selectionProcess} onChange={onChange} style={sh.input} placeholder="Aptitude, Technical, HR (comma separated)" /></div>

        <div style={{ display:"flex", gap:12 }}>
          <button type="submit" style={sh.primaryBtn} disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Save changes" : "Post drive & notify students"}
          </button>
          <button type="button" style={sh.ghostBtn} onClick={() => navigate("/tpo/drives")}>Cancel</button>
        </div>
      </form>
    </DashboardLayout>
  );
}