import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { format } from "date-fns";

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial",
    background: "#f4f6f9",
    minHeight: "100vh",
  },
  header: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  th: {
    background: "#2c3e50",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #eee",
  },
};

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
      toast.error("Error");
    }
  };

  if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center px-4">
        <div className="relative">
          {/* Main spinner */}
          <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-blue-200 border-t-blue-600 border-r-indigo-600 mx-auto shadow-lg"></div>
          
          {/* Attendance/Calendar icon inside */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-blue-400"></div>
        </div>
        
        <div className="mt-5 space-y-2">
          <p className="text-gray-700 font-semibold text-base sm:text-lg">
            Loading Attendance Records
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm">Please wait while we fetch attendance data...</p>
        </div>
      </div>
    </div>
  );
}

  return (
    <div style={styles.container}>
      <div style={styles.header}>HR Attendance Dashboard</div>

      {/* CONTROL CARD */}
      <div style={styles.card}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.input}
        />

        <input
          type="time"
          value={manualCheckIn}
          onChange={(e) => setManualCheckIn(e.target.value)}
          style={styles.input}
        />

        <input
          type="time"
          value={manualCheckOut}
          onChange={(e) => setManualCheckOut(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Check-In</th>
            <th style={styles.th}>Check-Out</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => {
            const att = getAttendance(emp.employeeId);

            return (
              <tr key={emp.employeeId}>
                <td style={styles.td}>{emp.employeeId}</td>
                <td style={styles.td}>{emp.name}</td>
                <td style={styles.td}>{att?.status || "Pending"}</td>
                <td style={styles.td}>{att?.checkInTime || "-"}</td>
                <td style={styles.td}>{att?.checkOutTime || "-"}</td>
                <td style={styles.td}>
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatus(emp, s)}
                      style={{
                        ...styles.button,
                        background:
                          s === "Present"
                            ? "#2ecc71"
                            : s === "Absent"
                              ? "#e74c3c"
                              : "#3498db",
                        color: "#fff",
                        marginRight: "5px",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HRAttendance;
