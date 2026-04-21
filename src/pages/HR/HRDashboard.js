import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { 
  FaUsers, 
  FaUserTie, 
  FaCode, 
  FaPaintBrush, 
  FaEdit, 
  FaBullhorn,
  FaChartLine,
  FaCalendarCheck,
  FaSearch,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';

const HRDashboard = () => {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [employeesRes, statsRes] = await Promise.all([
        api.get('/employees'),
        api.get('/employees/stats/department')
      ]);

      const totalEmployees = employeesRes.data.length;
      const departmentStats = statsRes.data;

      setEmployees(employeesRes.data);
      setStats({
        totalEmployees,
        departmentStats
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const departmentIcons = {
    'Sales': FaBullhorn,
    'Marketing': FaChartLine,
    'Developer': FaCode,
    'Graphic Designer': FaPaintBrush,
    'Editor': FaEdit
  };

  const departmentColors = {
    'Sales': 'from-blue-500 to-blue-700',
    'Marketing': 'from-purple-500 to-purple-700',
    'Developer': 'from-green-500 to-green-700',
    'Graphic Designer': 'from-pink-500 to-pink-700',
    'Editor': 'from-orange-500 to-orange-700'
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          HR Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your team and track performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-7">
        
        {/* Total Employees Card */}
        <div className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="w-14 h-14 flex items-center justify-center rounded-xl text-white text-xl bg-gradient-to-br from-blue-500 to-blue-700 flex-shrink-0">
            <FaUsers />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
              Total Employees
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {stats?.totalEmployees || 0}
            </p>
            <span className="text-xs text-gray-400">
              Active members
            </span>
          </div>
        </div>

        {/* Departments Card */}
        <div className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="w-14 h-14 flex items-center justify-center rounded-xl text-white text-xl bg-gradient-to-br from-purple-500 to-purple-700 flex-shrink-0">
            <FaUserTie />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
              Departments
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {stats?.departmentStats?.length || 0}
            </p>
            <span className="text-xs text-gray-400">
              Active departments
            </span>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="w-14 h-14 flex items-center justify-center rounded-xl text-white text-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex-shrink-0">
            <FaCalendarCheck />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
              Quick Actions
            </h3>
            <p className="text-3xl font-bold text-gray-800">3</p>
            <span className="text-xs text-gray-400">
              Available tools
            </span>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid lg:grid-cols-3 gap-5">
        
        {/* Department Breakdown */}
        <div className="lg:col-span-1 bg-white rounded-xl p-5 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Department Breakdown</h2>
          
          <div className="space-y-3">
            {stats?.departmentStats?.map((dept, index) => {
              const Icon = departmentIcons[dept._id] || FaUsers;
              const colorClass = departmentColors[dept._id] || 'from-gray-500 to-gray-700';
              
              return (
                <div
                  key={dept._id}
                  className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg text-white text-base bg-gradient-to-br ${colorClass} flex-shrink-0`}>
                      <Icon />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{dept._id}</h3>
                      <p className="text-sm text-gray-500">
                        {dept.count} employees
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-blue-600">
                    {dept.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Employees List Section */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold">All Employees</h2>
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Employees List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <div
                  key={emp._id}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/hr/employees/${emp._id}`)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {emp.name?.charAt(0) || emp.employeeId?.charAt(0)}
                    </div>
                    
                    {/* Employee Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">{emp.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-xs text-gray-500 font-mono">{emp.employeeId}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{emp.department || 'N/A'}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{emp.designation || 'N/A'}</span>
                          </div>
                        </div>
                        
                        {/* Contact Icons */}
                        <div className="flex gap-2">
                          {emp.email && (
                            <a href={`mailto:${emp.email}`} className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                              <FaEnvelope className="text-sm" />
                            </a>
                          )}
                          {emp.phone && (
                            <a href={`tel:${emp.phone}`} className="p-2 text-gray-500 hover:text-green-600 transition-colors">
                              <FaPhone className="text-sm" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No employees found
              </div>
            )}
          </div>

          {/* Employee Count */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {filteredEmployees.length} of {employees.length} employees
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel - Moved to bottom on mobile */}
      <div className="mt-5">
        <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-5 shadow-lg">
          <h2 className="text-white text-lg font-semibold mb-4">
            Quick Actions
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/hr/employees')}
              className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:scale-105 transition-all duration-200 shadow-md flex-1"
            >
              <FaUsers className="text-base" />
              <span>Manage Employees</span>
            </button>

            <button
              onClick={() => navigate('/hr/attendance')}
              className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 shadow-md flex-1"
            >
              <FaCalendarCheck className="text-base" />
              <span>Attendance</span>
            </button>

            <button
              onClick={() => navigate('/hr/analytics')}
              className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 hover:scale-105 transition-all duration-200 shadow-md flex-1"
            >
              <FaChartLine className="text-base" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;