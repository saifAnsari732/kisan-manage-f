/* eslint-disable react-hooks/exhaustive-deps */
// HRAttendance.js
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FaCalendarAlt, FaCheck, FaTimes, FaClock } from 'react-icons/fa';

const HRAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [filterDepartment, setFilterDepartment] = useState('');
  const [loading, setLoading] = useState(true);

  const departments = ['Sales', 'Marketing', 'Developer', 'Graphic Designer', 'Editor'];
  const statuses = ['Present', 'Absent', 'Half Day', 'Leave', 'Holiday'];

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [selectedDate, filterDepartment]);

  const fetchEmployees = async () => {
    try {
      const params = {};
      if (filterDepartment) params.department = filterDepartment;

      const { data } = await api.get('/employees', { params });
      setEmployees(data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    }
  };

  const fetchAttendance = async () => {
    try {
      const params = {
        startDate: selectedDate,
        endDate: selectedDate
      };
      if (filterDepartment) params.department = filterDepartment;

      const { data } = await api.get('/attendance', { params });
      setAttendanceRecords(data);
    } catch (error) {
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeAttendance = (employeeId) => {
    return attendanceRecords.find(
      record => record.employeeId === employeeId &&
      format(new Date(record.date), 'yyyy-MM-dd') === selectedDate
    );
  };

  const handleStatusChange = async (employee, status) => {
    try {
      const attendanceData = {
        employeeId: employee.employeeId,
        date: selectedDate,
        status: status,
        checkInTime: status === 'Present' || status === 'Half Day' ? '09:00 AM' : '',
        checkOutTime: status === 'Present' ? '06:00 PM' : status === 'Half Day' ? '01:00 PM' : '',
        remarks: ''
      };

      await api.post('/attendance', attendanceData);
      toast.success(`Attendance marked as ${status} for ${employee.name}`);
      fetchAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const handleBulkMarkAttendance = async () => {
    try {
      const attendanceData = employees
        .filter(emp => !getEmployeeAttendance(emp.employeeId))
        .map(emp => ({
          employeeId: emp.employeeId,
          employeeName: emp.name,
          department: emp.department,
          status: 'Present',
          checkInTime: '09:00 AM',
          checkOutTime: '06:00 PM',
          remarks: 'Bulk marked'
        }));

      if (attendanceData.length === 0) {
        toast.info('All employees already have attendance marked');
        return;
      }

      await api.post('/attendance/bulk', {
        date: selectedDate,
        attendanceData
      });

      toast.success(`Marked attendance for ${attendanceData.length} employees`);
      fetchAttendance();
    } catch (error) {
      toast.error('Failed to mark bulk attendance');
    }
  };

  const getAttendanceStats = () => {
    const stats = {
      total: employees.length,
      present: 0,
      absent: 0,
      leave: 0,
      pending: 0
    };

    employees.forEach(emp => {
      const attendance = getEmployeeAttendance(emp.employeeId);
      if (!attendance) {
        stats.pending++;
      } else if (attendance.status === 'Present' || attendance.status === 'Half Day') {
        stats.present++;
      } else if (attendance.status === 'Absent') {
        stats.absent++;
      } else if (attendance.status === 'Leave') {
        stats.leave++;
      }
    });

    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = getAttendanceStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">Attendance Management</h1>
          <p className="text-sm sm:text-base text-gray-500">Mark and manage daily attendance</p>
        </div>
        <button 
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base"
          onClick={handleBulkMarkAttendance}
        >
          <FaCheck className="text-sm" /> Mark All Present
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3 bg-white p-3 sm:p-3.5 rounded-xl border-2 border-gray-100 focus-within:border-green-500 focus-within:shadow-lg focus-within:shadow-green-100 transition-all duration-200 sm:flex-1">
          <FaCalendarAlt className="text-green-600 text-sm sm:text-base" />
          <input
            type="date"
            className="flex-1 outline-none bg-transparent text-gray-900 font-semibold text-sm sm:text-base"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>

        <div className="flex items-center gap-3 bg-white p-3 sm:p-3.5 rounded-xl border-2 border-gray-100 focus-within:border-green-500 focus-within:shadow-lg focus-within:shadow-green-100 transition-all duration-200 sm:flex-1">
          <select 
            className="flex-1 outline-none bg-transparent text-gray-900 text-sm sm:text-base"
            value={filterDepartment} 
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8 animate-fade-in-up delay-100">
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-2 border-transparent hover:border-green-200 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-700">{stats.total}</div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Total Employees</div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-2 border-transparent hover:border-green-200 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.present}</div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Present</div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-2 border-transparent hover:border-red-200 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-red-600">{stats.absent}</div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Absent</div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-2 border-transparent hover:border-yellow-200 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.leave}</div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">On Leave</div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-2 border-transparent hover:border-blue-200 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.pending}</div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Pending</div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md overflow-x-auto animate-fade-in-up delay-200">
        <table className="w-full border-collapse min-w-[800px] lg:min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 sm:p-4 text-left font-bold text-gray-700 uppercase text-xs tracking-wide border-b-2 border-gray-200">Employee ID</th>
              <th className="p-3 sm:p-4 text-left font-bold text-gray-700 uppercase text-xs tracking-wide border-b-2 border-gray-200">Name</th>
              <th className="p-3 sm:p-4 text-left font-bold text-gray-700 uppercase text-xs tracking-wide border-b-2 border-gray-200">Department</th>
              <th className="p-3 sm:p-4 text-left font-bold text-gray-700 uppercase text-xs tracking-wide border-b-2 border-gray-200">Status</th>
              <th className="p-3 sm:p-4 text-left font-bold text-gray-700 uppercase text-xs tracking-wide border-b-2 border-gray-200">Check-in</th>
              <th className="p-3 sm:p-4 text-left font-bold text-gray-700 uppercase text-xs tracking-wide border-b-2 border-gray-200">Check-out</th>
              <th className="p-3 sm:p-4 text-left font-bold text-gray-700 uppercase text-xs tracking-wide border-b-2 border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              const attendance = getEmployeeAttendance(employee.employeeId);
              
              const getStatusColor = (status) => {
                const statusMap = {
                  'Present': 'bg-green-100 text-green-700',
                  'Absent': 'bg-red-100 text-red-700',
                  'Half Day': 'bg-blue-100 text-blue-700',
                  'Leave': 'bg-yellow-100 text-yellow-700',
                  'Holiday': 'bg-purple-100 text-purple-700',
                  'Pending': 'bg-gray-100 text-gray-700'
                };
                const key = status?.replace(' ', '-') || 'Pending';
                return statusMap[key] || statusMap.Pending;
              };

              return (
                <tr key={employee.employeeId} className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100">
                  <td className="p-3 sm:p-4 font-mono font-semibold text-green-700 text-sm">{employee.employeeId}</td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                        {employee.name.charAt(0)}
                      </div>
                      <span className="text-gray-900 text-sm sm:text-base">{employee.name}</span>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <span className="inline-block px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">{employee.department}</span>
                  </td>
                  <td className="p-3 sm:p-4">
                    <span className={`inline-block px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${getStatusColor(attendance?.status)}`}>
                      {attendance?.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 font-mono text-gray-500 text-xs sm:text-sm font-semibold">{attendance?.checkInTime || '-'}</td>
                  <td className="p-3 sm:p-4 font-mono text-gray-500 text-xs sm:text-sm font-semibold">{attendance?.checkOutTime || '-'}</td>
                  <td className="p-3 sm:p-4">
                    <div className="flex gap-1 sm:gap-1.5 flex-wrap">
                      {statuses.map(status => (
                        <button
                          key={status}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-200 text-xs sm:text-sm font-bold ${
                            attendance?.status === status 
                              ? 'bg-green-600 text-white shadow-md shadow-green-500/30 scale-105' 
                              : 'bg-gray-100 text-gray-600 hover:scale-105'
                          }`}
                          onClick={() => handleStatusChange(employee, status)}
                          title={status}
                        >
                          {status === 'Present' && <FaCheck className="text-xs" />}
                          {status === 'Absent' && <FaTimes className="text-xs" />}
                          {status === 'Half Day' && <FaClock className="text-xs" />}
                          {(status === 'Leave' || status === 'Holiday') && status.charAt(0)}
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

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out both;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default HRAttendance;