import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                
                localStorage.setItem('token', data.token);                
                localStorage.setItem('user', JSON.stringify(data.user));                
                navigate('/orders');
            } else {
                setError(data.error || 'Credenciales inválidas');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        }
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-gray-200 relative overflow-hidden p-6"
        >
            <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] w-full max-w-md z-10 border-2 border-slate-100">
                <div className="text-center mb-10">
                    <h1 className="text-6xl font-black italic text-[#1a1a1a] tracking-tighter">
                        BIGA<span className="text-[#f5821f]">.</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-3">Pizzería Artesanal</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-xs font-black uppercase tracking-widest border border-red-100 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-4">Email</label>
                        <input
                            type="email"
                            className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-[#f5821f] outline-none transition-all font-bold text-[#1a1a1a] placeholder-slate-400"
                            placeholder="admin@biga.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-4">Contraseña</label>
                        <input
                            type="password"
                            className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-[#f5821f] outline-none transition-all font-bold text-[#1a1a1a] placeholder-slate-400"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={{ backgroundColor: '#f5821f' }}
                        className="w-full text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#1a1a1a] shadow-2xl shadow-orange-500/20 transition-all active:scale-95 text-sm"
                    >
                        Ingresar al Sistema
                    </button>
                </form>
                
                <p className="text-center mt-10 text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
                    &copy; 2026 BIGA · Central de Pedidos
                </p>
            </div>
        </div>
    );
};

export default Login;