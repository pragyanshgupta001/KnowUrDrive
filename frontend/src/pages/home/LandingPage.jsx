import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  { icon: "◈", title: "Live drive posting", desc: "TPO posts a drive and all eligible students get notified instantly. No more WhatsApp forwards or missed deadlines." },
  { icon: "⬡", title: "Smart eligibility filter", desc: "Every drive shows your personal eligibility status. CGPA, branch, backlog — all checked automatically." },
  { icon: "◎", title: "Placement tier lock", desc: "Once placed, students are blocked from lower-CTC drives. Fair competition, cleaner placement data." },
  { icon: "⟡", title: "Application tracker", desc: "Track every application from Applied → Shortlisted → Interview → Offer in one place." },
  { icon: "◬", title: "AI placement chatbot", desc: "Ask anything in plain language — 'Which companies allow backlogs?' — instant answers from your college's own data." },
  { icon: "⬔", title: "TPO analytics", desc: "Placement percentage, avg CTC, top recruiters — everything a TPO needs for the annual report." },
];

const STEPS = [
  { role: "Admin", color: "#ffc107", bg: "rgba(255,193,7,0.1)", border: "rgba(255,193,7,0.25)", step: "Approves college on the platform and creates TPO account" },
  { role: "TPO", color: "#ff6b6b", bg: "rgba(255,107,107,0.1)", border: "rgba(255,107,107,0.25)", step: "Posts placement drives with eligibility criteria and JD" },
  { role: "Student", color: "#6c63ff", bg: "rgba(108,99,255,0.1)", border: "rgba(108,99,255,0.25)", step: "Views eligible drives and applies in one click" },
  { role: "TPO", color: "#ff6b6b", bg: "rgba(255,107,107,0.1)", border: "rgba(255,107,107,0.25)", step: "Reviews applicants and updates their status" },
  { role: "System", color: "#43e97b", bg: "rgba(67,233,123,0.1)", border: "rgba(67,233,123,0.25)", step: "Automatically locks placed students from lower-CTC drives" },
];

const STATS = [
  { value: "10+", label: "Colleges onboarded" },
  { value: "2,400+", label: "Students registered" },
  { value: "340+", label: "Drives posted" },
  { value: "68%", label: "Avg placement rate" },
];

const PREVIEW_DRIVES = [
  { co: "Google", role: "SWE Intern", ctc: "₹80k/mo", tag: "eligible", tc: "#43e97b" },
  { co: "Flipkart", role: "Backend Dev", ctc: "14 LPA", tag: "applied", tc: "#6c63ff" },
  { co: "Infosys", role: "Systems Eng", ctc: "6.5 LPA", tag: "locked", tc: "#ff6b6b" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={s.page}>

      {/* NAV */}
      <nav style={{ ...s.nav, ...(scrolled ? s.navScrolled : {}) }}>
        <div style={s.navInner}>
          <span style={s.logo} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Know<span style={s.logoAcc}>Ur</span>Drive
          </span>
          <div style={s.navLinks}>
            <span style={s.navLink} onClick={() => scrollTo("features")}>Features</span>
            <span style={s.navLink} onClick={() => scrollTo("how")}>How it works</span>
            <span style={s.navLink} onClick={() => scrollTo("colleges")}>Colleges</span>
          </div>
          <div style={s.navBtns}>
            <button style={s.btnNavGhost} onClick={() => navigate("/login")}>Log in</button>
            <button style={s.btnNavFill}  onClick={() => navigate("/register")}>Get started</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.heroSection}>
        <div style={s.glow1} /><div style={s.glow2} />
        <div style={s.heroInner}>
          <div style={s.heroLeft}>
            <div style={s.badge}>
              <span style={s.badgeDot} />
              Now live across multiple colleges
            </div>
            <h1 style={s.heroTitle}>
              Placement drives,<br />
              <span style={{ color: "#6c63ff" }}>done right.</span>
            </h1>
            <p style={s.heroBody}>
              A unified platform for TPO coordinators and students — post drives,
              track applications, and let smart rules handle eligibility. No more Excel sheets.
            </p>
            <div style={s.heroCTAs}>
              <button style={s.btnHero} onClick={() => navigate("/register")}>Register as student</button>
              <button style={s.btnHeroGhost} onClick={() => navigate("/college/request")}>Register your college →</button>
            </div>
          </div>

          {/* preview card */}
          <div style={s.previewCard}>
            <div style={s.previewHeader}>
              <div style={{ ...s.dot, background: "#ff5f57" }} />
              <div style={{ ...s.dot, background: "#febc2e" }} />
              <div style={{ ...s.dot, background: "#28c840" }} />
              <span style={s.previewLabel}>Active drives — ABES Eng.</span>
            </div>
            {PREVIEW_DRIVES.map((d, i) => (
              <div key={i} style={{ ...s.previewRow, ...(i === 2 ? { opacity: 0.4, borderBottom: "none" } : {}) }}>
                <div style={s.previewAvatar}>{d.co[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.previewCo}>{d.co}</div>
                  <div style={s.previewMeta}>{d.role} · {d.ctc}</div>
                </div>
                <span style={{ ...s.previewTag, color: d.tc, borderColor: d.tc + "50", background: d.tc + "15" }}>{d.tag}</span>
              </div>
            ))}
            <div style={s.previewFooter}>
              <span style={{ fontSize: 11, color: "#333" }}>4 more drives available</span>
              <button style={s.previewBtn} onClick={() => navigate("/login")}>View all</button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={s.statsBar}>
        {STATS.map((st, i) => (
          <div key={i} style={{ ...s.statItem, borderRight: i < 3 ? "1px solid #1a1a28" : "none" }}>
            <div style={s.statVal}>{st.value}</div>
            <div style={s.statLbl}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section id="features" style={s.section}>
        <div style={s.eyebrow}>What's inside</div>
        <h2 style={s.sectionTitle}>Everything placement needs</h2>
        <p style={s.sectionSub}>Built for the real flow — from drive posting to final offer letter.</p>
        <div style={s.featGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} style={s.featCard}>
              <div style={s.featIcon}>{f.icon}</div>
              <div style={s.featTitle}>{f.title}</div>
              <div style={s.featDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ ...s.section, ...s.sectionAlt }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
          <div style={s.eyebrow}>The flow</div>
          <h2 style={s.sectionTitle}>How it works</h2>
          <div style={s.stepsWrap}>
            {STEPS.map((st, i) => (
              <div key={i} style={s.stepRow}>
                <div style={s.stepLeft}>
                  <div style={s.stepNum}>{i + 1}</div>
                  {i < STEPS.length - 1 && <div style={s.stepLine} />}
                </div>
                <div style={s.stepRight}>
                  <span style={{ ...s.stepBadge, color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>{st.role}</span>
                  <p style={s.stepText}>{st.step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLEGES */}
      <section id="colleges" style={s.section}>
        <div style={s.eyebrow}>Multi-college</div>
        <h2 style={s.sectionTitle}>One platform, many colleges</h2>
        <p style={s.sectionSub}>Each college gets its own isolated workspace. Students only see their college's drives.</p>
        <div style={s.collegeRow}>
          {["Aligarh Muslim University", "Jamia Millia Islamia", "Ajay Kumar Garg Engineering College", "Chandigarh University"].map((c, i) => (
            <div key={i} style={s.collegeCard}>
              <div style={s.collegeAvatar}>{c[0]}</div>
              <span style={s.collegeName}>{c}</span>
            </div>
          ))}
          <div style={{ ...s.collegeCard, border: "1px dashed #2a2a3e", cursor: "pointer" }} onClick={() => navigate("/college/request")}>
            <div style={{ ...s.collegeAvatar, color: "#6c63ff", background: "rgba(108,99,255,0.1)" }}>+</div>
            <span style={{ ...s.collegeName, color: "#6c63ff" }}>Add your college →</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={s.ctaSection}>
        <div style={s.ctaGlow} />
        <h2 style={s.ctaTitle}>Ready to modernise your<br />placement cell?</h2>
        <p style={s.ctaSub}>Join in under 2 minutes. Free for students, always.</p>
        <div style={s.heroCTAs}>
          <button style={s.btnHero} onClick={() => navigate("/register")}>Create student account</button>
          <button style={s.btnHeroGhost} onClick={() => navigate("/login")}>TPO login →</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <span style={s.logo}>Know<span style={s.logoAcc}>Ur</span>Drive</span>
          <div style={s.footerLinks}>
            <span style={s.footerLink} onClick={() => scrollTo("features")}>Features</span>
            <span style={s.footerLink} onClick={() => scrollTo("how")}>How it works</span>
            <span style={s.footerLink} onClick={() => navigate("/college/request")}>Register college</span>
            <span style={s.footerLink} onClick={() => navigate("/login")}>Login</span>
          </div>
          <span style={s.footerCopy}>© 2025 KnowUrDrive. BTech minor project.</span>
        </div>
      </footer>
    </div>
  );
}

const s = {
  page:         { background: "#0a0a0f", color: "#e8e8f0", fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", minHeight: "100vh", overflowX: "hidden" },
  nav:          { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 40px", transition: "background 0.3s, border-color 0.3s", borderBottom: "1px solid transparent" },
  navScrolled:  { background: "rgba(10,10,15,0.9)", backdropFilter: "blur(14px)", borderBottom: "1px solid #1e1e2e" },
  navInner:     { maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", height: 64, gap: 40 },
  logo:         { fontFamily: "'Inter','DM Sans',sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", cursor: "pointer", letterSpacing: "-0.5px", flexShrink: 0 },
  logoAcc:      { color: "#6c63ff" },
  navLinks:     { display: "flex", gap: 28, flex: 1 },
  navLink:      { fontSize: 14, color: "#666", cursor: "pointer" },
  navBtns:      { display: "flex", gap: 10 },
  btnNavGhost:  { background: "transparent", border: "1px solid #2a2a3e", color: "#aaa", padding: "8px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  btnNavFill:   { background: "#6c63ff", border: "none", color: "#fff", padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  heroSection:  { minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 40px 60px", position: "relative", overflow: "hidden" },
  glow1:        { position: "absolute", top: 60, left: "5%", width: 600, height: 600, pointerEvents: "none", background: "radial-gradient(circle, rgba(108,99,255,0.13) 0%, transparent 70%)" },
  glow2:        { position: "absolute", bottom: 0, right: "5%", width: 500, height: 500, pointerEvents: "none", background: "radial-gradient(circle, rgba(255,107,107,0.07) 0%, transparent 70%)" },
  heroInner:    { maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: 64, position: "relative", zIndex: 1 },
  heroLeft:     { flex: 1, maxWidth: 520 },
  badge:        { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(67,233,123,0.08)", border: "1px solid rgba(67,233,123,0.2)", color: "#43e97b", fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 20, marginBottom: 28 },
  badgeDot:     { display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#43e97b", boxShadow: "0 0 8px #43e97b" },
  heroTitle:    { fontFamily: "'Inter','DM Sans',sans-serif", fontSize: 58, fontWeight: 800, lineHeight: 1.2, color: "#fff", letterSpacing: "-2px", margin: "0 0 20px" },
  heroBody:     { fontSize: 16, color: "#666", lineHeight: 1.75, margin: "0 0 36px" },
  heroCTAs:     { display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" },
  btnHero:      { background: "#6c63ff", border: "none", color: "#fff", padding: "13px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnHeroGhost: { background: "transparent", border: "1px solid #2a2a3e", color: "#999", padding: "13px 28px", borderRadius: 10, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  previewCard:  { flexShrink: 0, width: 340, background: "#111118", border: "1px solid #1e1e2e", borderRadius: 16, overflow: "hidden" },
  previewHeader:{ background: "#0e0e16", borderBottom: "1px solid #1a1a28", padding: "12px 16px", display: "flex", alignItems: "center", gap: 6 },
  dot:          { width: 10, height: 10, borderRadius: "50%" },
  previewLabel: { marginLeft: "auto", fontSize: 11, color: "#444" },
  previewRow:   { display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: "1px solid #15151f" },
  previewAvatar:{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: "#1a1a28", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#6c63ff" },
  previewCo:    { fontSize: 13, fontWeight: 600, color: "#e0e0f0", marginBottom: 2 },
  previewMeta:  { fontSize: 11, color: "#555" },
  previewTag:   { fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, border: "1px solid", flexShrink: 0 },
  previewFooter:{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  previewBtn:   { background: "#1a1a28", border: "1px solid #2a2a3e", color: "#888", fontSize: 11, padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" },
  statsBar:     { display: "flex", justifyContent: "center", borderTop: "1px solid #1a1a28", borderBottom: "1px solid #1a1a28", background: "#0d0d14" },
  statItem:     { flex: 1, maxWidth: 220, padding: "36px 24px", textAlign: "center" },
  statVal:      { fontFamily: "'Inter','DM Sans',sans-serif", fontSize: 38, fontWeight: 800, color: "#fff", letterSpacing: "-1.5px" },
  statLbl:      { fontSize: 13, color: "#555", marginTop: 4 },
  section:      { maxWidth: 1100, margin: "0 auto", padding: "90px 40px" },
  sectionAlt:   { maxWidth: "100%", background: "#0d0d14", borderTop: "1px solid #1a1a28", borderBottom: "1px solid #1a1a28", padding: "90px 0" },
  eyebrow:      { fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#6c63ff", marginBottom: 12 },
  sectionTitle: { fontFamily: "'Inter','DM Sans',sans-serif", fontSize: 38, fontWeight: 800, color: "#fff", letterSpacing: "-0.8px", margin: "0 0 16px", lineHeight: 1.25 },
  sectionSub:   { fontSize: 15, color: "#555", lineHeight: 1.7, maxWidth: 480, margin: "0 0 52px" },
  featGrid:     { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 },
  featCard:     { background: "#111118", border: "1px solid #1a1a28", borderRadius: 14, padding: "26px 22px" },
  featIcon:     { fontSize: 20, color: "#6c63ff", marginBottom: 14 },
  featTitle:    { fontFamily: "'Inter','DM Sans',sans-serif", fontSize: 15, fontWeight: 700, color: "#e8e8f0", marginBottom: 8 },
  featDesc:     { fontSize: 13, color: "#555", lineHeight: 1.75 },
  stepsWrap:    { maxWidth: 580, display: "flex", flexDirection: "column" },
  stepRow:      { display: "flex", gap: 0 },
  stepLeft:     { display: "flex", flexDirection: "column", alignItems: "center", width: 36, flexShrink: 0 },
  stepNum:      { width: 36, height: 36, borderRadius: "50%", background: "#1a1a28", border: "1.5px solid #2a2a3e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#6c63ff", flexShrink: 0, zIndex: 1 },
  stepLine:     { flex: 1, width: 1, background: "#1e1e2e", minHeight: 20 },
  stepRight:    { paddingLeft: 20, paddingBottom: 36 },
  stepBadge:    { display: "inline-block", fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 5, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  stepText:     { fontSize: 14, color: "#777", lineHeight: 1.65, margin: 0 },
  collegeRow:   { display: "flex", gap: 12, flexWrap: "wrap" },
  collegeCard:  { background: "#111118", border: "1px solid #1a1a28", borderRadius: 12, padding: "18px 22px", display: "flex", alignItems: "center", gap: 12 },
  collegeAvatar:{ width: 38, height: 38, borderRadius: 9, background: "#1a1a28", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: "#6c63ff", flexShrink: 0 },
  collegeName:  { fontSize: 14, fontWeight: 500, color: "#bbb" },
  ctaSection:   { padding: "90px 40px", textAlign: "center", borderTop: "1px solid #1a1a28", position: "relative", overflow: "hidden" },
  ctaGlow:      { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 400, pointerEvents: "none", background: "radial-gradient(ellipse, rgba(108,99,255,0.14) 0%, transparent 70%)" },
  ctaTitle:     { fontFamily: "'Inter','DM Sans',sans-serif", fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: "-1px", margin: "0 0 14px", lineHeight: 1.25, position: "relative" },
  ctaSub:       { fontSize: 15, color: "#555", margin: "0 0 36px", position: "relative" },
  footer:       { borderTop: "1px solid #1a1a28", padding: "28px 40px" },
  footerInner:  { maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" },
  footerLinks:  { display: "flex", gap: 24, flex: 1 },
  footerLink:   { fontSize: 13, color: "#444", cursor: "pointer" },
  footerCopy:   { fontSize: 12, color: "#333" },
};