import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaBuilding, 
  FaBriefcase, 
  FaCalendarAlt, 
  FaIdCard,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaGraduationCap
} from 'react-icons/fa';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await api.get(`/employees/${id}`);
      setEmployee(response.data);
    } catch (error) {
      toast.error('Failed to fetch employee details');
      navigate('/hr/employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        toast.success('Employee deleted successfully');
        navigate('/hr/employees');
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    }
  };

if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="relative">
          {/* Rotating ring */}
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 border-r-emerald-500 rounded-full animate-spin mx-auto"></div>
          
          {/* Pulsing employee icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg className="w-7 h-7 text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          {/* Orbiting dots */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading employee details...</p>
      </div>
    </div>
  );
}

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Employee not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/hr/employees')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-sm" />
          <span>Back to Employees</span>
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/hr/employees/edit/${id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaEdit className="text-sm" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <FaTrash className="text-sm" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-green-600 to-green-800 h-32"></div>
        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {employee.name?.charAt(0) || employee.employeeId?.charAt(0)}
            </div>
            <div className="md:ml-6 text-center md:text-left mt-4 md:mt-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{employee.name}</h1>
              <p className="text-gray-500">{employee.employeeId}</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {employee.department || 'N/A'}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {employee.designation || 'N/A'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  employee.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {employee.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'personal'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'professional'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Professional Info
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'attendance'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Attendance
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <FaUser className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">{employee.name || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaIdCard className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Employee ID</p>
                    <p className="font-medium text-gray-800">{employee.employeeId || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-800">{employee.email || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaPhone className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-800">{employee.phone || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-800">
                      {employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">{employee.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Professional Information Tab */}
          {activeTab === 'professional' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <FaBuilding className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium text-gray-800">{employee.department || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaBriefcase className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Designation</p>
                    <p className="font-medium text-gray-800">{employee.designation || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Joining</p>
                    <p className="font-medium text-gray-800">
                      {employee.doj ? new Date(employee.doj).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaRupeeSign className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium text-gray-800">
                      {employee.salary ? `₹${employee.salary.toLocaleString()}` : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaGraduationCap className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Qualification</p>
                    <p className="font-medium text-gray-800">{employee.qualification || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  {employee.status === 'active' ? (
                    <FaCheckCircle className="text-green-500 mt-1" />
                  ) : (
                    <FaTimesCircle className="text-red-500 mt-1" />
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Employment Status</p>
                    <p className={`font-medium ${employee.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {employee.status === 'active' ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="text-center py-8">
              <p className="text-gray-500">Attendance records will be displayed here</p>
              <button
                onClick={() => navigate(`/hr/attendance?employee=${id}`)}
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                View Attendance Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;