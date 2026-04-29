import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, ChefHat, Package, Utensils, LogOut, Users } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'waiter';

  const menuOptions = [
    { 
      id: 'dashboard', 
      title: 'Dashboard', 
      desc: 'Análisis de ventas y rentabilidad', 
      icon: <LayoutDashboard size={40} />, 
      path: '/dashboard', 
      roles: ['admin'],
      color: 'bg-blue-500'
    },
    { 
      id: 'staff', 
      title: 'Equipo Staff', 
      desc: 'Gestión de usuarios y accesos', 
      icon: <Users size={40} />, 
      path: '/staff', 
      roles: ['admin'],
      color: 'bg-indigo-600'
    },
    { 
      id: 'orders', 
      title: 'Pedidos', 
      desc: 'Gestión de comandas y ventas', 
      icon: <ClipboardList size={40} />, 
      path: '/orders', 
      roles: ['admin', 'waiter'],
      color: 'bg-biga-orange'
    },
    { 
      id: 'kitchen', 
      title: 'Cocina', 
      desc: 'Órdenes pendientes por preparar', 
      icon: <ChefHat size={40} />, 
      path: '/kitchen', 
      roles: ['admin', 'cook'],
      color: 'bg-red-500'
    },
    { 
      id: 'inventory', 
      title: 'Inventario', 
      desc: 'Control de insumos y stock', 
      icon: <Package size={40} />, 
      path: '/inventory', 
      roles: ['admin'],
      color: 'bg-slate-700'
    },
    { 
      id: 'menu', 
      title: 'Menú y Costos', 
      desc: 'Configuración de platos y precios', 
      icon: <Utensils size={40} />, 
      path: '/costs', 
      roles: ['admin'],
      color: 'bg-emerald-600'
    }
  ];

  const allowedOptions = menuOptions.filter(option => option.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-210 p-6 lg:p-12 flex flex-col justify-center">
      <header className="max-w-6xl w-full mx-auto mb-8 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-5xl font-black text-biga-dark italic tracking-tighter uppercase leading-none">
            Hola, {user.name?.split(' ')[0]}<span className="text-biga-orange">!</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">Bienvenido al Sistema Central de BIGA</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-black uppercase text-[10px] tracking-widest transition-colors"
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </header>

      <main className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {allowedOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => navigate(option.path)}
            className="group relative bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/60 border border-slate-100 text-left transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] overflow-hidden flex items-center gap-6"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${option.color} opacity-[0.03] -mr-6 -mt-6 rounded-full transition-all group-hover:scale-150`}></div>
            
            <div className={`${option.color} text-white w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:rotate-3`}>
              {React.cloneElement(option.icon, { size: 32 })}
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-black text-biga-dark uppercase italic tracking-tighter leading-tight">{option.title}</h3>
              <p className="text-slate-400 font-bold text-[10px] uppercase leading-relaxed mt-1">{option.desc}</p>
            </div>
            
            <div className="text-biga-orange opacity-0 group-hover:opacity-100 transition-opacity pr-2">
              <span className="text-xl">→</span>
            </div>
          </button>
        ))}
      </main>

      <footer className="max-w-6xl w-full mx-auto mt-12 text-center shrink-0">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">BIGA PIZZERIA · GESTIÓN INTEGRAL</p>
      </footer>
    </div>
  );
};

export default Home;