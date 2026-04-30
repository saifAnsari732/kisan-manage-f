import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaUser, 
  FaBriefcase, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaBuilding,
  FaUserTie,
  FaUniversity,
  FaCreditCard,
  FaMoneyBillWave,
  FaIdCard,
  FaCheckCircle,
  FaRegIdCard,
  FaCalendarCheck,
  FaGlobe,
  FaMobileAlt,
  FaHome,
  FaDollarSign,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft
} from 'react-icons/fa';
import { MdEmail, MdBusinessCenter, MdLocationOn } from 'react-icons/md';

const EmployeeProfile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    mobileNumber: '',
    bankName: '',
    accountNo: '',
    ifsc: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/employees/me/profile');
      setProfile(data);
      setFormData({
        address: data.address || '',
        mobileNumber: data.mobileNumber || '',
        bankName: data.bankName || '',
        accountNo: data.accountNo || '',
        ifsc: data.ifsc || ''
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
      address: profile.address || '',
      mobileNumber: profile.mobileNumber || '',
      bankName: profile.bankName || '',
      accountNo: profile.accountNo || '',
      ifsc: profile.ifsc || ''
    });
    setEditing(false);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FaUser, mobileLabel: 'Personal' },
    { id: 'employment', label: 'Employment', icon: FaBriefcase, mobileLabel: 'Work' },
    { id: 'contact', label: 'Contact', icon: FaPhone, mobileLabel: 'Contact' },
    { id: 'bank', label: 'Bank Details', icon: FaUniversity, mobileLabel: 'Bank' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center px-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-600 mt-4 text-sm sm:text-base font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Mobile Header with Back Button */}
        <div className="lg:hidden mb-4 flex items-center gap-3">
          <button 
            onClick={() => window.history.back()}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
            <p className="text-xs text-gray-500">Manage your information</p>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Employee Profile</h1>
              <p className="text-gray-500 mt-1">Manage your personal and professional information</p>
            </div>
            {!editing && (
              <button 
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FaEdit size={18} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Mobile Edit Button */}
        {!editing && (
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setEditing(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md"
            >
              <FaEdit size={16} />
              Edit Profile
            </button>
          </div>
        )}

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Profile Header - Mobile Optimized */}
          <div className="relative">
            {/* Cover Image */}
            <div className="h-32 sm:h-40 lg:h-48 bg-gradient-to-r from-green-700 to-teal-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
              </svg>
            </div>

            {/* Avatar Section - Responsive */}
            <div className="relative px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-16 mb-4 sm:mb-6">
                <div className="relative flex justify-center lg:justify-start">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-40 lg:h-40 rounded-2xl bg-gradient-to-r from-teal-700 to-green-800 flex items-center justify-center border-4 border-white shadow-2xl">
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                      {profile?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white shadow-lg">
                    <FaCheckCircle className="text-white text-xs sm:text-sm" />
                  </div>
                </div>
                
                <div className="flex-1 pb-2 sm:pb-4 text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{profile?.name}</h2>
                      <p className="text-gray-500 font-mono text-xs sm:text-sm mt-1">{profile?.employeeId}</p>
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-3 justify-center lg:justify-start">
                        <span className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-100 text-blue-700 rounded-lg text-xs sm:text-sm font-medium">
                          {profile?.department}
                        </span>
                        <span className="px-2 py-1 sm:px-3 sm:py-1 bg-purple-100 text-purple-700 rounded-lg text-xs sm:text-sm font-medium">
                          {profile?.role}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3 justify-center lg:justify-start">
                      <div className="text-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 rounded-xl">
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">2</p>
                        <p className="text-xs text-gray-500">Years</p>
                      </div>
                      <div className="text-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 rounded-xl">
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">98%</p>
                        <p className="text-xs text-gray-500">Attendance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Tab Selector - Dropdown */}
          <div className="lg:hidden px-4 pb-3">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 font-medium"
            >
              {tabs.map(tab => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Tabs Navigation */}
          <div className="hidden lg:block border-b border-gray-200 px-6 lg:px-8">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content - Mobile Optimized */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
            
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                    <p className="text-gray-900 font-medium text-sm sm:text-base mt-1 break-words">{profile?.name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Father's Name</label>
                    <p className="text-gray-900 text-sm sm:text-base mt-1 break-words">{profile?.fatherName || 'Not provided'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <FaCalendarAlt size={12} /> Date of Birth
                    </label>
                    <p className="text-gray-900 text-sm sm:text-base mt-1">
                      {profile?.dateOfBirth ? format(new Date(profile.dateOfBirth), 'dd MMM yyyy') : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <FaCalendarCheck size={12} /> Date of Joining
                    </label>
                    <p className="text-gray-900 text-sm sm:text-base mt-1">
                      {profile?.dateOfJoining ? format(new Date(profile.dateOfJoining), 'dd MMM yyyy') : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <FaRegIdCard size={12} /> Employee ID
                    </label>
                    <p className="text-gray-900 font-mono text-sm sm:text-base mt-1 break-words">{profile?.employeeId}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <FaDollarSign size={12} /> Salary
                    </label>
                    <p className="text-gray-900 font-bold text-green-600 text-sm sm:text-base mt-1">
                      ₹{profile?.salary?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Employment Information Tab */}
            {activeTab === 'employment' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5">
                    <FaBuilding className="text-blue-600 text-xl sm:text-2xl mb-2 sm:mb-3" />
                    <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Department</label>
                    <p className="text-gray-900 text-base sm:text-lg font-semibold mt-1 break-words">{profile?.department}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 sm:p-5">
                    <FaUserTie className="text-purple-600 text-xl sm:text-2xl mb-2 sm:mb-3" />
                    <label className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Role</label>
                    <p className="text-gray-900 text-base sm:text-lg font-semibold mt-1 break-words">{profile?.role}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-5">
                    <FaGlobe className="text-green-600 text-xl sm:text-2xl mb-2 sm:mb-3" />
                    <label className="text-xs font-semibold text-green-600 uppercase tracking-wider">Head Quarter</label>
                    <p className="text-gray-900 font-medium text-sm sm:text-base mt-1 break-words">{profile?.headQuarter || 'Not assigned'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 sm:p-5">
                    <MdBusinessCenter className="text-orange-600 text-xl sm:text-2xl mb-2 sm:mb-3" />
                    <label className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Reporting Manager</label>
                    <p className="text-gray-900 font-medium text-sm sm:text-base mt-1 break-words">{profile?.reportingManager || 'Not assigned'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FaMobileAlt className="text-green-600 text-base sm:text-lg" />
                      </div>
                      <label className="font-semibold text-gray-700 text-sm sm:text-base">Mobile Number</label>
                    </div>
                    {editing ? (
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    ) : (
                      <p className="text-gray-900 text-base sm:text-lg font-medium break-words">{profile?.mobileNumber}</p>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MdEmail className="text-blue-600 text-base sm:text-lg" />
                      </div>
                      <label className="font-semibold text-gray-700 text-sm sm:text-base">Personal Email</label>
                    </div>
                    <p className="text-gray-900 text-sm sm:text-base break-words">{profile?.emailId}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <MdEmail className="text-purple-600 text-base sm:text-lg" />
                      </div>
                      <label className="font-semibold text-gray-700 text-sm sm:text-base">Official Email</label>
                    </div>
                    <p className="text-gray-900 text-sm sm:text-base break-words">{profile?.officialEmailId || 'Not provided'}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <FaHome className="text-red-600 text-base sm:text-lg" />
                      </div>
                      <label className="font-semibold text-gray-700 text-sm sm:text-base">Address</label>
                    </div>
                    {editing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base leading-relaxed break-words">{profile?.address || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bank Details Tab - Mobile Optimized */}
            {activeTab === 'bank' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <FaUniversity className="text-white text-lg sm:text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">Bank Account</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">Salary will be credited here</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                      {editing ? (
                        <input
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          placeholder="Enter bank name"
                          className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        />
                      ) : (
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-gray-900 font-medium text-sm sm:text-base break-words">{profile?.bankName || 'Not provided'}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <FaCreditCard size={14} /> Account Number
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="accountNo"
                          value={formData.accountNo}
                          onChange={handleInputChange}
                          placeholder="Enter account number"
                          className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        />
                      ) : (
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-gray-900 font-mono text-sm sm:text-base break-words">
                            {profile?.accountNo ? `XXXX XXXX XXXX ${profile.accountNo.slice(-4)}` : 'Not provided'}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <FaIdCard size={14} /> IFSC Code
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="ifsc"
                          value={formData.ifsc}
                          onChange={handleInputChange}
                          placeholder="Enter IFSC code"
                          className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase text-sm sm:text-base"
                        />
                      ) : (
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-gray-900 font-mono uppercase text-sm sm:text-base break-words">{profile?.ifsc || 'Not provided'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Note Card */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4">
                  <p className="text-yellow-800 text-xs sm:text-sm">
                    <strong>Note:</strong> Please ensure your bank details are correct. Salary processing requires accurate bank information.
                  </p>
                </div>
              </div>
            )}

            {/* Form Actions - Mobile Optimized */}
            {editing && (
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <FaTimes size={14} />
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md"
                >
                  <FaSave size={14} />
                  Save Changes
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