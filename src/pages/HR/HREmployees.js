import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaUser, FaEnvelope, 
  FaPhone, FaBuilding, FaBriefcase, FaUniversity, FaTimes,
  FaUsers, FaUserCheck, FaChartLine, FaCity, FaTag
} from 'react-icons/fa';

const HREmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const [formData, setFormData] = useState({
    employeeId: '', name: '', fatherName: '', role: '', department: '',
    headQuarter: '', dateOfJoining: '', dateOfBirth: '', reportingManager: '',
    mobileNumber: '', emailId: '', officialEmailId: '', address: '',
    salary: '', password: 'password123', bankName: '', accountNo: '', ifsc: ''
  });

  const departments = ['all', 'Editor', 'HR', 'Telecaller', 'Marketing', 'SocialMedia', 'GraphicsDesigner'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    let filtered = employees.filter(emp =>
      (emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedDepartment === 'all' || emp.department === selectedDepartment)
    );
    setFilteredEmployees(filtered);
  }, [employees, searchTerm, selectedDepartment]);

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/employees');
      setEmployees(data);
      setFilteredEmployees(data);
    } catch {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee._id}`, formData);
        toast.success('Employee updated successfully');
      } else {
        await api.post('/employees', formData);
        toast.success('Employee created successfully');
      }
      setShowModal(false);
      fetchEmployees();
      resetForm();
    } catch {
      toast.error('Error saving employee');
    }
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      ...emp,
      dateOfJoining: emp.dateOfJoining ? format(new Date(emp.dateOfJoining), 'yyyy-MM-dd') : '',
      dateOfBirth: emp.dateOfBirth ? format(new Date(emp.dateOfBirth), 'yyyy-MM-dd') : '',
      bankName: emp.bankName || '',
      accountNo: emp.accountNo || '',
      ifsc: emp.ifsc || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        toast.success('Employee deleted successfully');
        fetchEmployees();
      } catch {
        toast.error('Failed to delete employee');
      }
    }
  };

  const resetForm = () => {
    setEditingEmployee(null);
    setFormData({
      employeeId: '', name: '', fatherName: '', role: '', department: '',
      headQuarter: '', dateOfJoining: '', dateOfBirth: '', reportingManager: '',
      mobileNumber: '', emailId: '', officialEmailId: '', address: '',
      salary: '', password: 'password123', bankName: '', accountNo: '', ifsc: ''
    });
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      Editor: 'bg-blue-100 text-blue-700',
      HR: 'bg-purple-100 text-purple-700',
      Telecaller: 'bg-green-100 text-green-700',
      Marketing: 'bg-pink-100 text-pink-700',
      SocialMedia: 'bg-yellow-100 text-yellow-700',
      GraphicsDesigner: 'bg-indigo-100 text-indigo-700'
    };
    return colors[dept] || 'bg-gray-100 text-gray-700';
  };

  const totalEmployees = employees.length;
  const uniqueDepts = new Set(employees.map(e => e.department)).size;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center px-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 border-r-purple-600 mx-auto shadow-lg"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg className="w-6 h-6 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-blue-400"></div>
        </div>
        <div className="mt-5 space-y-2">
          <p className="text-gray-700 font-semibold text-base">Loading Employees</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
          <p className="text-gray-500 text-sm animate-pulse">Fetching employee records...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Main Container with proper padding - NO content clipping */}
      <div className="w-full px-4 sm:px-6 md:px-8 py-5 sm:py-6">
        
        {/* Header Section */}
        <div className="">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-700 to-teal-900 bg-clip-text text-transparent">
                Employee Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">Manage and track all employee records</p>
            </div>
            
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-700 to-teal-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base w-ful"
            >
              <FaPlus className="text-sm" />
              <span>Add Employee</span>
            </button>
          </div>

          {/* Stats Cards - Fully visible */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide">Total</p>
                <FaUsers className="text-blue-400 text-sm" />
              </div>
              <p className="text-3xl font-bold text-blue-700 mt-1">{totalEmployees}</p>
              <p className="text-blue-500 text-xs mt-1 font-medium">Employees</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-green-600 text-xs font-semibold uppercase tracking-wide">Depts</p>
                <FaCity className="text-green-400 text-sm" />
              </div>
              <p className="text-3xl font-bold text-green-700 mt-1">{uniqueDepts}</p>
              <p className="text-green-500 text-xs mt-1 font-medium">Departments</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide">Active</p>
                <FaUserCheck className="text-purple-400 text-sm" />
              </div>
              <p className="text-3xl font-bold text-purple-700 mt-1">{totalEmployees}</p>
              <p className="text-purple-500 text-xs mt-1 font-medium">Working</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-orange-600 text-xs font-semibold uppercase tracking-wide">Exp</p>
                <FaChartLine className="text-orange-400 text-sm" />
              </div>
              <p className="text-3xl font-bold text-orange-700 mt-1">3.5</p>
              <p className="text-orange-500 text-xs mt-1 font-medium">Avg Years</p>
            </div>
          </div>

          {/* Search Bar - Full width with proper spacing */}
          <div className="mb-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name, ID or department..."
                className="lg:w-full sm:w-30  pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Department Filter - Scrollable but fully visible */}
          <div className="mb-6 overflow-x-visible pb-2 ">
            <div className="flex flex-wrap gap-2 min-w-ma">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                    selectedDepartment === dept
                      ? 'bg-gradient-to-r from-green-600 to-lime-600 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {dept === 'all' ? 'All Departments' : dept}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Employees Grid - Responsive cards with complete content */}
        <div className="max-w-7xl mx-auto">
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-400 text-base">No employees found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
              {filteredEmployees.map(emp => (
                <div key={emp._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                  
                  {/* Card Header with gradient background */}
                  <div className="bg-gradient-to-r from-green-700 to-teal-900 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {emp.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-base truncate">{emp.name}</h3>
                        <p className="text-white/70 text-xs truncate">ID: {emp.employeeId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body - All content visible with proper spacing */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <FaBriefcase className="text-blue-500 flex-shrink-0 text-sm" />
                      <span className="text-gray-500 w-16 font-medium">Role:</span>
                      <span className="text-gray-800 flex-1 truncate font-medium">{emp.role}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FaBuilding className="text-purple-500 flex-shrink-0 text-sm" />
                      <span className="text-gray-500 w-16 font-medium">Dept:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDepartmentColor(emp.department)}`}>
                        {emp.department}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FaPhone className="text-green-500 flex-shrink-0 text-sm" />
                      <span className="text-gray-500 w-16 font-medium">Mobile:</span>
                      <span className="text-gray-800 truncate">{emp.mobileNumber}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <FaEnvelope className="text-red-500 flex-shrink-0 text-sm mt-0.5" />
                      <span className="text-gray-500 w-16 font-medium">Email:</span>
                      <span className="text-gray-800 break-all flex-1 text-sm">{emp.emailId}</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex gap-3 p-4 bg-gray-50 border-t border-gray-100">
                    <button 
                      onClick={() => handleEdit(emp)} 
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <FaEdit size={13} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(emp._id)} 
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTrash size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Employee Modal - Fully visible on all devices */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full sm:max-w-2xl lg:max-w-3xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-700 to-teal-900 px-6 py-4 sticky top-0 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Personal Information Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUser className="text-green-600" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input 
                      type="text"
                      name="employeeId" 
                      placeholder="Employee ID *" 
                      className="input-field" 
                      value={formData.employeeId} 
                      onChange={handleInputChange} 
                      required 
                    />
                    <input 
                      type="text"
                      name="name" 
                      placeholder="Full Name *" 
                      className="input-field" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      required 
                    />
                    <input 
                      type="text"
                      name="fatherName" 
                      placeholder="Father's Name" 
                      className="input-field" 
                      value={formData.fatherName} 
                      onChange={handleInputChange} 
                    />
                    <input 
                      type="email"
                      name="emailId" 
                      placeholder="Email Address *" 
                      className="input-field" 
                      value={formData.emailId} 
                      onChange={handleInputChange} 
                      required 
                    />
                    <input 
                      type="tel"
                      name="mobileNumber" 
                      placeholder="Mobile Number *" 
                      className="input-field" 
                      value={formData.mobileNumber} 
                      onChange={handleInputChange} 
                      required 
                    />
                    <input 
                      type="date" 
                      name="dateOfBirth" 
                      className="input-field" 
                      value={formData.dateOfBirth} 
                      onChange={handleInputChange} 
                    />
                    <textarea 
                      name="address" 
                      placeholder="Residential Address" 
                      rows="2" 
                      className="input-field md:col-span-2" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaBriefcase className="text-purple-600" /> Professional Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input 
                      type="text"
                      name="role" 
                      placeholder="Job Role / Designation *" 
                      className="input-field" 
                      value={formData.role} 
                      onChange={handleInputChange} 
                      required 
                    />
                    <input 
                      type="text"
                      name="department" 
                      placeholder="Department *" 
                      className="input-field" 
                      value={formData.department} 
                      onChange={handleInputChange} 
                      required 
                    />
                    <input 
                      type="number"
                      name="salary" 
                      placeholder="Monthly Salary *" 
                      className="input-field" 
                      value={formData.salary} 
                      onChange={handleInputChange} 
                      required 
                    />
                    <input 
                      type="date" 
                      name="dateOfJoining" 
                      className="input-field" 
                      value={formData.dateOfJoining} 
                      onChange={handleInputChange} 
                    />
                    <input 
                      type="text"
                      name="reportingManager" 
                      placeholder="Reporting Manager" 
                      className="input-field" 
                      value={formData.reportingManager} 
                      onChange={handleInputChange} 
                    />
                    <input 
                      type="text"
                      name="headQuarter" 
                      placeholder="Head Quarter / Location" 
                      className="input-field" 
                      value={formData.headQuarter} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>

                {/* Bank Details Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUniversity className="text-green-600" /> Bank Account Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input 
                      type="text"
                      name="bankName" 
                      placeholder="Bank Name" 
                      className="input-field" 
                      value={formData.bankName} 
                      onChange={handleInputChange} 
                    />
                    <input 
                      type="text"
                      name="accountNo" 
                      placeholder="Account Number" 
                      className="input-field" 
                      value={formData.accountNo} 
                      onChange={handleInputChange} 
                    />
                    <input 
                      type="text"
                      name="ifsc" 
                      placeholder="IFSC Code" 
                      className="input-field" 
                      value={formData.ifsc} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-gradient-to-r from-green-700 to-teal-900 hover:from-green-800 hover:to-teal-950 text-white rounded-xl font-semibold text-sm shadow-md transition-all"
                  >
                    {editingEmployee ? 'Update Employee' : 'Create Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .input-field {
          padding: 11px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.2s;
          background-color: white;
          width: 100%;
        }
        .input-field:focus {
          outline: none;
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }
        .input-field::placeholder {
          color: #94a3b8;
        }
        
        @media screen and (max-width: 768px) {
          input, textarea, select, button {
            font-size: 16px !important;
          }
        }
        
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default HREmployees;