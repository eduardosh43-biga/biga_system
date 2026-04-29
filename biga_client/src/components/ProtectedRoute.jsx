import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  // 1. Verificación básica: ¿Existe el token?
  if (!token || token === "undefined" || token === "") {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  // 2. Verificación de Administrador
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/orders" replace />;
  }

  // 2. Escuchar errores 401 globalmente (Opcional pero recomendado)
  // Esto detecta si alguna petición falla por token expirado mientras navegas
  useEffect(() => {
    const handleUnauthorized = (event) => {
      if (event.detail?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    window.addEventListener('unauthorized-error', handleUnauthorized);
    return () => window.removeEventListener('unauthorized-error', handleUnauthorized);
  }, [navigate]);

  return <Outlet />;
};

export default ProtectedRoute;