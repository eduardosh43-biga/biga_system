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
    <div className="p-8 max-w-7xl mx-auto bg-gray-300 min-h-screen">
      <header className="mb-12 border-b-2 border-slate-100 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-biga-dark tracking-tighter uppercase italic">
            Dashboard<span className="text-biga-orange">.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-3">Análisis de rendimiento mensual</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
          <Calendar className="text-biga-orange" size={20} />
          <span className="font-black text-xs uppercase text-slate-600">{new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</span>
        </div>
      </header>

      {/* TARJETAS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Ingresos Totales" 
          value={`S/ ${summary.total_revenue}`} 
          icon={<DollarSign className="text-green-600" />} 
          trend={`${metrics.growth_vs_prev_month}% vs mes ant.`}
          trendUp={metrics.growth_vs_prev_month >= 0}
        />
        <StatCard 
          title="Ganancia Neta" 
          value={`S/ ${summary.net_profit}`} 
          icon={<TrendingUp className="text-blue-600" />} 
          subtitle="Libre de costos de prod."
        />
        <StatCard 
          title="Pérdidas (Merma/Personal)" 
          value={`S/ ${summary.total_loss}`} 
          icon={<AlertCircle className="text-red-600" />} 
          subtitle={`${Math.round((summary.total_loss / summary.total_revenue) * 100)}% de los ingresos`}
        />
        <StatCard 
          title="Promedio Semanal" 
          value={`S/ ${metrics.avg_weekly_sales}`} 
          icon={<BarChart2 className="text-biga-orange" />} 
          subtitle="Ventas proyectadas"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TOP PRODUCTOS */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <Award className="text-biga-orange" size={28} />
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-biga-dark">Productos Estrella</h3>
          </div>
          <div className="space-y-6">
            {products.top_5.map((p, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <span className="text-4xl font-black text-slate-100 group-hover:text-biga-orange/20 transition-colors">0{i+1}</span>
                  <div>
                    <p className="font-black uppercase text-slate-800 tracking-tight text-lg">{p.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.type === 'Recipe' ? 'Pizza / Plato' : 'Promoción'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-biga-dark">{p.quantity}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Vendidos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DETALLES DE PÉRDIDAS Y PEOR PRODUCTO */}
        <div className="flex flex-col gap-8">
          <div className="bg-[#1a1a1a] rounded-[3rem] p-10 text-white shadow-2xl">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8 text-center">Fuga de Dinero</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-sm font-bold text-slate-400">Merma Cocina</span>
                <span className="text-xl font-black text-red-500">S/ {summary.loss_by_merma}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-sm font-bold text-slate-400">Consumo Personal</span>
                <span className="text-xl font-black text-orange-400">S/ {summary.loss_by_personal}</span>
              </div>
              <p className="text-[10px] text-slate-500 italic text-center leading-relaxed">
                * Estas cifras representan el costo de producción de los insumos que no generaron ingresos.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 flex-1">
             <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 text-center italic">Ojo con la rotación</h4>
             <div className="space-y-8">
                {products.worst_performers.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-start border-l-4 border-red-100 pl-4">
                        <div>
                            <p className="text-[10px] font-black uppercase text-red-500 mb-1">{p.category} menos vendido</p>
                            <h5 className="text-lg font-black text-biga-dark uppercase italic tracking-tighter leading-tight">
                                {p.name || "Sin datos"}
                            </h5>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-black text-slate-300">{p.quantity}</p>
                            <p className="text-[8px] font-bold text-slate-300 uppercase">u.</p>
                        </div>
                    </div>
                ))}
             </div>
             <p className="mt-10 text-[9px] text-slate-400 font-bold uppercase text-center leading-relaxed">
                Considera rotar estos productos o crear promociones para aumentar su salida.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, trendUp, subtitle }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col justify-between transition-all hover:scale-105">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      {trend && (
        <span className={`text-[10px] font-black uppercase tracking-tighter ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl font-black text-biga-dark tracking-tighter">{value}</h4>
      {subtitle && <p className="text-[10px] font-bold text-slate-300 uppercase mt-2">{subtitle}</p>}
    </div>
  </div>
);

export default Dashboard;