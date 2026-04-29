/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, FaBriefcase, FaCalendarAlt, FaMoneyBillWave, FaUniversity, FaCreditCard, FaTimes } from 'react-icons/fa';

const HREmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    fatherName: '',
    role: '',
    department: '',
    headQuarter: '',
    dateOfJoining: '',
    dateOfBirth: '',
    reportingManager: '',
    mobileNumber: '',
    emailId: '',
    officialEmailId: '',
    address: '',
    salary: '',
    password: 'password123',
    bankName: '',
    accountNo: '',
    ifsc: ''
  });

  const departments = ['all', 'Engineering', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    let filtered = employees.filter(emp =>
      (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      dateOfJoining: format(new Date(emp.dateOfJoining), 'yyyy-MM-dd'),
      dateOfBirth: format(new Date(emp.dateOfBirth), 'yyyy-MM-dd'),
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
      employeeId: '',
      name: '',
      fatherName: '',
      role: '',
      department: '',
      headQuarter: '',
      dateOfJoining: '',
      dateOfBirth: '',
      reportingManager: '',
      mobileNumber: '',
      emailId: '',
      officialEmailId: '',
      address: '',
      salary: '',
      password: 'password123',
      bankName: '',
      accountNo: '',
      ifsc: ''
    });
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      Engineering: 'bg-blue-100 text-blue-700',
      HR: 'bg-purple-100 text-purple-700',
      Sales: 'bg-green-100 text-green-700',
      Marketing: 'bg-pink-100 text-pink-700',
      Finance: 'bg-yellow-100 text-yellow-700',
      Operations: 'bg-indigo-100 text-indigo-700'
    };
    return colors[dept] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading employees...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-teal-900 bg-clip-text text-transparent">
                Employee Management
              </h1>
              <p className="text-gray-500 mt-2">Manage and track all employee records</p>
            </div>
            
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-700 to-teal-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <FaPlus className="group-hover:rotate-90 transition-transform duration-200" />
              Add New Employee
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
              <p className="text-blue-600 text-sm font-semibold">Total Employees</p>
              <p className="text-3xl font-bold text-blue-700">{employees.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
              <p className="text-green-600 text-sm font-semibold">Departments</p>
              <p className="text-3xl font-bold text-green-700">{new Set(employees.map(e => e.department)).size}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
              <p className="text-purple-600 text-sm font-semibold">Active Employees</p>
              <p className="text-3xl font-bold text-purple-700">{employees.length}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200">
              <p className="text-orange-600 text-sm font-semibold">Avg. Experience</p>
              <p className="text-3xl font-bold text-orange-700">3.5 yrs</p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search by name, ID, or department..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedDepartment === dept
                      ? 'bg-gradient-to-r from-green-600 to-lime-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Employees Grid */}
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-400 text-lg">No employees found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map(emp => (
              <div key={emp._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-green-700 to-teal-900 p-4 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-xl font-bold border-2 border-white/30">
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg">{emp.name}</h3>
                      <p className="text-white/80 text-sm">{emp.employeeId}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FaBriefcase className="text-blue-500 text-xs" />
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium text-gray-800">{emp.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaBuilding className="text-purple-500 text-xs" />
                      <span className="text-gray-600">Dept:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDepartmentColor(emp.department)}`}>
                        {emp.department}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaPhone className="text-green-500 text-xs" />
                      <span className="text-gray-600">Mobile:</span>
                      <span className="text-gray-800">{emp.mobileNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaEnvelope className="text-red-800 text-xs" />
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-800 truncate">{emp.emailId}</span>
                    </div>
                  </div>

                  {/* Bank Details */}
                  {(emp.bankName || emp.accountNo) && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 mb-2">BANK DETAILS</p>
                      <div className="space-y-1 text-xs">
                        {emp.bankName && <p className="text-gray-600"><span className="font-medium">Bank:</span> {emp.bankName}</p>}
                        {emp.accountNo && <p className="text-gray-600"><span className="font-medium">A/C:</span> ••••{emp.accountNo.slice(-4)}</p>}
                        {emp.ifsc && <p className="text-gray-600"><span className="font-medium">IFSC:</span> {emp.ifsc}</p>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-4 bg-gray-50 flex gap-2">
                  <button 
                    onClick={() => handleEdit(emp)} 
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    <FaEdit size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(emp._id)} 
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-600 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    <FaTrash size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-white/80 hover:text-white transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUser className="text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input name="employeeId" placeholder="Employee ID *" className="input" value={formData.employeeId} onChange={handleInputChange} required />
                    <input name="name" placeholder="Full Name *" className="input" value={formData.name} onChange={handleInputChange} required />
                    <input name="fatherName" placeholder="Father's Name" className="input" value={formData.fatherName} onChange={handleInputChange} />
                    <input name="emailId" placeholder="Personal Email *" type="email" className="input" value={formData.emailId} onChange={handleInputChange} required />
                    <input name="officialEmailId" placeholder="Official Email" type="email" className="input" value={formData.officialEmailId} onChange={handleInputChange} />
                    <input name="mobileNumber" placeholder="Mobile Number *" className="input" value={formData.mobileNumber} onChange={handleInputChange} required />
                    <input type="date" name="dateOfBirth" className="input" value={formData.dateOfBirth} onChange={handleInputChange} />
                    <textarea name="address" placeholder="Address" rows="2" className="input md:col-span-2 lg:col-span-3" value={formData.address} onChange={handleInputChange} />
                  </div>
                </div>

                {/* Professional Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaBuilding className="text-purple-600" />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input name="employeeId" placeholder="Employee ID *" className="input" value={formData.employeeId} onChange={handleInputChange} required />
                    <input name="role" placeholder="Job Role *" className="input" value={formData.role} onChange={handleInputChange} required />
                    <input name="department" placeholder="Department *" className="input" value={formData.department} onChange={handleInputChange} required />
                    <input name="headQuarter" placeholder="Head Quarter" className="input" value={formData.headQuarter} onChange={handleInputChange} />
                    <input name="reportingManager" placeholder="Reporting Manager" className="input" value={formData.reportingManager} onChange={handleInputChange} />
                    <input type="date" name="dateOfJoining" className="input" value={formData.dateOfJoining} onChange={handleInputChange} />
                    <input name="salary" placeholder="Salary *" type="number" className="input" value={formData.salary} onChange={handleInputChange} required />
                  </div>
                </div>

                {/* Bank Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUniversity className="text-green-600" />
                    Bank Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input name="bankName" placeholder="Bank Name" className="input" value={formData.bankName} onChange={handleInputChange} />
                    <input name="accountNo" placeholder="Account Number" className="input" value={formData.accountNo} onChange={handleInputChange} />
                    <input name="ifsc" placeholder="IFSC Code" className="input" value={formData.ifsc} onChange={handleInputChange} />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-md transition-all"
                  >
                    {editingEmployee ? 'Update Employee' : 'Create Employee'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>
        {`
          .input {
            padding: 10px 12px;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            font-size: 14px;
            transition: all 0.2s;
            background-color: white;
          }
          .input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          .input::placeholder {
            color: #94a3b8;
          }
        `}
      </style>
    </div>
  );
};

export default HREmployees;