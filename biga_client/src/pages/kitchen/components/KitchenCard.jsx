import React from 'react';
import { Clock, CheckCircle, Utensils, Truck, UserCircle } from 'lucide-react';

const KitchenCard = ({ order, onReady }) => {
    const minutesElapsed = Math.floor((new Date() - new Date(order.created_at)) / 60000);
    const timeColor = minutesElapsed > 15 ? "text-red-500 animate-pulse" : "text-slate-400";

    // Configuramos el indicador del tipo de pedido
    const typeConfig = {
        mesa: { label: `MESA ${order.table_number}`, icon: <Utensils size={14} />, color: "bg-blue-100 text-blue-700" },
        delivery: { label: "DELIVERY", icon: <Truck size={14} />, color: "bg-amber-100 text-amber-700" },
        personal: { label: "PERSONAL", icon: <UserCircle size={14} />, color: "bg-purple-100 text-purple-700" },
        merma: { label: "MERMA", icon: <CheckCircle size={14} />, color: "bg-red-100 text-red-700" }
    };

    const config = typeConfig[order.order_type] || typeConfig.mesa;

    return (
        <div className="bg-white rounded-[2rem] shadow-xl flex flex-col h-fit max-w-[320px] w-full border border-slate-100 overflow-hidden">
            {/* Cabecera compacta */}
            <div className="p-4 bg-slate-50/50 border-b border-dashed border-slate-200">
                <div className="flex justify-between items-center mb-3">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${config.color}`}>
                        {config.icon} {config.label}
                    </span>
                    <div className={`flex items-center gap-1 font-black text-xs ${timeColor}`}>
                        <Clock size={12} /> {minutesElapsed}'
                    </div>
                </div>
                <h3 className="text-lg font-black uppercase text-slate-900 truncate">
                    {order.customer_name || `Ticket #${order.id}`}
                </h3>
            </div>

            {/* Lista de Productos más equilibrada */}
            <div className="p-5 flex-1">
                <ul className="space-y-3">
                    {order.order_items?.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                            <span className="bg-slate-900 text-white text-lg w-10 h-10 flex items-center justify-center rounded-xl font-black shrink-0">
                                {item.quantity}
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-black uppercase text-slate-800 leading-tight break-words">
                                    {item.item_name}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Botón menos invasivo */}
            <div className="p-4 pt-0">
                <button
                    onClick={() => onReady(order.id)}
                    className="w-full bg-green-500 hover:bg-green-600 active:scale-95 transition-all text-white py-3.5 rounded-2xl flex items-center justify-center gap-2"
                >
                    <CheckCircle size={18} strokeWidth={3} />
                    <span className="text-xs font-black uppercase tracking-widest">¡Listo!</span>
                </button>
            </div>
        </div>
    );
};

export default KitchenCard;