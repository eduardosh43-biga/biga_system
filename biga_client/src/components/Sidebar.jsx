import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const activeStyle = "bg-red-600 text-white shadow-md";
  const idleStyle = "text-gray-800 hover:bg-gray-100";

  return (
    <aside className="w-64 bg-orange-200 h-screen fixed left-0 top-0 border-r border-gray-200 p-6">
      <h1 className="text-2xl font-black text-red-600 mb-10">BIGA PIZZA</h1>
      
      <nav className="space-y-2">
        <NavLink 
          to="/orders" 
          className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${isActive ? activeStyle : idleStyle}`}
        >
          <span>📋</span> Pedidos
        </NavLink>
        <NavLink
          to="/kitchen"
          className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${isActive ? activeStyle : idleStyle}`}
        >
          <span>🔪</span> Cocina
        </NavLink>
        <NavLink 
          to="/inventory" 
          className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${isActive ? activeStyle : idleStyle}`}
        >
          <span>📦</span> Inventario
        </NavLink>

        <NavLink 
          to="/costs" 
          className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${isActive ? activeStyle : idleStyle}`}
        >
          <span>🍕</span> Costos y Menú
        </NavLink>        
      </nav>
    </aside>
  );
};

export default Sidebar;