import React from 'react';

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

export default StatCard;
