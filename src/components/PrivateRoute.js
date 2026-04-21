import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requireHR = false }) => {
  const { isAuthenticated, isHR, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--bg-secondary)'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid var(--primary-200)',
          borderTop: '4px solid var(--primary-600)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireHR && !isHR) {
    return <Navigate to="/employee/dashboard" />;
  }

  return children;
};

export default PrivateRoute;
