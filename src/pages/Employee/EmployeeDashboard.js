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
  FaEnvelope
} from 'react-icons/fa';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  // const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
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
      total: attendance.length
    };

    attendance.forEach(record => {
      if (record.status === 'Present') stats.present++;
      else if (record.status === 'Absent') stats.absent++;
      else if (record.status === 'Leave') stats.leave++;
    });

    return stats;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
      </div>
    );
  }

  const stats = getAttendanceStats();

  return (
    <div className="employee-dashboard">
      <div className="dashboard-header slide-down">
        <div>
          <h1>Welcome Back, {profile?.name?.split(' ')[0]}!</h1>
          <p>Here's your profile and attendance overview</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="profile-card slide-up">
          <div className="profile-header">
            <div className="profile-avatar">
              {profile?.name?.charAt(0)}
            </div>
            <div className="profile-title">
              <h2>{profile?.name}</h2>
              <p className="employee-id">{profile?.employeeId}</p>
              <span className="department-badge">{profile?.department}</span>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <FaBriefcase className="detail-icon" />
              <div>
                <span className="detail-label">Role</span>
                <p className="detail-value">{profile?.role}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaMapMarkerAlt className="detail-icon" />
              <div>
                <span className="detail-label">Head Quarter</span>
                <p className="detail-value">{profile?.headQuarter}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaUser className="detail-icon" />
              <div>
                <span className="detail-label">Reporting Manager</span>
                <p className="detail-value">{profile?.reportingManager}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaPhone className="detail-icon" />
              <div>
                <span className="detail-label">Mobile Number</span>
                <p className="detail-value">{profile?.mobileNumber}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaEnvelope className="detail-icon" />
              <div>
                <span className="detail-label">Email</span>
                <p className="detail-value">{profile?.officialEmailId}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaCalendarCheck className="detail-icon" />
              <div>
                <span className="detail-label">Date of Joining</span>
                <p className="detail-value">
                  {profile?.dateOfJoining ? format(new Date(profile.dateOfJoining), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="attendance-section slide-up" style={{animationDelay: '0.1s'}}>
          <div className="attendance-stats">
            <h2>Attendance Overview</h2>
            <div className="stats-grid">
              <div className="stat-box stat-present">
                <span className="stat-number">{stats.present}</span>
                <span className="stat-label">Present</span>
              </div>
              <div className="stat-box stat-absent">
                <span className="stat-number">{stats.absent}</span>
                <span className="stat-label">Absent</span>
              </div>
              <div className="stat-box stat-leave">
                <span className="stat-number">{stats.leave}</span>
                <span className="stat-label">Leave</span>
              </div>
            </div>
          </div>

          <div className="recent-attendance">
            <h3>Recent Attendance</h3>
            <div className="attendance-list">
              {attendance.length > 0 ? (
                attendance.map((record) => (
                  <div key={record._id} className="attendance-record">
                    <div className="record-date">
                      <span className="date-day">{format(new Date(record.date), 'dd')}</span>
                      <span className="date-month">{format(new Date(record.date), 'MMM')}</span>
                    </div>
                    <div className="record-info">
                      <p className="record-status">{record.status}</p>
                      {record.checkInTime && (
                        <span className="record-time">Check-in: {record.checkInTime}</span>
                      )}
                    </div>
                    <div className={`status-badge status-${record.status.toLowerCase().replace(' ', '-')}`}>
                      {record.status}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-records">No attendance records found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
