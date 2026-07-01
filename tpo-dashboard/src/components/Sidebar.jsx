import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MdDashboard, MdPeople, MdUpload, MdBusiness,
  MdWork, MdDownload, MdBarChart, MdAdminPanelSettings,
  MdLogout, MdMenu, MdClose,
} from "react-icons/md";

const navItems = [
  { to: "/", icon: <MdDashboard size={19} />, label: "Dashboard" },
  { to: "/students", icon: <MdPeople size={19} />, label: "Students" },
  { to: "/import", icon: <MdUpload size={19} />, label: "Import Excel" },
  { to: "/companies", icon: <MdBusiness size={19} />, label: "Companies" },
  { to: "/drives", icon: <MdWork size={19} />, label: "Drives" },
  { to: "/export", icon: <MdDownload size={19} />, label: "Export" },
  { to: "/analytics", icon: <MdBarChart size={19} />, label: "Analytics" },
  { to: "/admins/create", icon: <MdAdminPanelSettings size={19} />, label: "Create TPO Admin" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed top-4 left-4 z-50 rounded-md bg-[#1E3A5F] p-2 text-white md:hidden">
        {open ? <MdClose size={22} /> : <MdMenu size={22} />}
      </button>

      <aside className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#1E3A5F] text-white flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="px-6 py-6 border-b border-blue-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">NIT Delhi</p>
          <h1 className="text-lg font-bold mt-1">Placement Portal</h1>
          <span className="inline-block mt-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold">TPO Admin</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-blue-600 text-white" : "text-blue-200 hover:bg-blue-800 hover:text-white"}`
              }>
              {item.icon}{item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-blue-800">
          <p className="text-sm font-medium truncate">{user?.email}</p>
          <p className="text-xs text-blue-300">Training & Placement Officer</p>
          <button onClick={logout} className="mt-3 flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-300 hover:bg-red-900/30 transition-colors">
            <MdLogout size={18} /> Logout
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}
    </>
  );
};

export default Sidebar;
