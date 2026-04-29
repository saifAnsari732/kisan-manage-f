/* eslint-disable react-hooks/exhaustive-deps */
// HREmployees.js
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';

const HREmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  
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
    cugNumber: '',
    mobileNumber: '',
    emailId: '',
    officialEmailId: '',
    address: '',
    salary: '',
    password: 'password123'
  });

  const departments = ['Telecaller', 'Marketing', 'Developer', 'Graphic Designer', 'Editor'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, filterDepartment]);

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/employees');
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDepartment) {
      filtered = filtered.filter(emp => emp.department === filterDepartment);
    }

    setFilteredEmployees(filtered);
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
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee._id}`, formData);
        toast.success('Employee updated successfully');
      } else {
        await api.post('/employees', formData);
        toast.success('Employee created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      ...employee,
      dateOfJoining: format(new Date(employee.dateOfJoining), 'yyyy-MM-dd'),
      dateOfBirth: format(new Date(employee.dateOfBirth), 'yyyy-MM-dd')
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        toast.success('Employee deleted successfully');
        fetchEmployees();
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const resetForm = () => {
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
      cugNumber: '',
      mobileNumber: '',
      emailId: '',
      officialEmailId: '',
      address: '',
      salary: '',
      password: 'password123'
    });
    setEditingEmployee(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">Employee Management</h1>
          <p className="text-sm sm:text-base text-gray-500">Manage all employees across departments</p>
        </div>
        <button 
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <FaPlus className="text-sm" /> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8 animate-fade-in-up">
        <div className="flex-1 flex items-center gap-3 bg-white p-3 sm:p-3.5 rounded-xl border-2 border-gray-100 focus-within:border-green-500 focus-within:shadow-lg focus-within:shadow-green-100 transition-all duration-200">
          <FaSearch className="text-green-600 text-sm sm:text-base" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="flex-1 outline-none bg-transparent text-gray-900 text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 flex items-center gap-3 bg-white p-3 sm:p-3.5 rounded-xl border-2 border-gray-100 focus-within:border-green-500 focus-within:shadow-lg focus-within:shadow-green-100 transition-all duration-200">
          <FaFilter className="text-green-600 text-sm sm:text-base" />
          <select 
            className="flex-1 outline-none bg-transparent text-gray-900 text-sm sm:text-base"
            value={filterDepartment} 
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center px-4 sm:px-5 py-3 bg-green-50 text-green-800 rounded-xl font-semibold text-sm sm:text-base">
          {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'}
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in-up delay-100">
        {filteredEmployees.map((employee, index) => (
          <div 
            key={employee._id} 
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-green-200 animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex gap-3 sm:gap-4 pb-3 sm:pb-5 border-b-2 border-gray-100 mb-3 sm:mb-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-xl sm:text-2xl font-bold text-white flex-shrink-0 border-3 border-green-100">
                {employee.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{employee.name}</h3>
                <p className="text-gray-500 text-xs sm:text-sm font-mono mt-0.5">{employee.employeeId}</p>
                <span className="inline-block mt-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md text-xs font-semibold">
                  {employee.department}
                </span>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
              <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                <span className="text-gray-500 flex-shrink-0">Role:</span>
                <strong className="text-gray-900 text-right truncate">{employee.role}</strong>
              </div>
              <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                <span className="text-gray-500 flex-shrink-0">HQ:</span>
                <strong className="text-gray-900 text-right truncate">{employee.headQuarter}</strong>
              </div>
              <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                <span className="text-gray-500 flex-shrink-0">Manager:</span>
                <strong className="text-gray-900 text-right truncate">{employee.reportingManager}</strong>
              </div>
              <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                <span className="text-gray-500 flex-shrink-0">Email:</span>
                <strong className="text-gray-900 text-right truncate">{employee.officialEmailId}</strong>
              </div>
              <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                <span className="text-gray-500 flex-shrink-0">Mobile:</span>
                <strong className="text-gray-900 text-right">{employee.mobileNumber}</strong>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button 
                className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 bg-blue-50 text-blue-600 rounded-lg font-semibold text-xs sm:text-sm hover:bg-blue-600 hover:text-white transition-all duration-200"
                onClick={() => handleEdit(employee)}
              >
                <FaEdit className="text-xs sm:text-sm" /> Edit
              </button>
              <button 
                className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 bg-red-50 text-red-600 rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-600 hover:text-white transition-all duration-200"
                onClick={() => handleDelete(employee._id)}
              >
                <FaTrash className="text-xs sm:text-sm" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-down" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 sm:p-6 md:p-8 border-b-2 border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
              <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 text-gray-700 text-xl sm:text-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all duration-200" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-6 md:mb-8">
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">Employee ID *</label>
                  <input
                    type="text"
                    name="employeeId"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200 bg-gray-50"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                    disabled={editingEmployee}
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">Father's Name *</label>
                  <input
                    type="text"
                    name="fatherName"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">Role *</label>
                  <input
                    type="text"
                    name="role"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">Department *</label>
                  <select
                    name="department"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">Head Quarter *</label>
                  <input
                    type="text"
                    name="headQuarter"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200"
                    value={formData.headQuarter}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">Date of Joining *</label>
                  <input
                    type="date"
                    name="dateOfJoining"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200"
                    value={formData.dateOfJoining}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">Reporting Manager *</label>
                  <input
                    type="text"
                    name="reportingManager"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200"
                    value={formData.reportingManager}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">CUG Number</label>
                  <input
                    type="text"
                    name="cugNumber"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200"
                    value={formData.cugNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">Personal Email *</label>
                  <input
                    type="email"
                    name="emailId"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200"
                    value={formData.emailId}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">Official Email *</label>
                  <input
                    type="email"
                    name="officialEmailId"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200"
                    value={formData.officialEmailId}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">Salary *</label>
                  <input
                    type="number"
                    name="salary"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2 md:col-span-2">
                  <label className="font-semibold text-gray-700 text-xs sm:text-sm">Address *</label>
                  <textarea
                    name="address"
                    className="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-100 transition-all duration-200"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 sm:gap-4 pt-4 border-t-2 border-gray-100">
                <button type="button" className="px-5 sm:px-7 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-200 transition-all duration-200" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-5 sm:px-7 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-200">
                  {editingEmployee ? 'Update Employee' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out both;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
};

export default HREmployees;