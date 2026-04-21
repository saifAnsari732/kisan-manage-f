/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { FaCalendarAlt, FaFilter } from 'react-icons/fa';
import './EmployeeAttendance.css';

const EmployeeAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(format(new Date(), 'yyyy-MM'));

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
    <div className="employee-attendance">
      <div className="page-header slide-down">
        <div>
          <h1>My Attendance</h1>
          <p>Track your attendance records and history</p>
        </div>
      </div>

      <div className="attendance-filter slide-up">
        <div className="filter-box">
          <FaFilter />
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            max={format(new Date(), 'yyyy-MM')}
          />
        </div>
      </div>

      <div className="stats-overview slide-up" style={{animationDelay: '0.1s'}}>
        <div className="stat-card card-total">
          <h3>Total Days</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card card-present">
          <h3>Present</h3>
          <p className="stat-value">{stats.present}</p>
        </div>
        <div className="stat-card card-absent">
          <h3>Absent</h3>
          <p className="stat-value">{stats.absent}</p>
        </div>
        <div className="stat-card card-leave">
          <h3>Leave</h3>
          <p className="stat-value">{stats.leave}</p>
        </div>
        <div className="stat-card card-percentage">
          <h3>Attendance %</h3>
          <p className="stat-value">{stats.percentage}%</p>
        </div>
      </div>

      <div className="attendance-records slide-up" style={{animationDelay: '0.2s'}}>
        <h2>
          <FaCalendarAlt /> Attendance Records
          <span className="record-count">({filteredAttendance.length} records)</span>
        </h2>
        
        {filteredAttendance.length > 0 ? (
          <div className="records-grid">
            {filteredAttendance.map((record) => (
              <div key={record._id} className="record-card">
                <div className="record-date-section">
                  <div className="date-display">
                    <span className="date-day">{format(new Date(record.date), 'dd')}</span>
                    <span className="date-month">{format(new Date(record.date), 'MMM')}</span>
                    <span className="date-year">{format(new Date(record.date), 'yyyy')}</span>
                  </div>
                  <div className="date-weekday">
                    {format(new Date(record.date), 'EEEE')}
                  </div>
                </div>

                <div className="record-details">
                  <div className={`status-indicator status-${record.status.toLowerCase().replace(' ', '-')}`}>
                    <span className="status-dot"></span>
                    <span className="status-text">{record.status}</span>
                  </div>

                  {(record.checkInTime || record.checkOutTime) && (
                    <div className="time-details">
                      {record.checkInTime && (
                        <div className="time-item">
                          <span className="time-label">Check-in:</span>
                          <span className="time-value">{record.checkInTime}</span>
                        </div>
                      )}
                      {record.checkOutTime && (
                        <div className="time-item">
                          <span className="time-label">Check-out:</span>
                          <span className="time-value">{record.checkOutTime}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {record.remarks && (
                    <div className="record-remarks">
                      <span className="remarks-label">Remarks:</span>
                      <p>{record.remarks}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-records">
            <FaCalendarAlt />
            <p>No attendance records found for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendance;
