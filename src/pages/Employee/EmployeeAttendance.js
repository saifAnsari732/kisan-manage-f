
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { 
  FaCalendarAlt, 
  FaFilter, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaChartLine,
  FaCalendarWeek,
  FaCalendarDay,
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarAlt
} from 'react-icons/fa';
import { MdLocalHospital, MdBedtime } from 'react-icons/md';

const EmployeeAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    filterByMonth();
  }, [attendance, filterMonth]);

  const fetchAttendance = async () => {
    try {
      const { data } = await api.get('/attendance/me');
      setAttendance(data);
      setFilteredAttendance(data);
    } catch (error) {
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const filterByMonth = () => {
    if (!filterMonth) {
      setFilteredAttendance(attendance);
      return;
    }

    const [year, month] = filterMonth.split('-');
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));

    const filtered = attendance.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });

    setFilteredAttendance(filtered);
  };

  const getAttendanceStats = () => {
    const stats = {
      total: filteredAttendance.length,
      present: 0,
      absent: 0,
      leave: 0,
      halfDay: 0
    };

    filteredAttendance.forEach(record => {
      if (record.status === 'Present') stats.present++;
      else if (record.status === 'Absent') stats.absent++;
      else if (record.status === 'Leave') stats.leave++;
      else if (record.status === 'Half Day') stats.halfDay++;
    });

    stats.percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
    stats.expectedDays = new Date(new Date(filterMonth).getFullYear(), new Date(filterMonth).getMonth() + 1, 0).getDate();

    return stats;
  };

  const generateCalendarDays = () => {
    const year = new Date(filterMonth).getFullYear();
    const month = new Date(filterMonth).getMonth();
    const firstDay = startOfMonth(new Date(year, month));
    const lastDay = endOfMonth(new Date(year, month));
    
    const days = eachDayOfInterval({ start: firstDay, end: lastDay });
    
    return days.map(day => {
      const attendanceRecord = filteredAttendance.find(record => 
        isSameDay(new Date(record.date), day)
      );
      return { date: day, record: attendanceRecord };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  const stats = getAttendanceStats();
  const calendarDays = generateCalendarDays();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">My Attendance</h1>
              <p className="text-gray-500 mt-1">Track and manage your attendance records</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-green-700 to-teal-900 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <FaCalendarWeek size={16} />
                List View
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  viewMode === 'calendar' 
                    ? 'bg-gradient-to-r from-green-700 to-teal-900 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <FaCalendarDay size={16} />
                Calendar View
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-700 to-teal-900 rounded-full flex items-center justify-center shadow-md">
                <FaFilter className="text-white text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Filter by Month</p>
                <input
                  type="month"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  max={format(new Date(), 'yyyy-MM')}
                  className="mt-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 px-5 py-2 rounded-full">
              Showing records for {monthNames[new Date(filterMonth).getMonth()]} {new Date(filterMonth).getFullYear()}
            </div>
          </div>
        </div>

        {/* Stats Cards - All Rounded */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-900 to-blue-600 rounded-3xl p-5 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <p className="text-sm opacity-90">Total Days</p>
            <p className="text-4xl font-bold mt-2">{stats.total}</p>
            <p className="text-xs opacity-75 mt-2">Out of {stats.expectedDays}</p>
          </div>
          <div className="bg-gradient-to-br from-green-900 to-green-700 rounded-3xl p-5 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <p className="text-sm opacity-90">Present</p>
            <p className="text-4xl font-bold mt-2">{stats.present}</p>
            <FaCheckCircle className="mt-2 opacity-75" />
          </div>
          <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-3xl p-5 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <p className="text-sm opacity-90">Absent</p>
            <p className="text-4xl font-bold mt-2">{stats.absent}</p>
            <FaTimesCircle className="mt-2 opacity-75" />
          </div>
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-900 rounded-3xl p-5 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <p className="text-sm opacity-90">Leave</p>
            <p className="text-4xl font-bold mt-2">{stats.leave}</p>
            <MdLocalHospital className="mt-2 opacity-75 text-xl" />
          </div>
          <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-3xl p-5 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <p className="text-sm opacity-90">Attendance %</p>
            <p className="text-4xl font-bold mt-2">{stats.percentage}%</p>
            <FaChartLine className="mt-2 opacity-75" />
          </div>
        </div>

        {/* Progress Bar Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Attendance Progress</p>
              <p className="text-xs text-gray-500 mt-1">Target: 90% attendance rate</p>
            </div>
            <span className="text-3xl font-bold text-blue-600">{stats.percentage}%</span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-700 to-teal-900 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(stats.percentage, 100)}%` }}
              />
            </div>
            <div className="absolute top-0 left-0 h-3 w-full">
              <div 
                className="h-3 w-0.5 bg-gray-400 absolute rounded-full"
                style={{ left: '90%' }}
              />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>0%</span>
            <span>Target 90%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Attendance Records */}
        {viewMode === 'list' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-700 to-teal-900 rounded-full flex items-center justify-center">
                  <FaCalendarAlt className="text-white text-sm" />
                </div>
                Attendance Records
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredAttendance.length} records found)
                </span>
              </h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((record, index) => (
                  <div key={record._id} className="p-6 hover:bg-gray-50 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Date Section - Rounded */}
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-gradient-to-r from-green-700 to-teal-900 rounded-2xl flex flex-col items-center justify-center text-white shadow-md">
                            <span className="text-2xl font-bold">
                              {format(new Date(record.date), 'dd')}
                            </span>
                            <span className="text-xs uppercase">
                              {format(new Date(record.date), 'MMM')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">
                            {format(new Date(record.date), 'EEEE')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(record.date), 'MMMM dd, yyyy')}
                          </p>
                        </div>
                      </div>

                      {/* Status Section - Rounded */}
                      <div className="flex flex-wrap items-center gap-4">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                          record.status === 'Present' 
                            ? 'bg-green-100 text-green-700'
                            : record.status === 'Absent'
                            ? 'bg-red-100 text-red-700'
                            : record.status === 'Leave'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {record.status === 'Present' && <FaCheckCircle size={14} />}
                          {record.status === 'Absent' && <FaTimesCircle size={14} />}
                          {record.status === 'Leave' && <MdLocalHospital size={14} />}
                          {record.status === 'Half Day' && <MdBedtime size={14} />}
                          <span>{record.status}</span>
                        </div>

                        {(record.checkInTime || record.checkOutTime) && (
                          <div className="flex items-center gap-3 text-sm bg-gray-100 px-4 py-2 rounded-full">
                            {record.checkInTime && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <FaClock size={12} />
                                <span>In: {record.checkInTime}</span>
                              </div>
                            )}
                            {record.checkOutTime && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <FaClock size={12} />
                                <span>Out: {record.checkOutTime}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {record.remarks && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Remarks:</span> {record.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRegCalendarAlt className="text-4xl text-gray-400" />
                  </div>
                  <p className="text-gray-400">No attendance records found for this month</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Calendar View - Rounded Cells
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-700 to-teal-900 rounded-full flex items-center justify-center">
                  <FaCalendarAlt className="text-white text-sm" />
                </div>
                Calendar View
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-7 gap-3 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-gray-600 py-2 bg-gray-50 rounded-full">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-3">
                {/* Empty cells for days before month start */}
                {Array.from({ length: new Date(new Date(filterMonth).getFullYear(), new Date(filterMonth).getMonth(), 1).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-gray-50 rounded-2xl p-4 min-h-[120px]"></div>
                ))}
                
                {/* Calendar Days - Rounded */}
                {calendarDays.map(({ date, record }, index) => {
                  const isToday = isSameDay(date, new Date());
                  const status = record?.status;
                  const statusColor = status === 'Present' ? 'border-green-500 bg-green-50' :
                                     status === 'Absent' ? 'border-red-500 bg-red-50' :
                                     status === 'Leave' ? 'border-yellow-500 bg-yellow-50' :
                                     status === 'Half Day' ? 'border-orange-500 bg-orange-50' :
                                     'border-gray-200 bg-white';
                  
                  return (
                    <div 
                      key={index}
                      className={`border-2 rounded-2xl p-3 min-h-[120px] transition-all hover:shadow-lg hover:scale-105 ${statusColor} ${
                        isToday ? 'ring-4 ring-blue-400 shadow-lg' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-base font-bold w-8 h-8 flex items-center justify-center rounded-full ${
                          isToday ? 'bg-blue-600 text-white' : 'text-gray-700'
                        }`}>
                          {format(date, 'd')}
                        </span>
                        {status && (
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        )}
                      </div>
                      {status && (
                        <div className="mt-2">
                          <p className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${
                            status === 'Present' ? 'bg-green-200 text-green-700' :
                            status === 'Absent' ? 'bg-red-200 text-red-700' :
                            status === 'Leave' ? 'bg-yellow-200 text-yellow-700' :
                            'bg-orange-200 text-orange-700'
                          }`}>
                            {status}
                          </p>
                          {record?.checkInTime && (
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <FaClock size={10} /> {record.checkInTime}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendance;