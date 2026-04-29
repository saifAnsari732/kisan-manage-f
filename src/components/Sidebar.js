import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
FaLeaf,
FaTachometerAlt,
FaUsers,
FaCalendarCheck,
FaUser,
FaSignOutAlt,
FaChartBar,
FaBars,
FaTimes,
FaChevronDown,
FaFileAlt,
} from "react-icons/fa";

const Navbar = () => {
const { user, logout, isHR } = useAuth();
const navigate = useNavigate();
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const handleLogout = () => {
logout();
navigate("/login");
};

const hrLinks = [
{ path: "/hr/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
{ path: "/hr/employees", icon: FaUsers, label: "Employees" },
{ path: "/hr/attendance", icon: FaCalendarCheck, label: "Attendance" },
{ path: "/hr/analytics", icon: FaChartBar, label: "Analytics" },
{ path: "/documents", icon: FaFileAlt, label: "Documents" },
];

const employeeLinks = [
{ path: "/employee/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
{ path: "/employee/profile", icon: FaUser, label: "Profile" },
{ path: "/employee/attendance", icon: FaCalendarCheck, label: "Attendance" },
{ path: "/documents", icon: FaFileAlt, label: "Documents" },
];

const links = isHR ? hrLinks : employeeLinks;

return (
<>
{/* NAVBAR */} <nav className="fixed top-0 left-0 right-0 bg-green-800 text-white z-50 shadow-md"> <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">

      {/* LOGO */}
      <div className="flex items-center gap-2">
        <FaLeaf />
        <span className="font-semibold text-lg">Kisan Group</span>
      </div>

      {/* DESKTOP LINKS */}
      <div className="hidden md:flex items-center gap-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition
              ${isActive ? "bg-green-700" : "hover:bg-green-700"}`
            }
          >
            <link.icon />
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">

        {/* PROFILE */}
        <div className="hidden md:flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold">
            {user?.employee?.name?.charAt(0) || "U"}
          </div>
          <span className="text-sm">
            {user?.employee?.name || "User"}
          </span>
        </div>

        {/* LOGOUT (DESKTOP) */}
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
        >
          <FaSignOutAlt />
          Logout
        </button>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <FaBars size={20} />
        </button>

      </div>
    </div>
  </nav>

  {/* MOBILE MENU */}
  {isMobileMenuOpen && (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div className="absolute left-0 top-0 h-full w-64 bg-green-900 p-4 text-white">

        <div className="flex justify-between items-center mb-6">
          <span className="font-bold">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-green-700"
            >
              <link.icon />
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-2 text-red-300"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  )}

  <div className="h-14" />
</>

);
};

export default Navbar;
