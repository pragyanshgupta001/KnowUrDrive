// Shared style tokens used across all dashboard pages
// Import: import { sh } from "../../styles/shared";

export const sh = {
  pageTitle:  { fontFamily: "'inter','DM Sans',sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.35, marginBottom: 0 },
  pageSub:    { fontSize: 14, color: "#555", marginTop: 4, marginBottom: 0 },
  header:     { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 },
  panel:      { background: "#111118", border: "1px solid #1a1a28", borderRadius: 14, padding: "20px 22px" },
  panelTitle: { fontSize: 14, fontWeight: 600, color: "#ccc", marginBottom: 16 },
  statGrid4:  { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 },
  statGrid3:  { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 },
  statCard:   { background: "#111118", border: "1px solid #1a1a28", borderRadius: 12, padding: "18px 20px" },
  statLabel:  { fontSize: 12, color: "#555", marginBottom: 8 },
  statValue:  { fontFamily: "'inter','DM Sans',sans-serif", fontSize: 28, fontWeight: 800, lineHeight: 1 },
  field:      { display: "flex", flexDirection: "column", gap: 7 },
  label:      { fontSize: 13, fontWeight: 500, color: "#aaa" },
  input:      { width: "100%", padding: "11px 14px", background: "#0e0e16", border: "1px solid #1e1e2e", borderRadius: 9, fontSize: 14, color: "#e8e8f0", fontFamily: "inherit", outline: "none" },
  select:     { width: "100%", padding: "11px 14px", background: "#0e0e16", border: "1px solid #1e1e2e", borderRadius: 9, fontSize: 14, color: "#e8e8f0", fontFamily: "inherit", outline: "none", cursor: "pointer" },
  textarea:   { width: "100%", padding: "11px 14px", background: "#0e0e16", border: "1px solid #1e1e2e", borderRadius: 9, fontSize: 14, color: "#e8e8f0", fontFamily: "inherit", outline: "none", resize: "vertical", minHeight: 90 },
  twoCol:     { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  threeCol:   { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  primaryBtn: { padding: "10px 22px", background: "#6c63ff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" },
  ghostBtn:   { padding: "10px 18px", background: "transparent", border: "1px solid #2a2a3e", borderRadius: 9, fontSize: 13, color: "#666", cursor: "pointer", fontFamily: "inherit" },
  backBtn:    { background: "transparent", border: "1px solid #1e1e2e", color: "#555", padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginBottom: 20 },
  loader:     { color: "#555", padding: "60px", textAlign: "center", fontSize: 14 },
  empty:      { color: "#333", textAlign: "center", padding: "40px", fontSize: 14 },
  successToast: { background: "rgba(67,233,123,0.1)", border: "1px solid rgba(67,233,123,0.25)", color: "#43e97b", fontSize: 13, padding: "10px 16px", borderRadius: 8, marginBottom: 16 },
  errorToast:   { background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", color: "#ff6b6b", fontSize: 13, padding: "10px 16px", borderRadius: 8, marginBottom: 16 },
  tableWrap:  { overflowX: "auto" },
  table:      { width: "100%", borderCollapse: "collapse" },
  th:         { fontSize: 11, color: "#444", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, padding: "10px 14px", textAlign: "left", borderBottom: "1px solid #1a1a28" },
  td:         { fontSize: 13, color: "#888", padding: "12px 14px", borderBottom: "1px solid #111" },
};

export const STATUS_COLOR = { APPLIED: "#6c63ff", SHORTLISTED: "#ffc107", INTERVIEW: "#43e97b", SELECTED: "#43e97b", REJECTED: "#ff6b6b" };
export const STATUS_BG    = { APPLIED: "rgba(108,99,255,0.12)", SHORTLISTED: "rgba(255,193,7,0.12)", INTERVIEW: "rgba(67,233,123,0.12)", SELECTED: "rgba(67,233,123,0.12)", REJECTED: "rgba(255,107,107,0.12)" };