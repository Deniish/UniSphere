// ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken'); // or your auth logic

  useEffect(() => {
    if (!token) {
      toast.error(
        <div>
          Access Denied! <br /> Please Login to Access Home page
        </div>
      );
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
