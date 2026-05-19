import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';

// Componentes
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ToastContainer';

// Páginas
import Inventory from './pages/inventory/Inventory';
import MenuPage from './pages/menu/Menu';
import Orders from './pages/orders/Orders';
import OrdersNew from './pages/orders/OrdersNew';
import Kitchen from './pages/kitchen/Kitchen';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/home/Home';
import Staff from './pages/staff/Staff';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen text-slate-900 no-scrollbar bg-slate-200">
      <ToastContainer />
      
      {/* Sidebar Desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Sidebar Mobile Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 animate-in slide-in-from-left duration-300">
            <Sidebar isMobile={true} onClose={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Mobile */}
        <header className="lg:hidden bg-biga-dark p-4 flex justify-between items-center shadow-lg">
          <h1 className="text-2xl font-black text-white italic tracking-tighter">
            BIGA<span className="text-biga-orange">.</span>
          </h1>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 bg-white/5 rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 no-scrollbar overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/orders/new" element={<OrdersNew />} />
          
          <Route element={<Layout />}>
            <Route path="/orders" element={<Orders />} />
            <Route path="/kitchen" element={<Kitchen />} />

            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/costs" element={<MenuPage />} />
              <Route path="/staff" element={<Staff />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
