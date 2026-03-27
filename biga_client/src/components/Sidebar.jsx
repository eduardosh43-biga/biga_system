import { Home, Package, ShoppingCart, ChefHat, TrendingUp, LayoutGrid } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Resumen' },
    { id: 'orders', icon: <ShoppingCart size={20} />, label: 'Pedidos' },
    { id: 'kitchen', icon: <ChefHat size={20} />, label: 'Cocina' },
    { id: 'inventory', icon: <Package size={20} />, label: 'Inventario' },
    { id: 'costs', icon: <TrendingUp size={20} />, label: 'Costos y Menú' },
    { id: 'tables', icon: <LayoutGrid size={20} />, label: 'Mesas' },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-black text-red-500 tracking-tighter">BIGA PIZZA</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Gestión de Inventario</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <p className="text-sm text-gray-500">Tacna, Perú • 2026</p>
      </div>
    </div>
  );
};

export default Sidebar;