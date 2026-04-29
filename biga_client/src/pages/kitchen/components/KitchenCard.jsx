import React, { useState } from 'react';
import { Clock, CheckCircle, Utensils, Truck, UserCircle, Check } from 'lucide-react';

const KitchenCard = ({ order, onReady }) => {
    const [checkedItems, setCheckedItems] = useState({});
    
    const minutesElapsed = Math.floor((new Date() - new Date(order.created_at)) / 60000);
    const isLate = minutesElapsed > 10;
    const timeColor = isLate ? "text-[#DC2626] animate-pulse" : "text-slate-400";

    const toggleItem = (idx) => {
        setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const typeConfig = {
        mesa: { label: `MESA ${order.table_number}`, icon: <Utensils size={14} />, color: "bg-blue-50 text-blue-600 border-blue-100" },
        delivery: { label: "DELIVERY", icon: <Truck size={14} />, color: "bg-amber-50 text-amber-600 border-amber-100" },
        personal: { label: "PERSONAL", icon: <UserCircle size={14} />, color: "bg-purple-50 text-purple-600 border-purple-100" },
        merma: { label: "MERMA", icon: <CheckCircle size={14} />, color: "bg-red-50 text-red-600 border-red-100" }
    };

    const config = typeConfig[order.order_type] || typeConfig.mesa;

    return (
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/80 flex flex-col h-fit w-full border border-slate-100 overflow-hidden transition-all hover:scale-[1.02]">
            {/* Cabecera Premium */}
            <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                <div className="flex justify-between items-center mb-4">
                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${config.color}`}>
                        {config.icon} {config.label}
                    </span>
                    <div className={`flex items-center gap-1.5 font-mono font-black text-sm px-3 py-1 bg-white rounded-xl shadow-sm border border-slate-100 ${timeColor}`}>
                        <Clock size={14} /> {minutesElapsed}'
                    </div>
                </div>
                <div className="flex justify-between items-end">
                    <h3 className="text-xl font-black uppercase text-biga-dark italic tracking-tighter leading-none">
                        Ticket #{order.id}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>

            {/* Lista de Producción con Checkboxes */}
            <div className="p-6 flex-1 bg-white">
                <ul className="space-y-4">
                    {order.order_items?.map((item, idx) => (
                        <li 
                            key={idx} 
                            onClick={() => toggleItem(idx)}
                            className={`flex items-center gap-4 cursor-pointer group p-2 rounded-2xl transition-colors ${checkedItems[idx] ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
                        >
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${checkedItems[idx] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 bg-white group-hover:border-biga-orange'}`}>
                                {checkedItems[idx] && <Check size={14} strokeWidth={4} />}
                            </div>
                            <div className="flex items-center gap-3 flex-1">
                                <span className={`text-base font-black font-mono w-8 h-8 flex items-center justify-center rounded-xl shrink-0 transition-colors ${checkedItems[idx] ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-900 text-white'}`}>
                                    {item.quantity}
                                </span>
                                <p className={`text-sm font-black uppercase tracking-tight transition-all ${checkedItems[idx] ? 'text-slate-300 line-through italic' : 'text-slate-800'}`}>
                                    {item.item_name}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Botón Despachar Gradiente */}
            <div className="p-6 pt-2">
                <button
                    onClick={() => onReady(order.id)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 active:scale-[0.98] transition-all text-white py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20"
                >
                    <CheckCircle size={20} strokeWidth={3} />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Despachar</span>
                </button>
            </div>
        </div>
    );
};

export default KitchenCard;