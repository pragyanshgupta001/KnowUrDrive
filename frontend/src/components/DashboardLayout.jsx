import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const NAV = {
  STUDENT: [
    { label: "Dashboard",    path: "/student/dashboard" },
    { label: "Drives",       path: "/student/drives" },
    { label: "Applications", path: "/student/applications" },
    { label: "Notices",      path: "/student/notices" },
    { label: "Profile",      path: "/student/profile" },
  ],
  TPO: [
    { label: "Dashboard",  path: "/tpo/dashboard" },
    { label: "Drives",     path: "/tpo/drives" },
    { label: "Students",   path: "/tpo/students" },
    { label: "Notices",    path: "/tpo/notices" },
    { label: "Analytics",  path: "/tpo/analytics" },
  ],
  ADMIN: [
    { label: "Dashboard",   path: "/admin/dashboard" },
    { label: "Colleges",    path: "/admin/colleges" },
    { label: "Create TPO",  path: "/admin/tpo/new" },
  ],
};

const ROLE_COLOR = { STUDENT: "#6c63ff", TPO: "#ff6b6b", ADMIN: "#ffc107" };

export default function DashboardLayout({ children }) {
  const navigate            = useNavigate();
  const location            = useLocation();
  const { user, logout }    = useAuthStore();
  const roleColor           = ROLE_COLOR[user?.role] || "#6c63ff";
  const navItems            = NAV[user?.role] || [];

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={s.root}>

      {/* ── SIDEBAR ── */}
      <aside style={s.sidebar}>
        <div style={s.logo} onClick={() => navigate("/")}>
          Know<span style={{ color: "#6c63ff" }}>Ur</span>Drive
        </div>

        <div style={{ ...s.roleBadge, color: roleColor, borderColor: roleColor + "40", background: roleColor + "14" }}>
          {user?.role}
        </div>

        <nav style={s.nav}>
          {navItems.map((item) => {
            const active = location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path) && item.label !== "Dashboard");
            return (
              <div key={item.path}
                style={{ ...s.navItem, ...(active ? { color: roleColor, background: roleColor + "12", borderLeftColor: roleColor } : {}) }}
                onClick={() => navigate(item.path)}>
                {item.label}
              </div>
            );
          })}
        </nav>

        <div style={s.bottom}>
          <div style={s.userCard}>
            <div style={{ ...s.avatar, background: roleColor + "20", color: roleColor }}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={s.userInfo}>
              <div style={s.userName}>{user?.name}</div>
              <div style={s.userEmail}>{user?.email}</div>
            </div>
          </div>
          <button style={s.logoutBtn} onClick={handleLogout}>Log out</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={s.main}>{children}</main>
    </div>
  );
}

const s = {
  root:     { display: "flex", minHeight: "100vh", background: "#0a0a0f", color: "#e8e8f0", fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" },
  sidebar:  { width: 220, flexShrink: 0, background: "#0d0d14", borderRight: "1px solid #1a1a28", display: "flex", flexDirection: "column", padding: "24px 16px", position: "sticky", top: 0, height: "100vh", overflowY: "auto" },
  logo:     { fontFamily: "'inter','DM Sans',sans-serif", fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: 20, cursor: "pointer" },
  roleBadge:{ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 5, border: "1px solid", textTransform: "uppercase", letterSpacing: 1, marginBottom: 28, width: "fit-content" },
  nav:      { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
  navItem:  { padding: "9px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "#555", cursor: "pointer", borderLeft: "2px solid transparent", transition: "all 0.15s" },
  bottom:   { marginTop: "auto", paddingTop: 16, borderTop: "1px solid #1a1a28" },
  userCard: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  avatar:   { width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 },
  userInfo: { overflow: "hidden", flex: 1 },
  userName: { fontSize: 12, fontWeight: 600, color: "#ccc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  userEmail:{ fontSize: 11, color: "#444", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  logoutBtn:{ width: "100%", padding: "8px", background: "transparent", border: "1px solid #1e1e2e", borderRadius: 8, fontSize: 12, color: "#444", cursor: "pointer", fontFamily: "inherit" },
  main:     { flex: 1, overflowY: "auto", padding: "32px 36px" },
};