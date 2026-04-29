import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/axios";
import useAuthStore from "../../store/authStore";

const BRANCHES = ["CSE","IT","ECE","EEE","ME","CE","AIDS","CSIT","Other"];

export default function Register() {
  const navigate              = useNavigate();
  const { setAuth }           = useAuthStore();
  const [step, setStep]       = useState(1);
  const [colleges, setColleges] = useState([]);
  const [form, setForm]       = useState({ name:"", email:"", password:"", confirm:"", collegeCode:"", department:"", year:"", cgpa:"" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    api.get("/colleges").then(({ data }) => setColleges(data)).catch(() => {});
  }, []);

  const onChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const toStep2 = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) return setError("Please fill in all fields");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    setError(""); setStep(2);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.collegeCode || !form.department || !form.year) return setError("Please fill in all fields");
    try {
      setLoading(true);
      const { data } = await api.post("/auth/register", {
        name: form.name, email: form.email, password: form.password,
        collegeCode: form.collegeCode, department: form.department,
        year: Number(form.year), cgpa: form.cgpa ? Number(form.cgpa) : undefined,
      });
      setAuth(data, data.token);
      navigate("/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  const score = form.password
    ? [form.password.length >= 6, /[A-Z]/.test(form.password), /[0-9]/.test(form.password), /[^A-Za-z0-9]/.test(form.password)].filter(Boolean).length
    : 0;
  const strengthColor = ["#ff6b6b","#ff6b6b","#ffc107","#43e97b","#43e97b"][score];
  const strengthLabel = ["Too short","Weak","Fair","Good","Strong"][score];

  return (
    <div style={s.page}>
      <div style={s.glow1} /><div style={s.glow2} />
      <div style={s.card}>

        <div style={s.logoWrap} onClick={() => navigate("/")}>
          Know<span style={s.acc}>Ur</span>Drive
        </div>

        <h1 style={s.title}>Create your account</h1>
        <p style={s.sub}>Student registration — free forever</p>

        {/* step indicator */}
        <div style={s.steps}>
          {["Account details", "College & profile"].map((lbl, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, flex: i === 0 ? 1 : 0 }}>
              <div style={{ ...s.stepCircle, ...(step === i+1 ? s.stepActive : step > i+1 ? s.stepDone : {}) }}>
                {step > i+1 ? "✓" : i+1}
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: step === i+1 ? "#e8e8f0" : "#333" }}>{lbl}</span>
              {i === 0 && <div style={{ flex: 1, height: 1, background: step > 1 ? "#6c63ff" : "#1e1e2e" }} />}
            </div>
          ))}
        </div>

        {error && <div style={s.errBox}><span style={s.errDot} />{error}</div>}

        {/* step 1 */}
        {step === 1 && (
          <form onSubmit={toStep2} style={s.form}>
            <div style={s.field}><label style={s.label}>Full name</label>
              <input name="name" placeholder="Rahul Sharma" value={form.name} onChange={onChange} style={s.input} /></div>
            <div style={s.field}><label style={s.label}>Email address</label>
              <input name="email" type="email" placeholder="you@college.edu" value={form.email} onChange={onChange} style={s.input} /></div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <div style={{ position: "relative" }}>
                <input name="password" type={showPass ? "text" : "password"} placeholder="Min 6 characters"
                  value={form.password} onChange={onChange} style={{ ...s.input, paddingRight: 44 }} />
                <button type="button" style={s.eye} onClick={() => setShowPass(!showPass)}>{showPass ? "●" : "○"}</button>
              </div>
              {form.password && (
                <div>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4, marginTop: 6 }}>
                    {[0,1,2,3].map((i) => <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i < score ? strengthColor : "#1e1e2e", transition:"background 0.3s" }} />)}
                  </div>
                  <span style={{ fontSize: 11, color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>
            <div style={s.field}><label style={s.label}>Confirm password</label>
              <input name="confirm" type={showPass ? "text" : "password"} placeholder="Re-enter password"
                value={form.confirm} onChange={onChange} style={s.input} /></div>
            <button type="submit" style={s.submit}>Continue →</button>
          </form>
        )}

        {/* step 2 */}
        {step === 2 && (
          <form onSubmit={onSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>College</label>
              <select name="collegeCode" value={form.collegeCode} onChange={onChange} style={s.select}>
                <option value="">Select your college</option>
                {colleges.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
              <span style={{ fontSize: 11, color: "#333", marginTop: 2 }}>
                Not listed?{" "}
                <span style={{ color: "#6c63ff", cursor: "pointer" }} onClick={() => navigate("/college/request")}>Register your college</span>
              </span>
            </div>

            <div style={s.twoCol}>
              <div style={s.field}><label style={s.label}>Branch</label>
                <select name="department" value={form.department} onChange={onChange} style={s.select}>
                  <option value="">Select branch</option>
                  {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select></div>
              <div style={s.field}><label style={s.label}>Year</label>
                <select name="year" value={form.year} onChange={onChange} style={s.select}>
                  <option value="">Select year</option>
                  {[1,2,3,4].map((y) => <option key={y} value={y}>Year {y}</option>)}
                </select></div>
            </div>

            <div style={s.field}>
              <label style={{ ...s.label, display: "flex", gap: 8 }}>
                CGPA <span style={{ fontSize: 10, color: "#333", background: "#1a1a28", padding: "1px 6px", borderRadius: 4, fontWeight: 400 }}>optional</span>
              </label>
              <input name="cgpa" type="number" placeholder="e.g. 8.5" min="0" max="10" step="0.01"
                value={form.cgpa} onChange={onChange} style={s.input} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" style={s.backBtn} onClick={() => { setStep(1); setError(""); }}>← Back</button>
              <button type="submit" style={{ ...s.submit, flex: 1 }} disabled={loading}>
                {loading ? <span style={s.spinner} /> : "Create account"}
              </button>
            </div>
          </form>
        )}

        <p style={s.bottom}>Already have an account?{" "}<Link to="/login" style={s.link}>Log in</Link></p>
      </div>
      <span style={s.back} onClick={() => navigate("/")}>← Back to home</span>
    </div>
  );
}

const s = {
  page:       { minHeight:"100vh", background:"#0a0a0f", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", position:"relative", overflow:"hidden", fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif" },
  glow1:      { position:"absolute", top:"5%", right:"15%", width:500, height:500, pointerEvents:"none", background:"radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)" },
  glow2:      { position:"absolute", bottom:"10%", left:"10%", width:400, height:400, pointerEvents:"none", background:"radial-gradient(circle, rgba(67,233,123,0.06) 0%, transparent 70%)" },
  card:       { background:"#111118", border:"1px solid #1e1e2e", borderRadius:18, padding:"40px", width:"100%", maxWidth:460, position:"relative", zIndex:1 },
  logoWrap:   { fontFamily:"'inter','DM Sans',sans-serif", fontSize:20, fontWeight:800, color:"#fff", letterSpacing:"-0.5px", marginBottom:26, cursor:"pointer", display:"inline-block" },
  acc:        { color:"#6c63ff" },
  title:      { fontFamily:"'inter','DM Sans',sans-serif", fontSize:24, fontWeight:800, color:"#fff", letterSpacing:"-0.5px", marginBottom:6, lineHeight:1.35 },
  sub:        { fontSize:14, color:"#555", marginBottom:24 },
  steps:      { display:"flex", alignItems:"center", gap:8, marginBottom:28 },
  stepCircle: { width:26, height:26, borderRadius:"50%", background:"#1a1a28", border:"1.5px solid #2a2a3e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#444", flexShrink:0 },
  stepActive: { background:"#6c63ff", border:"1.5px solid #6c63ff", color:"#fff" },
  stepDone:   { background:"rgba(67,233,123,0.15)", border:"1.5px solid rgba(67,233,123,0.4)", color:"#43e97b" },
  errBox:     { background:"rgba(255,107,107,0.08)", border:"1px solid rgba(255,107,107,0.25)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#ff6b6b", display:"flex", alignItems:"center", gap:8, marginBottom:18 },
  errDot:     { width:6, height:6, borderRadius:"50%", background:"#ff6b6b", flexShrink:0 },
  form:       { display:"flex", flexDirection:"column", gap:16 },
  field:      { display:"flex", flexDirection:"column", gap:6 },
  label:      { fontSize:13, fontWeight:500, color:"#aaa" },
  input:      { width:"100%", padding:"11px 14px", background:"#0e0e16", border:"1px solid #1e1e2e", borderRadius:9, fontSize:14, color:"#e8e8f0", fontFamily:"inherit", outline:"none" },
  select:     { width:"100%", padding:"11px 14px", background:"#0e0e16", border:"1px solid #1e1e2e", borderRadius:9, fontSize:14, color:"#e8e8f0", fontFamily:"inherit", outline:"none", cursor:"pointer" },
  eye:        { position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#444", fontSize:12, cursor:"pointer", padding:4 },
  twoCol:     { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
  submit:     { width:"100%", padding:"12px", background:"#6c63ff", border:"none", borderRadius:9, fontSize:14, fontWeight:600, color:"#fff", cursor:"pointer", fontFamily:"inherit", minHeight:44, display:"flex", alignItems:"center", justifyContent:"center" },
  backBtn:    { padding:"12px 20px", background:"transparent", border:"1px solid #2a2a3e", borderRadius:9, fontSize:14, color:"#666", cursor:"pointer", fontFamily:"inherit", flexShrink:0 },
  spinner:    { width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin 0.7s linear infinite", display:"inline-block" },
  bottom:     { fontSize:13, color:"#444", textAlign:"center", marginTop:24 },
  link:       { color:"#6c63ff", textDecoration:"none", fontWeight:500 },
  back:       { marginTop:28, fontSize:13, color:"#333", cursor:"pointer", position:"relative", zIndex:1 },
};