import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './EmployeeProfile.css';

const EmployeeProfile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    mobileNumber: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/employees/me/profile');
      setProfile(data);
      setFormData({
        address: data.address,
        mobileNumber: data.mobileNumber
      });
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data } = await api.put('/employees/me/profile', formData);
      setProfile(data);
      updateUser({ employee: data });
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      address: profile.address,
      mobileNumber: profile.mobileNumber
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
      </div>
    );
  }

  return (
    <div className="employee-profile">
      <div className="profile-header slide-down">
        <div>
          <h1>My Profile</h1>
          <p>View and manage your personal information</p>
        </div>
        {!editing && (
          <button className="btn-edit-profile" onClick={() => setEditing(true)}>
            <FaEdit /> Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content slide-up">
        <div className="profile-card-large">
          <div className="profile-banner">
            <div className="profile-avatar-large">
              {profile?.name?.charAt(0)}
            </div>
            <div className="profile-identity">
              <h2>{profile?.name}</h2>
              <p className="emp-id">{profile?.employeeId}</p>
              <div className="profile-badges">
                <span className="badge badge-department">{profile?.department}</span>
                <span className="badge badge-role">{profile?.role}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>{profile?.name}</p>
                </div>
                <div className="info-item">
                  <label>Father's Name</label>
                  <p>{profile?.fatherName}</p>
                </div>
                <div className="info-item">
                  <label>Date of Birth</label>
                  <p>{profile?.dateOfBirth ? format(new Date(profile.dateOfBirth), 'MMMM dd, yyyy') : 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Date of Joining</label>
                  <p>{profile?.dateOfJoining ? format(new Date(profile.dateOfJoining), 'MMMM dd, yyyy') : 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Employment Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Department</label>
                  <p>{profile?.department}</p>
                </div>
                <div className="info-item">
                  <label>Role</label>
                  <p>{profile?.role}</p>
                </div>
                <div className="info-item">
                  <label>Head Quarter</label>
                  <p>{profile?.headQuarter}</p>
                </div>
                <div className="info-item">
                  <label>Reporting Manager</label>
                  <p>{profile?.reportingManager}</p>
                </div>
                <div className="info-item">
                  <label>CUG Number</label>
                  <p>{profile?.cugNumber || 'Not Assigned'}</p>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Contact Information</h3>
              <div className="info-grid">
                <div className="info-item editable">
                  <label>Mobile Number *</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <p>{profile?.mobileNumber}</p>
                  )}
                </div>
                <div className="info-item">
                  <label>Personal Email</label>
                  <p>{profile?.emailId}</p>
                </div>
                <div className="info-item">
                  <label>Official Email</label>
                  <p>{profile?.officialEmailId}</p>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Address</h3>
              <div className="info-item editable full-width">
                <label>Current Address *</label>
                {editing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                  />
                ) : (
                  <p>{profile?.address}</p>
                )}
              </div>
            </div>

            {editing && (
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="btn-save">
                  <FaSave /> Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
