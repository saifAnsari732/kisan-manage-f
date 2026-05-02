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
        params: {
          startDate: selectedDate,
          endDate: selectedDate,
        },
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
          status === "Present" || status === "Half Day"
            ? manualCheckIn
            : "",

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
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";

      case "Absent":
        return "bg-rose-100 text-rose-700 border border-rose-200";

      case "Half Day":
        return "bg-amber-100 text-amber-700 border border-amber-200";

      case "Leave":
        return "bg-slate-100 text-slate-700 border border-slate-200";

      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const getButtonColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-gradient-to-r from-emerald-800 to-green-700 hover:from-emerald-700 hover:to-green-800";

      case "Absent":
        return "bg-gradient-to-r from-rose-800 to-red-700 hover:from-rose-700 hover:to-red-800";

      case "Half Day":
        return "bg-gradient-to-r from-amber-900 to-orange-600 hover:from-amber-600 hover:to-orange-700";

      case "Leave":
        return "bg-gradient-to-r from-slate-800 to-slate-800 hover:from-slate-700 hover:to-slate-900";

      default:
        return "bg-gradient-to-r from-blue-800 to-indigo-700 hover:from-blue-700 hover:to-indigo-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>

          <p className="mt-5 text-slate-700 font-semibold">
            Loading Attendance...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Attendance Dashboard
          </h1>

          <p className="text-slate-500 mt-2 text-sm">
            Manage employee attendance records efficiently
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Date */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Attendance Date
              </label>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Check In */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Default Check In
              </label>

              <input
                type="time"
                value={manualCheckIn}
                onChange={(e) => setManualCheckIn(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Check Out */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Default Check Out
              </label>

              <input
                type="time"
                value={manualCheckOut}
                onChange={(e) => setManualCheckOut(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-[28px] shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 px-8 py-7">
              <div className="flex items-center justify-between">
                
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Employee Attendance
                  </h2>

                  <p className="text-slate-300 text-sm mt-1">
                    Monitor and manage employee attendance
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  
                  <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4">
                    <p className="text-slate-300 text-xs uppercase tracking-widest">
                      Employees
                    </p>

                    <h3 className="text-3xl font-bold text-white mt-1">
                      {employees.length}
                    </h3>
                  </div>

                  <div className="bg-emerald-500/15 border border-emerald-400/20 rounded-2xl px-5 py-4">
                    <p className="text-emerald-200 text-xs uppercase tracking-widest">
                      Present
                    </p>

                    <h3 className="text-3xl font-bold text-emerald-300 mt-1">
                      {
                        employees.filter(
                          (emp) =>
                            getAttendance(emp.employeeId)?.status ===
                            "Present",
                        ).length
                      }
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Employee
                    </th>

                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Department
                    </th>

                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Check In
                    </th>

                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Check Out
                    </th>

                    <th className="px-6 py-5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {employees.map((emp, index) => {
                    const att = getAttendance(emp.employeeId);

                    return (
                      <tr
                        key={emp.employeeId}
                        className={`transition-all duration-200 hover:bg-emerald-50/40 ${
                          index % 2 === 0
                            ? "bg-white"
                            : "bg-slate-50/50"
                        }`}
                      >
                        
                        {/* Employee */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                              <img src={emp.profileImage}/> 
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold text-slate-800">
                                {emp.name}
                              </h3>

                              <p className="text-xs text-slate-500 mt-0.5">
                                ID: {emp.employeeId}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="px-6 py-5">
                          <span className="inline-flex px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                            {emp.department || "N/A"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex px-4 py-2 rounded-full text-xs font-semibold ${getStatusColor(
                              att?.status || "Pending",
                            )}`}
                          >
                            {att?.status || "Pending"}
                          </span>
                        </td>

                        {/* Check In */}
                        <td className="px-6 py-5">
                          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 inline-block">
                            <p className="text-sm font-semibold text-emerald-700">
                              {att?.checkInTime || "--:--"}
                            </p>
                          </div>
                        </td>

                        {/* Check Out */}
                        <td className="px-6 py-5">
                          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 inline-block">
                            <p className="text-sm font-semibold text-blue-700">
                              {att?.checkOutTime || "--:--"}
                            </p>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap justify-center gap-2">
                            {statuses.map((s) => (
                              <button
                                key={s}
                                onClick={() => handleStatus(emp, s)}
                                className={`${getButtonColor(
                                  s,
                                )} text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
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
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {employees.map((emp) => {
            const att = getAttendance(emp.employeeId);

            return (
              <div
                key={emp.employeeId}
                className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden"
              >
                
                <div className="bg-gradient-to-r from-slate-900 to-emerald-800 p-5">
                  <div className="flex items-center gap-4">
                    
                    <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold text-lg">
                      {emp.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                      <h3 className="text-white font-semibold">
                        {emp.name}
                      </h3>

                      <p className="text-white/70 text-xs">
                        {emp.employeeId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        att?.status || "Pending",
                      )}`}
                    >
                      {att?.status || "Pending"}
                    </span>

                    <span className="text-sm text-slate-500">
                      {emp.department}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-5">
                    
                    <div className="bg-emerald-50 rounded-2xl p-4">
                      <p className="text-xs text-slate-500">
                        Check In
                      </p>

                      <h3 className="text-lg font-bold text-emerald-700 mt-1">
                        {att?.checkInTime || "--:--"}
                      </h3>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-4">
                      <p className="text-xs text-slate-500">
                        Check Out
                      </p>

                      <h3 className="text-lg font-bold text-blue-700 mt-1">
                        {att?.checkOutTime || "--:--"}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {statuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatus(emp, s)}
                        className={`${getButtonColor(
                          s,
                        )} text-white py-3 rounded-2xl text-sm font-semibold shadow-md`}
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
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5V4H2v16h5m10 0v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6m10 0H7"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-slate-700">
              No Employees Found
            </h3>

            <p className="text-slate-500 text-sm mt-2">
              Employees will appear here once added
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRAttendance;