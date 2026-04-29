import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { 
  FaUsers, 
  FaChartPie, 
  FaCalendarCheck, 
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaBuilding,
  FaUserTie,
  FaPercent,
  FaRupeeSign,
  FaTrophy,
  FaChartBar,
  FaBriefcase,
  FaUserClock,
  FaWallet
} from 'react-icons/fa';

const HRAnalytics = () => {
  const [departmentStats, setDepartmentStats] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [deptRes, attRes] = await Promise.all([
        api.get('/employees/stats/department'),
        api.get('/attendance/stats/overview')
      ]);

      setDepartmentStats(deptRes.data);
      setAttendanceStats(attRes.data);
    } catch (error) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const getTotalEmployees = () => {
    return departmentStats.reduce((sum, dept) => sum + dept.count, 0);
  };

  const getTotalSalary = () => {
    return departmentStats.reduce((sum, dept) => sum + dept.totalSalary, 0);
  };

  const getAttendanceTotals = () => {
    if (!attendanceStats?.statusStats) return { present: 0, absent: 0, leave: 0 };
    
    const totals = { present: 0, absent: 0, leave: 0 };
    attendanceStats.statusStats.forEach(stat => {
      if (stat._id === 'Present') totals.present = stat.count;
      else if (stat._id === 'Absent') totals.absent = stat.count;
      else if (stat._id === 'Leave') totals.leave = stat.count;
    });
    return totals;
  };

  const getTopDepartment = () => {
    if (departmentStats.length === 0) return null;
    return departmentStats.reduce((max, dept) => dept.totalSalary > max.totalSalary ? dept : max, departmentStats[0]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const totalEmployees = getTotalEmployees();
  const totalSalary = getTotalSalary();
  const attendanceTotals = getAttendanceTotals();
  const topDepartment = getTopDepartment();

  const attendanceRate = totalEmployees > 0 
    ? ((attendanceTotals.present / totalEmployees) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-500 mt-1">HR insights and performance metrics</p>
            </div>
            
            <div className="flex gap-2 bg-white rounded-lg border border-gray-200 p-1">
              {['week', 'month', 'quarter', 'year'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedPeriod === period
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total Employees */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaUsers className="text-blue-600 text-lg" />
              </div>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <FaArrowUp size={11} /> +12%
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
            <p className="text-xs text-gray-400 mt-2">vs previous month</p>
          </div>

          {/* Total Payroll */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <FaMoneyBillWave className="text-emerald-600 text-lg" />
              </div>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <FaArrowUp size={11} /> +8%
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Monthly Payroll</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{totalSalary.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-2">Total compensation</p>
          </div>

          {/* Attendance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <FaCalendarCheck className="text-purple-600 text-lg" />
              </div>
              <span className={`${attendanceRate >= 85 ? 'text-green-600' : 'text-orange-600'} text-sm font-medium flex items-center gap-1`}>
                {attendanceRate >= 85 ? <FaArrowUp size={11} /> : <FaArrowDown size={11} />}
                {attendanceRate}%
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Present Today</p>
            <p className="text-2xl font-bold text-gray-900">{attendanceTotals.present}</p>
            <div className="flex gap-3 text-xs text-gray-400 mt-2">
              <span>Leave: {attendanceTotals.leave}</span>
              <span>Absent: {attendanceTotals.absent}</span>
            </div>
          </div>

          {/* Departments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <FaChartPie className="text-orange-600 text-lg" />
              </div>
              <span className="text-gray-500 text-sm font-medium">Active</span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Departments</p>
            <p className="text-2xl font-bold text-gray-900">{departmentStats.length}</p>
            <p className="text-xs text-gray-400 mt-2">Across organization</p>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Average Salary</p>
                <p className="text-xl font-bold text-gray-900">
                  ₹{(totalSalary / totalEmployees).toLocaleString()}
                </p>
              </div>
              <FaWallet className="text-gray-400 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Attendance Rate</p>
                <p className="text-xl font-bold text-gray-900">{attendanceRate}%</p>
              </div>
              <FaUserClock className="text-gray-400 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Top Department</p>
                <p className="text-xl font-bold text-gray-900">
                  {topDepartment?._id || 'N/A'}
                </p>
              </div>
              <FaTrophy className="text-yellow-500 text-2xl" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Department Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaBuilding className="text-gray-500" />
                Department Distribution
              </h2>
            </div>
            
            <div className="p-6 space-y-5">
              {departmentStats.map((dept, index) => {
                const percentage = (dept.count / totalEmployees) * 100;
                const barColors = [
                  'bg-blue-600',
                  'bg-emerald-600',
                  'bg-purple-600',
                  'bg-orange-600',
                  'bg-rose-600',
                  'bg-indigo-600'
                ];
                
                return (
                  <div key={dept._id}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">{dept._id}</span>
                        <span className="text-xs text-gray-400">({dept.count})</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{percentage.toFixed(1)}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${barColors[index % barColors.length]} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaBriefcase className="text-gray-500" />
                Salary Breakdown
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              {departmentStats.map((dept) => {
                const percentage = (dept.totalSalary / totalSalary) * 100;
                const avgSalary = dept.totalSalary / dept.count;
                
                return (
                  <div key={dept._id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{dept._id}</h4>
                        <p className="text-sm text-gray-500">{dept.count} employees</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{dept.totalSalary.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          Avg: ₹{Math.round(avgSalary).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{percentage.toFixed(1)}% of total</p>
                  </div>
                );
              })}
              
              {/* Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Monthly Payroll</p>
                    <p className="text-xl font-bold text-gray-900">₹{totalSalary.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Average per Employee</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      ₹{Math.round(totalSalary / totalEmployees).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="text-gray-500 text-lg" />
            <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Highest Paying</p>
              <p className="text-base font-semibold text-gray-900">
                {departmentStats.reduce((highest, dept) => 
                  (dept.totalSalary / dept.count) > (highest.totalSalary / highest.count) ? dept : highest, departmentStats[0])?._id || 'N/A'}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Largest Team</p>
              <p className="text-base font-semibold text-gray-900">
                {departmentStats.reduce((largest, dept) => 
                  dept.count > largest.count ? dept : largest, departmentStats[0])?._id || 'N/A'}
                <span className="text-sm text-gray-400 ml-2">
                  ({Math.max(...departmentStats.map(d => d.count), 0)})
                </span>
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Salary Distribution</p>
              <p className="text-base font-semibold text-gray-900">
                ₹{((totalSalary / totalEmployees) / 1000).toFixed(0)}K
                <span className="text-sm text-gray-400 ml-2">average per employee</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRAnalytics;