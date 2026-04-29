import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/axios";
import { sh, STATUS_COLOR, STATUS_BG } from "../../styles/shared";

export default function DriveApplicants() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast]       = useState({ msg:"", type:"" });

  useEffect(() => {
    api.get(`/tpo/drives/${id}/applicants`).then(({ data }) => setData(data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const showToast = (msg, type="success") => { setToast({ msg, type }); setTimeout(() => setToast({ msg:"", type:"" }), 3000); };

  const handleStatus = async (appId, status) => {
    try {
      setUpdating(appId);
      await api.put(`/tpo/applications/${appId}/status`, { status });
      setData((prev) => ({ ...prev, applications: prev.applications.map((a) => a._id === appId ? { ...a, status } : a) }));
      showToast("Status updated");
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed", "error");
    } finally { setUpdating(null); }
  };

  if (loading) return <DashboardLayout><div style={sh.loader}>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <button style={sh.backBtn} onClick={() => navigate("/tpo/drives")}>← Back to drives</button>
      <h1 style={sh.pageTitle}>{data?.drive?.companyName} — {data?.drive?.role}</h1>
      <p style={{ ...sh.pageSub, marginBottom: 24 }}>{data?.applications?.length ?? 0} applicants · {data?.drive?.ctcOffered} LPA</p>

      {toast.msg && <div style={toast.type === "error" ? sh.errorToast : sh.successToast}>{toast.msg}</div>}

      <div style={sh.panel}>
        <div style={sh.tableWrap}>
          <table style={sh.table}>
            <thead>
              <tr>{["Student","Branch","CGPA","Status","Update status"].map((h) => <th key={h} style={sh.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {!data?.applications?.length && <tr><td style={sh.td} colSpan={5}>No applicants yet.</td></tr>}
              {data?.applications?.map((app) => (
                <tr key={app._id}>
                  <td style={sh.td}>
                    <div style={{ fontWeight: 600, color: "#ddd" }}>{app.studentId?.name}</div>
                    <div style={{ fontSize: 11, color: "#444" }}>{app.studentId?.email}</div>
                  </td>
                  <td style={sh.td}>{app.studentId?.department || "—"}</td>
                  <td style={sh.td}>{app.studentId?.cgpa ?? "—"}</td>
                  <td style={sh.td}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5, color: STATUS_COLOR[app.status], background: STATUS_BG[app.status] }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={sh.td}>
                    <select value={app.status} disabled={updating === app._id}
                      onChange={(e) => handleStatus(app._id, e.target.value)}
                      style={{ ...sh.select, padding: "6px 10px", fontSize: 12, width: "auto" }}>
                      {["APPLIED","SHORTLISTED","INTERVIEW","SELECTED","REJECTED"].map((st) => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}