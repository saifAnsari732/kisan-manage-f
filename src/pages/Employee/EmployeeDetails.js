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
  FaGraduationCap,
  FaClock,
  FaStar,
  FaChartLine,
  FaAward,
  FaProjectDiagram
} from 'react-icons/fa';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [imageError, setImageError] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-indigo-200 border-t-indigo-600 border-r-purple-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg className="w-10 h-10 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-gray-700 font-semibold text-lg">Loading employee profile...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the details</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="text-4xl text-red-500" />
          </div>
          <p className="text-gray-700 text-lg font-semibold">Employee not found</p>
          <button
            onClick={() => navigate('/hr/employees')}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  const statsCards = [
    { label: 'Projects Completed', value: '24', icon: FaProjectDiagram, color: 'from-blue-500 to-blue-600' },
    { label: 'Attendance Rate', value: '96%', icon: FaChartLine, color: 'from-green-500 to-green-600' },
    { label: 'Years of Service', value: '3.5', icon: FaStar, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Recognitions', value: '8', icon: FaAward, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/hr/employees')}
            className="group flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50"
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Employees</span>
          </button>
        </div>

        {/* Profile Header with Glassmorphism */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-30"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 h-40"></div>
            <div className="relative px-6 pb-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-end -mt-16 mb-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                    {!imageError ? (
                      <img 
                        src={employee.profileImage || `https://ui-avatars.com/api/?name=${employee.name}&background=6366f1&color=fff&size=128`}
                        alt={employee.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      employee.name?.charAt(0) || employee.employeeId?.charAt(0)
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <FaEdit className="text-white text-xl" />
                  </div>
                </div>
                
                <div className="lg:ml-6 text-center lg:text-left mt-4 lg:mt-0 flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {employee.name}
                  </h1>
                  <p className="text-gray-500 mt-1 font-mono">{employee.employeeId}</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center lg:justify-start">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-sm font-semibold shadow-sm">
                      {employee.department || 'N/A'}
                    </span>
                    <span className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full text-sm font-semibold shadow-sm">
                      {employee.designation || 'N/A'}
                    </span>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                      employee.status === 'active' 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700' 
                        : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700'
                    }`}>
                      <span className="flex items-center gap-1">
                        {employee.status === 'active' ? <FaCheckCircle className="text-xs" /> : <FaTimesCircle className="text-xs" />}
                        {employee.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 lg:mt-0">
                  <button
                    onClick={() => navigate(`/hr/employees/edit`)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FaEdit className="text-sm" />
                    <span className="font-medium">Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FaTrash className="text-sm" />
                    <span className="font-medium">Delete</span>
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {statsCards.map((stat, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-md border border-gray-200/50">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className="text-2xl text-indigo-600" />
                      <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="border-b border-gray-200/50">
            <div className="flex overflow-x-auto hide-scrollbar">
              {['personal', 'professional', 'attendance', 'documents'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 text-sm font-semibold transition-all duration-300 relative ${
                    activeTab === tab
                      ? 'text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 lg:p-8">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InfoCard icon={FaUser} label="Full Name" value={employee.name} />
                  <InfoCard icon={FaIdCard} label="Employee ID" value={employee.employeeId} />
                  <InfoCard icon={FaEnvelope} label="Email Address" value={employee.email} />
                  <InfoCard icon={FaPhone} label="Phone Number" value={employee.phone} />
                  <InfoCard icon={FaCalendarAlt} label="Date of Birth" value={employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'} />
                  <InfoCard icon={FaMapMarkerAlt} label="Address" value={employee.address} />
                </div>
              </div>
            )}

            {/* Professional Information Tab */}
            {activeTab === 'professional' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                  Professional Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InfoCard icon={FaBuilding} label="Department" value={employee.department} />
                  <InfoCard icon={FaBriefcase} label="Designation" value={employee.designation} />
                  <InfoCard icon={FaCalendarAlt} label="Date of Joining" value={employee.doj ? new Date(employee.doj).toLocaleDateString() : 'N/A'} />
                  <InfoCard icon={FaRupeeSign} label="Salary" value={employee.salary ? `₹${employee.salary.toLocaleString()}` : 'N/A'} />
                  <InfoCard icon={FaGraduationCap} label="Qualification" value={employee.qualification} />
                  <InfoCard icon={FaClock} label="Employment Status" value={employee.status === 'active' ? 'Active' : 'Inactive'} isStatus />
                </div>
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
              <div className="animate-fade-in text-center py-8">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaClock className="text-4xl text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Attendance Overview</h3>
                  <p className="text-gray-500 mb-6">View detailed attendance records and reports</p>
                  <button
                    onClick={() => navigate(`/hr/attendance?employee=${id}`)}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                  >
                    View Attendance Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="animate-fade-in text-center py-8">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaProjectDiagram className="text-4xl text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Employee Documents</h3>
                  <p className="text-gray-500 mb-6">Access and manage employee documentation</p>
                  <button
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                  >
                    Manage Documents
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

// Helper component for info cards
const InfoCard = ({ icon: Icon, label, value, isStatus }) => (
  <div className="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 hover:border-indigo-200">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg group-hover:scale-110 transition-transform">
        <Icon className={`text-lg ${isStatus && value === 'Active' ? 'text-green-600' : isStatus && value === 'Inactive' ? 'text-red-600' : 'text-indigo-600'}`} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className={`font-semibold mt-1 ${isStatus && value === 'Active' ? 'text-green-600' : isStatus && value === 'Inactive' ? 'text-red-600' : 'text-gray-800'}`}>
          {value || 'N/A'}
        </p>
      </div>
    </div>
  </div>
);

export default EmployeeDetails;