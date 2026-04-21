import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaUsers, FaChartPie, FaCalendarCheck, FaMoneyBillWave } from 'react-icons/fa';


const HRAnalytics = () => {
  const [departmentStats, setDepartmentStats] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
      </div>
    );
  }

  const totalEmployees = getTotalEmployees();
  const totalSalary = getTotalSalary();
  const attendanceTotals = getAttendanceTotals();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

  {/* Header */}
  <div className="mb-8">
    <h1 className="text-3xl font-bold">Analytics & Reports</h1>
    <p className="text-gray-500">Insights and statistics</p>
  </div>

  {/* Overview */}
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

    {/* Card */}
    <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
      <div className="w-14 h-14 flex items-center justify-center text-white text-xl rounded-lg bg-blue-500">
        <FaUsers />
      </div>
      <div>
        <p className="text-sm text-gray-500">Employees</p>
        <h3 className="text-2xl font-bold">{totalEmployees}</h3>
      </div>
    </div>

    <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
      <div className="w-14 h-14 flex items-center justify-center text-white rounded-lg bg-green-500">
        <FaMoneyBillWave />
      </div>
      <div>
        <p className="text-sm text-gray-500">Payroll</p>
        <h3 className="text-2xl font-bold">
          ₹{totalSalary.toLocaleString()}
        </h3>
      </div>
    </div>

    <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow">
      <div className="w-14 h-14 flex items-center justify-center text-white rounded-lg bg-indigo-500">
        <FaCalendarCheck />
      </div>
      <div>
        <p className="text-sm text-gray-500">Attendance</p>
        <h3 className="text-2xl font-bold">
          {attendanceTotals.present}
        </h3>
      </div>
    </div>

    <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow">
      <div className="w-14 h-14 flex items-center justify-center text-white rounded-lg bg-pink-500">
        <FaChartPie />
      </div>
      <div>
        <p className="text-sm text-gray-500">Departments</p>
        <h3 className="text-2xl font-bold">{departmentStats.length}</h3>
      </div>
    </div>

  </div>

  {/* Charts */}
  <div className="grid lg:grid-cols-2 gap-6">

    {/* Department */}
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Department Distribution</h2>

      <div className="space-y-4">
        {departmentStats.map((dept) => {
          const percentage = (dept.count / totalEmployees) * 100;

          return (
            <div key={dept._id}>
              <div className="flex justify-between text-sm mb-1">
                <span>{dept._id}</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>

              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Salary */}
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Salary Breakdown</h2>

      <div className="space-y-4">
        {departmentStats.map((dept) => (
          <div key={dept._id} className="flex justify-between bg-gray-50 p-4 rounded-xl">
            <div>
              <h4 className="font-semibold">{dept._id}</h4>
              <p className="text-sm text-gray-500">
                {dept.count} employees
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold text-blue-600">
                ₹{dept.totalSalary.toLocaleString()}
              </p>
              <span className="text-xs text-gray-400">
                Avg ₹{Math.round(dept.totalSalary / dept.count)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
</div>
  );
};

export default HRAnalytics;
