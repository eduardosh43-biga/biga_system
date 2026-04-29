import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Award, Calendar, BarChart2 } from 'lucide-react';
import api from '../../assets/services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api('/dashboard/stats');
        if (res && res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-20 text-center font-black text-slate-400 italic uppercase tracking-widest">Calculando Rentabilidad...</div>;
  if (!stats) return <div className="p-20 text-center text-red-500 font-bold">Error al cargar los datos.</div>;

  const { summary, products, metrics } = stats;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-200 min-h-screen">
      <header className="mb-6 flex justify-between items-center py-4">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            Dashboard<span className="text-biga-orange">.</span>
          </h1>
          <p className="text-slate-600 font-bold uppercase text-[10px] tracking-[0.4em] mt-1">Análisis de rendimiento mensual</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-md border border-slate-300/50 flex items-center gap-3">
          <Calendar className="text-biga-orange" size={20} />
          <span className="font-black text-xs uppercase text-slate-700">{new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</span>
        </div>
      </header>

      {/* TARJETAS PRINCIPALES (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Ingresos Totales" 
          value={`S/ ${summary.total_revenue}`} 
          icon={<DollarSign size={20} />} 
          iconBg="bg-emerald-100 text-emerald-600"
          trend={`${metrics.growth_vs_prev_month}%`}
          trendUp={metrics.growth_vs_prev_month >= 0}
        />
        <StatCard 
          title="Ganancia Neta" 
          value={`S/ ${summary.net_profit}`} 
          icon={<TrendingUp size={20} />} 
          iconBg="bg-blue-100 text-blue-600"
          subtitle="Libre de costos"
        />
        <StatCard 
          title="Pérdidas" 
          value={`S/ ${summary.total_loss}`} 
          icon={<AlertCircle size={20} />} 
          iconBg="bg-red-100 text-red-600"
          subtitle={`${Math.round((summary.total_loss / summary.total_revenue) * 100)}% de ing.`}
        />
        <StatCard 
          title="Promedio Semanal" 
          value={`S/ ${metrics.avg_weekly_sales}`} 
          icon={<BarChart2 size={20} />} 
          iconBg="bg-orange-100 text-orange-600"
          subtitle="Proyección"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TOP PRODUCTOS */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-xl border border-slate-300/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-orange-100 p-2 rounded-full">
              <Award className="text-biga-orange" size={20} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Productos Estrella</h3>
          </div>
          
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-slate-100">
                  <th className="text-left p-4">Rnk</th>
                  <th className="text-left p-4">Producto</th>
                  <th className="text-right p-4">Ventas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.top_5.map((p, i) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-black text-slate-400 group-hover:text-biga-orange">#{i+1}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold uppercase text-slate-800 tracking-tight text-sm">{p.name}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">{p.type === 'Recipe' ? 'Pizza' : 'Promo'}</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-mono text-lg font-black text-slate-900">{p.quantity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETALLES DE PÉRDIDAS */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-300/50 border-l-8 border-l-red-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-50 p-2 rounded-full">
                <AlertCircle className="text-red-600" size={18} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Fuga de Dinero</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Merma Cocina</span>
                <span className="font-mono text-base font-black text-slate-900">S/ {summary.loss_by_merma}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Consumo Personal</span>
                <span className="font-mono text-base font-black text-slate-900">S/ {summary.loss_by_personal}</span>
              </div>
              <p className="text-[9px] text-slate-500 italic text-center font-bold uppercase mt-4">
                * Costo de producción sin retorno.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-300/50 flex-1">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6 text-center italic">Baja Rotación</h4>
             <div className="space-y-4">
                {products.worst_performers.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                        <div>
                            <p className="text-[8px] font-black uppercase text-red-500 leading-none mb-1">{p.category}</p>
                            <h5 className="text-sm font-black text-slate-900 uppercase italic leading-tight">
                                {p.name || "Sin datos"}
                            </h5>
                        </div>
                        <span className="font-mono text-lg font-black text-slate-400">{p.quantity}</span>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, iconBg, trend, trendUp, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-300/50 border-t-4 border-t-orange-500 flex flex-col justify-between transition-all hover:translate-y-[-2px]">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-full shadow-sm ${iconBg}`}>{icon}</div>
      {trend && (
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h4>
      {subtitle && <p className="text-[9px] font-bold text-slate-500 uppercase mt-3">{subtitle}</p>}
    </div>
  </div>
);

export default Dashboard;