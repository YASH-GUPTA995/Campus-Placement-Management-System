import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MdDashboard, MdBusiness, MdAssignment, MdPerson, MdNotifications, MdLogout, MdMenu, MdClose } from "react-icons/md";

const navItems = [
  { to: "/", icon: <MdDashboard size={20} />, label: "Dashboard" },
  { to: "/drives", icon: <MdBusiness size={20} />, label: "Drives" },
  { to: "/applications", icon: <MdAssignment size={20} />, label: "Applications" },
  { to: "/profile", icon: <MdPerson size={20} />, label: "Profile" },
  { to: "/notifications", icon: <MdNotifications size={20} />, label: "Notifications" },
];

const Sidebar = () => {
  const { user, profile, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button onClick={() => setOpen(!open)} className="fixed top-4 left-4 z-50 rounded-md bg-[#1E3A5F] p-2 text-white md:hidden">
        {open ? <MdClose size={22} /> : <MdMenu size={22} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#1E3A5F] text-white flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-blue-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">NIT Delhi</p>
          <h1 className="text-lg font-bold mt-1">Placement Portal</h1>
          <p className="text-xs text-blue-300 mt-1">Student</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "text-blue-200 hover:bg-blue-800 hover:text-white"
                }`
              }>
              {item.icon}{item.label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-4 border-t border-blue-800">
          <p className="text-sm font-medium truncate">{profile?.fullName || user?.email}</p>
          <p className="text-xs text-blue-300 truncate">{profile?.rollNumber} · {profile?.branch}</p>
          <button onClick={logout} className="mt-3 flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-colors">
            <MdLogout size={18} /> Logout
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}
    </>
  );
};

export default Sidebar;
