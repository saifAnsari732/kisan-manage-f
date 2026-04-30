import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { format } from "date-fns";

const HRAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [loading, setLoading] = useState(true);

  const [manualCheckIn, setManualCheckIn] = useState("09:00");
  const [manualCheckOut, setManualCheckOut] = useState("18:00");

  const statuses = ["Present", "Absent", "Half Day", "Leave"];

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [selectedDate]);

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get("/employees");
      setEmployees(data);
    } catch {
      toast.error("Failed to fetch employees");
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data } = await api.get("/attendance", {
        params: { startDate: selectedDate, endDate: selectedDate },
      });
      setAttendanceRecords(data);
    } catch {
      toast.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  const getAttendance = (id) => {
    return attendanceRecords.find(
      (rec) =>
        rec.employeeId === id &&
        format(new Date(rec.date), "yyyy-MM-dd") === selectedDate,
    );
  };

  const handleStatus = async (emp, status) => {
    try {
      await api.post("/attendance", {
        employeeId: emp.employeeId,
        date: selectedDate,
        status,
        checkInTime:
          status === "Present" || status === "Half Day" ? manualCheckIn : "",
        checkOutTime:
          status === "Present"
            ? manualCheckOut
            : status === "Half Day"
              ? manualCheckIn
              : "",
      });

      toast.success(`${emp.name} marked ${status}`);
      fetchAttendance();
    } catch {
      toast.error("Error updating attendance");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-emerald-100 text-emerald-700";
      case "Absent":
        return "bg-rose-100 text-rose-700";
      case "Half Day":
        return "bg-amber-100 text-amber-700";
      case "Leave":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const getButtonColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-emerald-600 hover:bg-emerald-700";
      case "Absent":
        return "bg-rose-800 hover:bg-rose-700";
      case "Half Day":
        return "bg-amber-700 hover:bg-amber-700";
      case "Leave":
        return "bg-slate-600 hover:bg-slate-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center px-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto shadow-lg"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg
                className="w-6 h-6 text-emerald-600 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-5">
            <p className="text-slate-700 font-semibold text-base">
              Loading Attendance
            </p>
            <p className="text-slate-500 text-xs mt-1">Fetching records...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="px-4 py-4 md:px-8 md:py-6 lg:px-10 lg:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Attendance Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Mark and track employee attendance
          </p>
        </div>

        {/* Controls and Stats Grid - Desktop Friendly */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Controls Card */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Attendance Controls
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Check-In Time
                </label>
                <input
                  type="time"
                  value={manualCheckIn}
                  onChange={(e) => setManualCheckIn(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Check-Out Time
                </label>
                <input
                  type="time"
                  value={manualCheckOut}
                  onChange={(e) => setManualCheckOut(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Today's Summary
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 md:gap-3">
              {/* Present - Emerald Theme */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-emerald-100 to-white rounded-xl p-2 md:p-3 border border-emerald-100 shadow-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-emerald-900 text-lg md:text-2xl font-bold">
                      {
                        employees.filter(
                          (emp) =>
                            getAttendance(emp.employeeId)?.status === "Present",
                        ).length
                      }
                    </span>
                    <span className="text-emerald-700 text-[10px] md:text-xs font-semibold mt-1">
                      Present
                    </span>
                    <div className="w-full bg-emerald-100 rounded-full h-1 mt-2">
                      <div
                        className="bg-emerald-500 h-1 rounded-full"
                        style={{
                          width: `${(employees.filter((emp) => getAttendance(emp.employeeId)?.status === "Present").length / employees.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Absent - Rose Theme */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-rose-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-rose-50 to-white rounded-xl p-2 md:p-3 border border-rose-100 shadow-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-rose-600 text-lg md:text-2xl font-bold">
                      {
                        employees.filter(
                          (emp) =>
                            getAttendance(emp.employeeId)?.status === "Absent",
                        ).length
                      }
                    </span>
                    <span className="text-rose-700 text-[10px] md:text-xs font-semibold mt-1">
                      Absent
                    </span>
                    <div className="w-full bg-rose-100 rounded-full h-1 mt-2">
                      <div
                        className="bg-rose-500 h-1 rounded-full"
                        style={{
                          width: `${(employees.filter((emp) => getAttendance(emp.employeeId)?.status === "Absent").length / employees.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Half Day - Amber Theme */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-amber-50 to-white rounded-xl p-2 md:p-3 border border-amber-100 shadow-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-amber-600 text-lg md:text-2xl font-bold">
                      {
                        employees.filter(
                          (emp) =>
                            getAttendance(emp.employeeId)?.status ===
                            "Half Day",
                        ).length
                      }
                    </span>
                    <span className="text-amber-700 text-[10px] md:text-xs font-semibold mt-1">
                      Half Day
                    </span>
                    <div className="w-full bg-amber-100 rounded-full h-1 mt-2">
                      <div
                        className="bg-amber-500 h-1 rounded-full"
                        style={{
                          width: `${(employees.filter((emp) => getAttendance(emp.employeeId)?.status === "Half Day").length / employees.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leave - Slate Theme */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-xl p-2 md:p-3 border border-slate-100 shadow-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-slate-600 text-lg md:text-2xl font-bold">
                      {
                        employees.filter(
                          (emp) =>
                            getAttendance(emp.employeeId)?.status === "Leave",
                        ).length
                      }
                    </span>
                    <span className="text-slate-700 text-[10px] md:text-xs font-semibold mt-1">
                      Leave
                    </span>
                    <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
                      <div
                        className="bg-slate-500 h-1 rounded-full"
                        style={{
                          width: `${(employees.filter((emp) => getAttendance(emp.employeeId)?.status === "Leave").length / employees.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">
                    Employee Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">
                    Check-In
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">
                    Check-Out
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => {
                  const att = getAttendance(emp.employeeId);
                  return (
                    <tr
                      key={emp.employeeId}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {emp.employeeId}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {emp.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {emp.department}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(att?.status || "Pending")}`}
                        >
                          {att?.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {att?.checkInTime || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {att?.checkOutTime || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {statuses.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleStatus(emp, s)}
                              className={`${getButtonColor(s)} text-white px-2 py-1 rounded text-xs font-medium hover:shadow-md transition-all`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View (hidden on desktop) */}
        <div className="md:hidden space-y-3">
          {employees.map((emp) => {
            const att = getAttendance(emp.employeeId);
            return (
              <div
                key={emp.employeeId}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="bg-gradient-to-t  bg-green-700 from-emerald-900 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base">
                        {emp.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">
                          {emp.name}
                        </h3>
                        <p className="text-white/70 text-xs">
                          ID: {emp.employeeId}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(att?.status || "Pending")}`}
                    >
                      {att?.status || "Pending"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4 pb-3 border-b border-slate-100">
                    <div>
                      <p className="text-slate-500 text-xs">Check-In</p>
                      <p className="text-base font-semibold text-slate-800">
                        {att?.checkInTime || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Check-Out</p>
                      <p className="text-base font-semibold text-slate-800">
                        {att?.checkOutTime || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {statuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatus(emp, s)}
                        className={`${getButtonColor(s)} text-white py-2 rounded-lg text-sm font-medium active:scale-95 transition-all shadow-sm`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {employees.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="w-16 h-16 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No employees found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRAttendance;
