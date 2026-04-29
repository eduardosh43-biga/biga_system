import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, User, ChefHat, Mail, Lock, X } from 'lucide-react';
import api from '../../assets/services/api';

const Staff = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'waiter'
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api('/users');
      if (res && res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Error cargando staff:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api('/users', {
        method: 'POST',
        body: { user: formData }
      });
      if (res && res.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'waiter' });
        await fetchUsers();
      } else if (res) {
        const data = await res.json();
        setError(data.errors?.join(", ") || "Error al crear usuario");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar a este miembro del staff? Perderá acceso inmediato.")) {
      try {
        const res = await api(`/users/${id}`, { method: 'DELETE' });
        if (res && res.ok) {
          await fetchUsers();
        } else if (res) {
          const data = await res.json();
          alert(data.errors || "No se pudo eliminar");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="text-red-500" size={16} />;
      case 'cook': return <ChefHat className="text-orange-500" size={16} />;
      default: return <User className="text-blue-500" size={16} />;
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse">CARGANDO EQUIPO...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-end mb-12 border-b-2 border-slate-100 pb-8">
        <div>
          <h1 className="text-5xl font-black text-biga-dark tracking-tighter uppercase italic">
            Staff<span className="text-biga-orange">.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-3">Gestión de Accesos y Equipo</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: '#f5821f' }}
          className="text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-[#1a1a1a] transition-all flex items-center gap-3 uppercase text-xs active:scale-95"
        >
          <UserPlus size={20} /> Nuevo Miembro
        </button>
      </header>

      <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center w-20">Rol</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Fecha Ingreso</th>
              <th className="p-6 text-center w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-6">
                  <div className="flex justify-center">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                      {getRoleIcon(user.role)}
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <p className="font-black text-biga-dark uppercase italic tracking-tighter text-lg leading-tight">{user.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                </td>
                <td className="p-6 font-bold text-slate-500 text-sm">{user.email}</td>
                <td className="p-6 font-bold text-slate-300 text-xs uppercase">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="p-6 text-center">
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL NUEVO USUARIO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-biga-dark/90 backdrop-blur-md z-[500] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl border-4 border-biga-orange/20 overflow-hidden relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-biga-dark transition-colors">
              <X size={24} />
            </button>
            
            <form onSubmit={handleSubmit} className="p-12">
              <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-biga-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🍕</div>
                <h3 className="text-3xl font-black text-biga-dark uppercase italic tracking-tighter">Nuevo Miembro</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Registrar acceso al sistema</p>
              </div>

              {error && <p className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold text-center border border-red-100">{error}</p>}

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-4 tracking-widest">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required
                      type="text" 
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-biga-orange focus:bg-white outline-none font-bold transition-all"
                      placeholder="Ej: Juan Perez"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-4 tracking-widest">Email Corporativo</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required
                      type="email" 
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-biga-orange focus:bg-white outline-none font-bold transition-all"
                      placeholder="email@biga.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-4 tracking-widest">Contraseña Inicial</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required
                      type="password" 
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-biga-orange focus:bg-white outline-none font-bold transition-all"
                      placeholder="Min 6 caracteres"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-4 tracking-widest">Rol en el Equipo</label>
                  <select 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-biga-orange focus:bg-white outline-none font-bold transition-all appearance-none cursor-pointer"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="waiter">Mesero / Ventas</option>
                    <option value="cook">Cocinero</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                style={{ backgroundColor: '#f5821f' }}
                className="w-full mt-10 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-biga-dark transition-all active:scale-95"
              >
                Crear Miembro del Staff
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;