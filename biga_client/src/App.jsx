import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Componentes
import Sidebar from './components/Sidebar';

// Páginas (Basado en tu nueva estructura de carpetas)
import Inventory from './pages/inventory/Inventory';
import Menu from './pages/menu/Menu';
import Orders from './pages/orders/Orders';
import OrdersNew from './pages/orders/OrdersNew';
import Kitchen from './pages/kitchen/Kitchen';


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
        {/* Usamos el Layout para las páginas con Sidebar */}
        <Route element={<Layout />}>
          {/* CAMBIO CLAVE: Si entras a "/", te manda a "/orders" */}
          <Route path="/" element={<Navigate to="/orders" replace />} />
          
          <Route path="/orders" element={<Orders />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/costs" element={<Menu />} />
          <Route path="/kitchen" element={<Kitchen />} />
        </Route>

        {/* Ruta para el punto de venta (sin Sidebar) */}
        <Route path="/orders/new" element={<OrdersNew />} />
      </Routes>
    </Router>
  );
}

export default App;