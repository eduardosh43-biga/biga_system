import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const activeStyle = "bg-biga-orange text-white shadow-lg shadow-biga-orange/20 scale-105";
  const idleStyle = "text-slate-400 hover:bg-white/5 hover:text-white";

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#1a1a1a] h-screen fixed left-0 top-0 border-r border-white/10 p-6 flex flex-col justify-between z-40 shadow-2xl">
      <div>
        <div className="mb-12 px-2 border-b border-white/5 pb-6">
          <h1 className="text-4xl font-black text-white italic tracking-tighter leading-none">
            BIGA<span className="text-[#f5821f] text-5xl">.</span>
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Pizzería Artesanal</p>
        </div>

        <nav className="space-y-4">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 ${isActive ? 'bg-[#f5821f] text-white shadow-lg shadow-orange-500/20 scale-105' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="text-xl">📊</span> Dashboard
          </NavLink>
          <NavLink 
            to="/orders" 
            className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 ${isActive ? 'bg-[#f5821f] text-white shadow-lg shadow-orange-500/20 scale-105' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="text-xl">📋</span> Pedidos
          </NavLink>
          <NavLink
            to="/kitchen"
            className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 ${isActive ? 'bg-[#f5821f] text-white shadow-lg shadow-orange-500/20 scale-105' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="text-xl">🔪</span> Cocina
          </NavLink>
          <NavLink 
            to="/inventory" 
            className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 ${isActive ? 'bg-[#f5821f] text-white shadow-lg shadow-orange-500/20 scale-105' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="text-xl">📦</span> Inventario
          </NavLink>

          <NavLink 
            to="/costs" 
            className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 ${isActive ? 'bg-[#f5821f] text-white shadow-lg shadow-orange-500/20 scale-105' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="text-xl">🍕</span> Costos y Menú
          </NavLink>        
        </nav>
      </div>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-4 p-4 rounded-2xl font-bold text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-all mt-auto border border-white/5 group"
      >
        <span className="group-hover:rotate-12 transition-transform">🚪</span> Cerrar Sesión
      </button>
    </aside>
  );};
export default Sidebar;
