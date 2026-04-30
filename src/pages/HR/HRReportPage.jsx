import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

/* ─── Department color map ─────────────────────────────────────────────────── */
const DEPT_COLORS = {
  Sales: { text: "#7c3aed", bg: "#f3f0ff" },
  Marketing: { text: "#b45309", bg: "#fffbeb" },
  Developer: { text: "#0369a1", bg: "#e0f2fe" },
  "Graphic Designer": { text: "#be185d", bg: "#fdf2f8" },
  Editor: { text: "#065f46", bg: "#ecfdf5" },
  Telecaller: { text: "#9a3412", bg: "#fff7ed" },
  HR: { text: "#1e40af", bg: "#eff6ff" },
  SocialMedia: { text: "#c2410c", bg: "#fff7ed" },
};

const AVATAR_COLORS = [
  "#1a5799", "#7c3aed", "#0369a1", "#be185d", "#065f46", "#9a3412", "#b45309",
];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getDeptBadge(dept) {
  const colors = DEPT_COLORS[dept] || { text: "#475569", bg: "#f1f5f9" };
  return { color: colors.text, backgroundColor: colors.bg };
}

/* ─── Component ────────────────────────────────────────────────────────────── */
const HRReportPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [downloading, setDownloading] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* fetch */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/employees");
        setEmployees(data);
      } catch {
        setError("Failed to load employees. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* filter */
  const filtered = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "all" || emp.department === deptFilter;
    return matchSearch && matchDept;
  });

  /* unique departments */
  const departments = [...new Set(employees.map((e) => e.department))].sort();

  /* stats */
  const deptCounts = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});

  /* download */
  const downloadReport = async (id, name) => {
    setDownloading((p) => ({ ...p, [id]: true }));
    try {
      const response = await api.get(`/reports/employee/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${name.replace(/\s+/g, "_")}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setDownloading((p) => ({ ...p, [id]: false }));
    }
  };

  /* Loading State */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center px-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 border-r-teal-600 mx-auto shadow-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-gray-700 font-semibold">HR Report Analytics</p>
              <div className="flex justify-center space-x-1 mt-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      
      {/* Hero Section with Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Left Side - Title */}
            <div>
              <p className=" text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2">
                HR Management
              </p>
              <h1 className="text-2xl text-white sm:text-3xl lg:text-4xl font-bold mb-2">
                Employee Reports
              </h1>
              <p className="text-blue-200 text-sm">
                {employees.length} total employees • {departments.length} departments
              </p>
            </div>

            {/* Right Side - Stats Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
              {Object.entries(deptCounts).slice(0, 4).map(([dept, count]) => (
                <div key={dept} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-white/20">
                  <span className="text-xl sm:text-2xl font-bold block">{count}</span>
                  <span className="text-blue-200 text-xs">{dept}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <Link to="/hr/dashboard">
          <div className="inline-flex items-center gap-2 mb-6 text-slate-600 hover:text-slate-900 transition-colors group">
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Dashboard</span>
          </div>
        </Link>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Toolbar - Fully Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <select
            className="px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Result Count */}
          <div className="flex items-center px-4 py-2 bg-white rounded-xl border border-slate-200">
            <span className="text-sm text-slate-600">
              {filtered.length} of {employees.length}
            </span>
          </div>
        </div>

        {/* Employee Cards - Mobile View */}
        <div className="block lg:hidden space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
              <p className="text-slate-400">No employees found</p>
            </div>
          ) : (
            filtered.map((emp, i) => {
              const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
              const isLoading = downloading[emp._id];
              const deptStyle = getDeptBadge(emp.department);
              
              return (
                <div key={emp._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: avatarColor }}
                        >
                          {getInitials(emp.name)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{emp.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{emp.employeeId}</p>
                        </div>
                      </div>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ color: deptStyle.color, backgroundColor: deptStyle.backgroundColor }}
                      >
                        {emp.department}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Role:</span>
                        <span className="text-slate-700 font-medium">{emp.role || "—"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Headquarters:</span>
                        <span className="text-slate-700">{emp.headQuarter || "—"}</span>
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                      onClick={() => downloadReport(emp._id, emp.name)}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M8 2v8M5 7l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 13h10" strokeLinecap="round" />
                          </svg>
                          Download PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Employee Table - Desktop View */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Headquarters</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No employees found matching your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp, i) => {
                    const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                    const isLoading = downloading[emp._id];
                    const deptStyle = getDeptBadge(emp.department);
                    
                    return (
                      <tr key={emp._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs"
                              style={{ backgroundColor: avatarColor }}
                            >
                              {getInitials(emp.name)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{emp.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{emp.employeeId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ color: deptStyle.color, backgroundColor: deptStyle.backgroundColor }}
                          >
                            {emp.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{emp.role || "—"}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{emp.headQuarter || "—"}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                            onClick={() => downloadReport(emp._id, emp.name)}
                          >
                            {isLoading ? (
                              <>
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                              </>
                            ) : (
                              <>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M8 2v8M5 7l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M3 13h10" strokeLinecap="round" />
                                </svg>
                                Download PDF
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRReportPage;