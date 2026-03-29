import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, Grid2X2, CalendarCheck2, LogOut } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { useAppContext } from "../context/AppContext";

export default function Layout() {
  const { auth, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-head">
          <BrandLogo />
        </div>

        <nav className="sidebar-nav">
          <NavItem to="/" end icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem to="/branches" icon={<Building2 size={18} />} label="Filiallar" />
          <NavItem to="/zones-tables" icon={<Grid2X2 size={18} />} label="Zonalar va stollar" />
          <NavItem to="/bookings" icon={<CalendarCheck2 size={18} />} label="Bookinglar" />
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{(auth?.user?.username || "A").slice(0, 1).toUpperCase()}</div>
            <div>
              <div className="sidebar-user-name">{auth?.user?.username || "admin"}</div>
              <div className="sidebar-user-role">partner account</div>
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, end = false, icon, label }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
