import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  FaUser, 
  FaCalendarCheck, 
  FaBriefcase,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaChartLine,
  FaIdCard,
  FaBuilding,
  FaUserTie,
  FaPercent,
  FaStar,
  FaRegCalendarAlt
} from 'react-icons/fa';
import { MdOutlineEmail, MdBusinessCenter, MdLocationOn } from 'react-icons/md';

const EmployeeDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, attendanceRes] = await Promise.all([
        api.get('/employees/me/profile'),
        api.get('/attendance/me')
      ]);

      setProfile(profileRes.data);
      setAttendance(attendanceRes.data.slice(0, 5));
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStats = () => {
    const stats = {
      present: 0,
      absent: 0,
      leave: 0,
      total: attendance.length,
      attendanceRate: 0
    };

    attendance.forEach(record => {
      if (record.status === 'Present') stats.present++;
      else if (record.status === 'Absent') stats.absent++;
      else if (record.status === 'Leave') stats.leave++;
    });

    stats.attendanceRate = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0;
    return stats;
  };

 if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        {/* Animated Dashboard Icon */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 border-r-purple-600 mx-auto shadow-lg"></div>
          
          {/* Inner pulsing icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Background circle */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full animate-pulse shadow-md"></div>
              
              {/* Dashboard Icon */}
              <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
          
          {/* Orbiting dots */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
        
        {/* Loading text with gradient and animated dots */}
        <div className="mt-6 space-y-3">
          <p className="text-gray-700 font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Loading Dashboard
          </p>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
          
          {/* Subtle loading message */}
          <p className="text-gray-500 text-sm animate-pulse">Please wait while we fetch your data...</p>
        </div>
      </div>
    </div>
  );
}

  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Welcome back, {profile?.name?.split(' ')[0]}! 
                <span className="text-2xl"> 👋</span>
              </h1>
              <p className="text-gray-500 mt-1">Here's your daily work summary and attendance overview</p>
            </div>
            <div className="bg-white rounded-xl px-6 py-3 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Current Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {format(currentTime, 'hh:mm:ss a')}
              </p>
              <p className="text-xs text-gray-400">{format(currentTime, 'EEEE, MMMM dd, yyyy')}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.present}</span>
            </div>
            <p className="text-gray-600 font-medium">Present Days</p>
            <p className="text-xs text-gray-400 mt-1">This month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FaTimesCircle className="text-red-600 text-xl" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.absent}</span>
            </div>
            <p className="text-gray-600 font-medium">Absent Days</p>
            <p className="text-xs text-gray-400 mt-1">This month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FaRegCalendarAlt className="text-yellow-600 text-xl" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.leave}</span>
            </div>
            <p className="text-gray-600 font-medium">Leave Days</p>
            <p className="text-xs text-gray-400 mt-1">This month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaPercent className="text-purple-600 text-xl" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</span>
            </div>
            <p className="text-gray-600 font-medium">Attendance Rate</p>
            <p className="text-xs text-gray-400 mt-1">Overall</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Profile Card - Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-green-700 to-teal-900 px-6 py-8 text-center">
                <div className="relative inline-block">
                  <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-lg mx-auto">
                    <span className="text-4xl font-bold text-white">
                      {profile?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 right-0 bg-green-500 rounded-full p-1.5 border-2 border-white">
                    <FaCheckCircle className="text-white text-xs" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mt-4">{profile?.name}</h2>
                <p className="text-blue-100 font-mono text-sm">{profile?.employeeId}</p>
                <div className="mt-3">
                  <span className="inline-flex px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                    {profile?.department}
                  </span>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <FaBriefcase className="text-blue-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</p>
                    <p className="text-gray-800 font-medium">{profile?.role}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MdLocationOn className="text-green-500 mt-1 text-lg" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Head Quarter</p>
                    <p className="text-gray-800">{profile?.headQuarter || 'Not assigned'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaUserTie className="text-purple-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Reporting Manager</p>
                    <p className="text-gray-800">{profile?.reportingManager || 'Not assigned'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaPhone className="text-green-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mobile Number</p>
                    <p className="text-gray-800">{profile?.mobileNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MdOutlineEmail className="text-red-500 mt-1 text-lg" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Official Email</p>
                    <p className="text-gray-800 text-sm break-all">{profile?.officialEmailId}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-blue-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date of Joining</p>
                    <p className="text-gray-800">
                      {profile?.dateOfJoining ? format(new Date(profile.dateOfJoining), 'dd MMM yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaStar className="text-yellow-500 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Experience</p>
                    <p className="text-gray-800">2 years 3 months</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <button className="w-full bg-green-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  Request Leave
                </button>
              </div>
            </div>
          </div>

          {/* Attendance Section - Right Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Attendance Chart Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaChartLine className="text-blue-600" />
                    Attendance Overview
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Last 5 days attendance summary</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200">
                    Week
                  </button>
                  <button className="px-3 py-1 bg-blue-900 text-white rounded-lg text-sm font-medium">
                    Month
                  </button>
                </div>
              </div>

              {/* Stats Progress */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-24 h-24">
                      <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                      <circle className="text-green-600" strokeWidth="8" strokeDasharray={`${(stats.present / stats.total) * 251.2} 251.2`} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                    </svg>
                    <div className="absolute">
                      <span className="text-2xl font-bold text-gray-900">{stats.present}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mt-2">Present</p>
                </div>
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-24 h-24">
                      <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                      <circle className="text-red-600" strokeWidth="8" strokeDasharray={`${(stats.absent / stats.total) * 251.2} 251.2`} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                    </svg>
                    <div className="absolute">
                      <span className="text-2xl font-bold text-gray-900">{stats.absent}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mt-2">Absent</p>
                </div>
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-24 h-24">
                      <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                      <circle className="text-yellow-600" strokeWidth="8" strokeDasharray={`${(stats.leave / stats.total) * 251.2} 251.2`} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                    </svg>
                    <div className="absolute">
                      <span className="text-2xl font-bold text-gray-900">{stats.leave}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mt-2">Leave</p>
                </div>
              </div>
            </div>

            {/* Recent Attendance List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FaClock className="text-blue-600" />
                  Recent Attendance Records
                </h3>
              </div>
              
              <div className="divide-y divide-gray-100">
                {attendance.length > 0 ? (
                  attendance.map((record, index) => (
                    <div key={record._id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[60px]">
                            <p className="text-2xl font-bold text-gray-800">
                              {format(new Date(record.date), 'dd')}
                            </p>
                            <p className="text-xs text-gray-500 uppercase">
                              {format(new Date(record.date), 'MMM')}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {format(new Date(record.date), 'EEEE')}
                            </p>
                            {record.checkInTime && (
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <FaClock size={10} />
                                <span>Check-in: {record.checkInTime}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            record.status === 'Present' 
                              ? 'bg-green-100 text-green-700'
                              : record.status === 'Absent'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {record.status === 'Present' && <FaCheckCircle className="mr-1 text-xs" />}
                            {record.status === 'Absent' && <FaTimesCircle className="mr-1 text-xs" />}
                            {record.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No attendance records found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaStar className="text-white text-sm" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Pro Tip</h4>
                  <p className="text-sm text-gray-600">
                    Maintaining good attendance record can lead to better performance reviews and career growth opportunities.
                    Make sure to check-in on time every day!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;