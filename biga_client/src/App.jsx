import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Componentes
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import Inventory from './pages/inventory/Inventory';
import Menu from './pages/menu/Menu';
import Orders from './pages/orders/Orders';
import OrdersNew from './pages/orders/OrdersNew';
import Kitchen from './pages/kitchen/Kitchen';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';

// El Layout mantiene el Sidebar fijo
const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 no-scrollbar">
      <Sidebar />
      <main className="flex-1 ml-64 p-2 no-scrollbar">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta Pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          {/* Rutas con Sidebar */}
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/costs" element={<Menu />} />
            <Route path="/kitchen" element={<Kitchen />} />
          </Route>

          {/* Ruta para el punto de venta (sin Sidebar pero protegida) */}
          <Route path="/orders/new" element={<OrdersNew />} />
        </Route>

        {/* Redirigir cualquier otra ruta no definida al inicio o login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;