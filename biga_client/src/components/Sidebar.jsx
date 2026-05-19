import { NavLink, useNavigate, Link } from 'react-router-dom';
import { X, LogOut, LayoutDashboard, ClipboardList, Utensils, Box, Pizza, Users } from 'lucide-react';

const Sidebar = ({ isMobile = false, onClose }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    if (onClose) onClose();
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, adminOnly: true },
    { to: "/orders", label: "Pedidos", icon: <ClipboardList size={20} /> },
    { to: "/kitchen", label: "Cocina", icon: <Utensils size={20} /> },
    { to: "/inventory", label: "Inventario", icon: <Box size={20} />, adminOnly: true },
    { to: "/costs", label: "Costos y Menú", icon: <Pizza size={20} />, adminOnly: true },
    { to: "/staff", label: "Staff", icon: <Users size={20} />, adminOnly: true },
  ];

  return (
    <aside className={`
      bg-[#1a1a1a] h-screen border-r border-white/10 p-6 flex flex-col justify-between shadow-2xl z-50
      ${isMobile ? 'w-full' : 'w-64 fixed left-0 top-0'}
    `}>
      <div>
        <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-4">
          <Link to="/" onClick={onClose} className="group transition-colors">
            <h1 className="text-4xl font-black text-white italic tracking-tighter leading-none group-hover:scale-105 transition-transform origin-left">
              BIGA<span className="text-biga-orange text-5xl">.</span>
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 group-hover:text-slate-300 transition-colors">Pizzería Artesanal</p>
          </Link>
          {isMobile && (
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="space-y-2">
          {navItems.map(item => {
            if (item.adminOnly && user.role !== 'admin') return null;
            return (
              <NavLink 
                key={item.to}
                to={item.to} 
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-4 p-3 rounded-2xl font-bold transition-all duration-300
                  ${isActive 
                    ? 'bg-biga-orange text-white shadow-lg shadow-orange-500/20 scale-105' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                `}
              >
                {item.icon} {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-4 p-3 rounded-2xl font-bold text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-all mt-auto border border-white/5 group"
      >
        <LogOut className="group-hover:rotate-12 transition-transform" size={20} /> 
        Cerrar Sesión
      </button>
    </aside>
  );
};

export default Sidebar;
