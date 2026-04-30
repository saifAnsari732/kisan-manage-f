import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
  FaFileAlt,
  FaBell,
  FaUserCircle,
  FaCaretDown,
  FaMoon,
  FaSun,
  FaBuilding,
  FaClipboardList,
  FaIdCard
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout, isHR } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const hrLinks = [
    { path: "/hr/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    { path: "/hr/employees", icon: FaUsers, label: "Employees" },
    { path: "/hr/attendance", icon: FaCalendarCheck, label: "Attendance" },
    { path: "/hr/analytics", icon: FaChartBar, label: "Analytics" },
    { path: "/hr/reports", icon: FaClipboardList, label: "Reports" },
    { path: "/documents", icon: FaFileAlt, label: "Documents" },
  ];

  const employeeLinks = [
    { path: "/employee/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    { path: "/employee/profile", icon: FaUser, label: "Profile" },
    { path: "/employee/attendance", icon: FaCalendarCheck, label: "Attendance" },
    { path: "/documents", icon: FaFileAlt, label: "Documents" },
  ];

  const links = isHR ? hrLinks : employeeLinks;

  // Get user initials
  const getUserInitials = () => {
    const name = user?.employee?.name || user?.name || "User";
    return name.charAt(0).toUpperCase();
  };

  const getUserName = () => {
    return user?.employee?.name || user?.name || "User";
  };

  const getUserRole = () => {
    return isHR ? "HR Administrator" : "Employee";
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white shadow-lg backdrop-blur-md bg-opacity-95 text-black" 
          : "bg-gradient-to-r from-green-700 to-teal-900"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                scrolled ? "bg-blue-600" : "bg-white/20 backdrop-blur-sm"
              }`}>
                <FaBuilding className={`text-xl ${scrolled ? "text-white" : "text-white"}`} />
              </div>
              <div>
                <h1 className={`font-bold text-lg transition-colors duration-300 ${
                  scrolled ? "text-gray-800" : "text-white"
                }`}>
                  Kisan Group
                </h1>
                <p className={`text-xs transition-colors duration-300 ${
                  scrolled ? "text-gray-500" : "text-blue-100"
                }`}>
                  HR Management System
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? scrolled
                          ? "bg-blue-50 text-blue-700"
                          : "bg-white/20 text-white"
                        : scrolled
                        ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </NavLink>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              
        

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    scrolled 
                      ? "hover:bg-gray-100" 
                      : "hover:bg-white/10"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    scrolled 
                      ? "bg-blue-600 text-white" 
                      : "bg-white/20 backdrop-blur-sm text-white"
                  }`}>
                    {getUserInitials()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className={`text-sm font-medium ${
                      scrolled ? "text-gray-800" : "text-white"
                    }`}>
                      {getUserName()}
                    </p>
                    <p className={`text-xs ${
                      scrolled ? "text-gray-500" : "text-blue-100"
                    }`}>
                      {getUserRole()}
                    </p>
                  </div>
                  <FaCaretDown className={`text-xs transition-transform duration-200 ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  } ${scrolled ? "text-gray-500" : "text-white"}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{getUserName()}</p>
                        <p className="text-xs text-gray-500 mt-1">{getUserRole()}</p>
                        <p className="text-xs text-gray-400 mt-1 font-mono">
                          ID: {user?.employee?.employeeId || "N/A"}
                        </p>
                      </div>
                      
                      <div className="py-2">
                        <NavLink
                          to={isHR ? "/hr/profile" : "/employee/profile"}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FaUserCircle size={16} />
                          My Profile
                        </NavLink>
                       
                      </div>
                      
                      <div className="border-t border-gray-100 pt-2 pb-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FaSignOutAlt size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                  scrolled 
                    ? "text-gray-600 hover:bg-gray-100" 
                    : "text-white hover:bg-white/10"
                }`}
              >
                <FaBars size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 animate-slideInRight lg:hidden">
            {/* Mobile Menu Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FaBuilding className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Kisan Group</h2>
                    <p className="text-blue-100 text-xs">HRMS</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              
              {/* User Profile Section */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                  <span className="text-2xl font-bold text-white">
                    {getUserInitials()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">{getUserName()}</p>
                  <p className="text-blue-100 text-sm">{getUserRole()}</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="py-4 px-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
                Main Menu
              </p>
              <div className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                    >
                      <Icon size={18} />
                      <span className="font-medium">{link.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <FaSignOutAlt size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Spacer to prevent content hide under navbar */}
      <div className="h-16"></div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;