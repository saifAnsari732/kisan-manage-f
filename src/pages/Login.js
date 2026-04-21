import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaLeaf } from 'react-icons/fa';

const Login = () => {
  const [credentials, setCredentials] = useState({
    employeeId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(credentials.employeeId, credentials.password);
      toast.success(`Welcome back, ${data.employee?.name || 'User'}!`);
      
      if (data.role === 'hr' || data.role === 'admin') {
        navigate('/hr/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.08)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.06)_0%,transparent_50%)]"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        
        {/* Floating Pattern */}
        <svg className="absolute bottom-0 left-0 w-full opacity-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#22c55e" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 py-8 sm:py-12">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 animate-fade-in-up border border-white/20">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-lg shadow-green-500/30 animate-float">
                <FaLeaf className="text-white text-xl sm:text-2xl" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                Kisan Group
              </h1>
            </div>
            <p className="text-gray-500 text-sm sm:text-base font-medium">Employee Management System</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="employeeId" className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
                <FaUser className="text-green-600 text-xs sm:text-sm" />
                Employee ID
              </label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                value={credentials.employeeId}
                onChange={handleChange}
                placeholder="Enter your Employee ID"
                required
                autoComplete="username"
                className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="password" className="flex items-center gap-2 text-gray-700 font-semibold text-sm sm:text-base">
                <FaLock className="text-green-600 text-xs sm:text-sm" />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm sm:text-base"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-gray-100">
            <p className="text-center text-gray-600 text-xs sm:text-sm font-semibold mb-3">Demo Credentials:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2.5 sm:p-3 rounded-xl text-center">
                <strong className="text-green-700 text-xs sm:text-sm block mb-1">HR/Admin:</strong>
                <span className="text-gray-600 text-xs font-mono">KG001 / admin123</span>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-2.5 sm:p-3 rounded-xl text-center">
                <strong className="text-blue-700 text-xs sm:text-sm block mb-1">Employee:</strong>
                <span className="text-gray-600 text-xs font-mono">KG002 / employee123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-6 sm:mt-8">
          <p className="text-gray-400 text-xs sm:text-sm">&copy; 2024 Kisan Group. All rights reserved.</p>
        </footer>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Login;