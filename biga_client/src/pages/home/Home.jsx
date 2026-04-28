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
    <div className="min-h-screen bg-slate-300 p-8 lg:p-16">
      <header className="max-w-6xl mx-auto mb-16 flex justify-between items-center">
        <div>
          <h1 className="text-6xl font-black text-biga-dark italic tracking-tighter uppercase">
            Hola, {user.name?.split(' ')[0]}<span className="text-biga-orange">!</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.4em] mt-4">Bienvenido al Sistema Central de BIGA</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-black uppercase text-[10px] tracking-widest transition-colors"
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allowedOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => navigate(option.path)}
            className="group relative bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-left transition-all hover:scale-105 hover:shadow-2xl active:scale-95 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${option.color} opacity-[0.03] -mr-8 -mt-8 rounded-full transition-all group-hover:scale-150`}></div>
            
            <div className={`${option.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-transform group-hover:rotate-6`}>
              {option.icon}
            </div>
            
            <h3 className="text-2xl font-black text-biga-dark uppercase italic tracking-tighter mb-2">{option.title}</h3>
            <p className="text-slate-400 font-bold text-xs uppercase leading-relaxed">{option.desc}</p>
            
            <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-biga-orange opacity-0 group-hover:opacity-100 transition-opacity">
              Entrar al módulo <span>→</span>
            </div>
          </button>
        ))}
      </main>

      <footer className="max-w-6xl mx-auto mt-20 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">BIGA PIZZERIA · GESTIÓN INTEGRAL</p>
      </footer>
    </div>
  );
};

export default Home;