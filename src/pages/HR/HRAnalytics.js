import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaChartPie,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaBuilding,
  FaTrophy,
  FaChartBar,
  FaBriefcase,
  FaUserClock,
  FaWallet,
  FaBolt,
  FaLayerGroup,
} from "react-icons/fa";

const HRAnalytics = () => {
  const [departmentStats, setDepartmentStats] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [deptRes, attRes] = await Promise.all([
        api.get("/employees/stats/department"),
        api.get("/attendance/stats/overview"),
      ]);

      setDepartmentStats(deptRes.data);
      setAttendanceStats(attRes.data);
    } catch (error) {
      toast.error("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const getTotalEmployees = () => {
    return departmentStats.reduce((sum, dept) => sum + dept.count, 0);
  };

  const getTotalSalary = () => {
    return departmentStats.reduce(
      (sum, dept) => sum + dept.totalSalary,
      0
    );
  };

  const getAttendanceTotals = () => {
    if (!attendanceStats?.statusStats)
      return { present: 0, absent: 0, leave: 0 };

    const totals = { present: 0, absent: 0, leave: 0 };

    attendanceStats.statusStats.forEach((stat) => {
      if (stat._id === "Present") totals.present = stat.count;
      else if (stat._id === "Absent") totals.absent = stat.count;
      else if (stat._id === "Leave") totals.leave = stat.count;
    });

    return totals;
  };

  const getTopDepartment = () => {
    if (departmentStats.length === 0) return null;

    return departmentStats.reduce((max, dept) =>
      dept.totalSalary > max.totalSalary ? dept : max
    );
  };

if (loading) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900  to-slate-900">
      <div className="text-center">
        {/* Animated rings */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-cyan-400 border-r-purple-400 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-t-transparent border-r-transparent border-b-pink-400 border-l-cyan-400 rounded-full animate-spin-slow"></div>
        </div>
        
        {/* Text with pulse effect */}
        <div className="mt-6 space-y-2">
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            Loading Analytics
          </h2>
          <div className="flex items-center justify-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce delay-100"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

  const totalEmployees = getTotalEmployees();
  const totalSalary = getTotalSalary();
  const attendanceTotals = getAttendanceTotals();
  const topDepartment = getTopDepartment();

  const attendanceRate =
    totalEmployees > 0
      ? (
          (attendanceTotals.present / totalEmployees) *
          100
        ).toFixed(1)
      : 0;

  const highestPayingDept =
    departmentStats.length > 0
      ? departmentStats.reduce((highest, dept) =>
          dept.totalSalary / dept.count >
          highest.totalSalary / highest.count
            ? dept
            : highest
        )
      : null;

  const largestTeam =
    departmentStats.length > 0
      ? departmentStats.reduce((largest, dept) =>
          dept.count > largest.count ? dept : largest
        )
      : null;

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gradient-to-br from-slate-900  to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 blur-[100px] rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-pink-500/10 blur-[100px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative w-full min-h-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8">
        {/* Header Section */}
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-8">
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-4 shadow-lg">
                <FaBolt className="text-yellow-400" />
                <span>Smart HR Dashboard</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent">
                HR Analytics
              </h1>
              <p className="text-white/60 mt-3 text-sm md:text-base max-w-2xl">
                Employee insights, payroll analytics & attendance monitoring
              </p>
            </div>

            {/* Period Selector */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 flex flex-wrap gap-1 shadow-2xl">
              {["week", "month", "quarter", "year"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    selectedPeriod === period
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Employees Card */}
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/60 text-sm">Total Employees</p>
                    <h2 className="text-4xl font-black text-white mt-2">{totalEmployees}</h2>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 flex items-center justify-center border border-cyan-500/30">
                    <FaUsers className="text-cyan-300 text-2xl" />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <FaArrowUp className="text-xs" />
                  <span>12% Growth this month</span>
                </div>
              </div>
            </div>

            {/* Payroll Card */}
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/60 text-sm">Monthly Payroll</p>
                    <h2 className="text-3xl font-black text-white mt-2">₹{totalSalary.toLocaleString()}</h2>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center border border-emerald-500/30">
                    <FaMoneyBillWave className="text-emerald-300 text-2xl" />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <FaArrowUp className="text-xs" />
                  <span>8% Increase from last month</span>
                </div>
              </div>
            </div>

            {/* Attendance Card */}
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/60 text-sm">Attendance Rate</p>
                    <h2 className="text-4xl font-black text-white mt-2">{attendanceRate}%</h2>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border border-purple-500/30">
                    <FaCalendarCheck className="text-purple-300 text-2xl" />
                  </div>
                </div>
                <div className={`mt-6 flex items-center gap-2 text-sm font-medium ${attendanceRate >= 85 ? "text-emerald-400" : "text-orange-400"}`}>
                  {attendanceRate >= 85 ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                  <span>Daily Performance</span>
                </div>
              </div>
            </div>

            {/* Departments Card */}
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/60 text-sm">Departments</p>
                    <h2 className="text-4xl font-black text-white mt-2">{departmentStats.length}</h2>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center border border-orange-500/30">
                    <FaChartPie className="text-orange-300 text-2xl" />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-orange-300 text-sm font-medium">
                  <FaLayerGroup />
                  <span>Active Teams</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/60 text-sm">Average Salary</p>
                  <h3 className="text-2xl font-bold text-white mt-2">
                    ₹{Math.round(totalSalary / totalEmployees || 0).toLocaleString()}
                  </h3>
                </div>
                <FaWallet className="text-cyan-400 text-3xl" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/60 text-sm">Top Department</p>
                  <h3 className="text-2xl font-bold text-white mt-2">{topDepartment?._id || "N/A"}</h3>
                </div>
                <FaTrophy className="text-yellow-400 text-3xl" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/60 text-sm">Present Today</p>
                  <h3 className="text-2xl font-bold text-white mt-2">{attendanceTotals.present}</h3>
                </div>
                <FaUserClock className="text-emerald-400 text-3xl" />
              </div>
            </div>
          </div>

          {/* Main Grid - Department Distribution & Salary Breakdown */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Department Distribution */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="px-6 py-5 border-b border-white/20 flex items-center gap-3 bg-gradient-to-r from-cyan-500/5 to-transparent">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 flex items-center justify-center border border-cyan-500/30">
                  <FaBuilding className="text-cyan-300 text-xl" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-white">Department Distribution</h2>
                  <p className="text-white/60 text-sm">Team size overview</p>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {departmentStats.map((dept, index) => {
                  const percentage = (dept.count / totalEmployees) * 100;
                  const colors = [
                    "from-cyan-400 to-cyan-600",
                    "from-emerald-400 to-emerald-600",
                    "from-purple-400 to-purple-600",
                    "from-orange-400 to-orange-600",
                    "from-pink-400 to-pink-600",
                  ];
                  return (
                    <div key={dept._id} className="group">
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {dept._id}
                          </p>
                          <p className="text-xs text-white/60">{dept.count} employees</p>
                        </div>
                        <span className="text-cyan-300 font-bold">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${colors[index % colors.length]} transition-all duration-1000`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Salary Breakdown */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="px-6 py-5 border-b border-white/20 flex items-center gap-3 bg-gradient-to-r from-emerald-500/5 to-transparent">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center border border-emerald-500/30">
                  <FaBriefcase className="text-emerald-300 text-xl" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-white">Salary Breakdown</h2>
                  <p className="text-white/60 text-sm">Payroll allocation by department</p>
                </div>
              </div>
              <div className="p-6 space-y-5">
                {departmentStats.map((dept) => {
                  const percentage = (dept.totalSalary / totalSalary) * 100;
                  return (
                    <div key={dept._id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-white">{dept._id}</h3>
                          <p className="text-sm text-white/60">{dept.count} employees</p>
                        </div>
                        <div className="text-right">
                          <h3 className="font-bold text-emerald-300">₹{dept.totalSalary.toLocaleString()}</h3>
                          <p className="text-xs text-white/60">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="mt-4 w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Smart Insights Section */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border border-purple-500/30">
                <FaChartBar className="text-purple-300 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Smart Insights</h2>
                <p className="text-white/60 text-sm">AI generated workforce insights</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 border border-cyan-500/30 p-5 hover:transform hover:scale-105 transition-all duration-300">
                <p className="text-white/60 text-sm">Highest Paying Department</p>
                <h3 className="text-2xl font-bold text-white mt-2">{highestPayingDept?._id || "N/A"}</h3>
                {highestPayingDept && (
                  <p className="text-cyan-300 text-sm mt-2">
                    ₹{Math.round(highestPayingDept.totalSalary / highestPayingDept.count).toLocaleString()} avg
                  </p>
                )}
              </div>
              <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 p-5 hover:transform hover:scale-105 transition-all duration-300">
                <p className="text-white/60 text-sm">Largest Team</p>
                <h3 className="text-2xl font-bold text-white mt-2">{largestTeam?._id || "N/A"}</h3>
                {largestTeam && (
                  <p className="text-emerald-300 text-sm mt-2">{largestTeam.count} employees</p>
                )}
              </div>
              <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/30 p-5 hover:transform hover:scale-105 transition-all duration-300">
                <p className="text-white/60 text-sm">Average Employee Salary</p>
                <h3 className="text-2xl font-bold text-white mt-2">
                  ₹{Math.round(totalSalary / totalEmployees || 0).toLocaleString()}
                </h3>
                <p className="text-purple-300 text-sm mt-2">Across all departments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRAnalytics;