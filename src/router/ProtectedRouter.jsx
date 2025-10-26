
//src/router/ProtectedRouter.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/auth/authContext';

export default function ProtectedRouter({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return children;
}