import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  FaChevronDown
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isHR } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const hrLinks = [
    { path: '/hr/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/hr/employees', icon: FaUsers, label: 'Employees' },
    { path: '/hr/attendance', icon: FaCalendarCheck, label: 'Attendance' },
    { path: '/hr/analytics', icon: FaChartBar, label: 'Analytics' },
  ];

  const employeeLinks = [
    { path: '/employee/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/employee/profile', icon: FaUser, label: 'My Profile' },
    { path: '/employee/attendance', icon: FaCalendarCheck, label: 'My Attendance' },
  ];

  const links = isHR ? hrLinks : employeeLinks;

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-900 to-green-800 text-white shadow-lg z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex  gap-3">
              <FaLeaf className="text-2xl text-green-300" />
              <div className=" sm:block">
                <h1 className="text-xl font-bold text-white leading-tight">Kisan Group</h1>
                {/* <p className="text-xs text-green-200 -mt-1">EMS</p> */}
              </div>
              
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-4 py-2 rounded-lg text-green-100 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium
                    ${isActive ? 'bg-white/20 text-white' : ''}
                  `}
                >
                  <link.icon className="text-sm" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Right Section - User Profile */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-sm font-bold text-white">
                  {user?.employee?.name?.charAt(0) || user?.employeeId?.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium truncate max-w-[120px]">
                    {user?.employee?.name || 'User'}
                  </p>
                  <p className="text-xs text-green-200">{isHR ? 'HR/Admin' : 'Employee'}</p>
                </div>
                <FaChevronDown className={`text-xs transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-xl font-bold text-white">
                          {user?.employee?.name?.charAt(0) || user?.employeeId?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user?.employee?.name || 'User'}</p>
                          <p className="text-sm text-gray-500">{user?.employeeId}</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mt-1 ${
                            isHR ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {isHR ? 'HR/Admin' : 'Employee'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-green-800">
            <div className="px-2 py-3 space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg text-green-100 hover:bg-white/10 hover:text-white transition-all duration-200
                    ${isActive ? 'bg-white/20 text-white' : ''}
                  `}
                >
                  <link.icon />
                  <span>{link.label}</span>
                </NavLink>
              ))}
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;