import React from 'react';
import { Trash2, Edit3, Clock, Eye } from 'lucide-react';



const OrderCard = ({ order, onDelete, onEdit, onComplete, onDetail }) => {
    const canManage = order.status === 'pending' || order.status === 'ready';

    const getTimerStyle = (mins) => {
        if (mins >= 20) return "text-red-600 text-[12px] animate-bounce font-black"; // Crítico
        if (mins >= 12) return "text-orange-500 font-bold";            // Advertencia
        return "text-blue-400 font-medium";                           // Normal
    };

    const calcularMinutos = (fechaCreacion) => {
        if (!fechaCreacion) return 0;
        const inicio = new Date(fechaCreacion);
        const ahora = new Date();
        const diferenciaMs = ahora - inicio;
        return Math.floor(diferenciaMs / (1000 * 60));
    };

    const minutos = calcularMinutos(order.created_at);
    const borderTopColor = order.order_type === 'delivery' ? 'border-orange-500' : 'border-blue-500';

    return (
        <div className={`relative bg-white shadow-2xl rounded-2xl border-t-[6px] ${borderTopColor} p-6 flex flex-col overflow-hidden transition-all hover:translate-y-[-4px]`}>
            {/* Header Interno */}
            <div className="flex justify-between items-start mb-4 border-b border-dashed border-slate-200 pb-4">
                <div className="max-w-[70%]">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket #{order.daily_id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            order.order_type === 'delivery' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                            {order.order_type === 'mesa' ? `Mesa ${order.table_number}` : order.order_type}
                        </span>
                    </div>
                    {canManage && (
                        <div className="flex items-center gap-1.5 mb-2">
                            <Clock size={12} className={getTimerStyle(minutos)} />
                            <span className={`text-[10px] uppercase font-black tracking-tight ${getTimerStyle(minutos)}`}>
                                {minutos === 0 ? "Recién ingresado" : `Hace ${minutos} minutos`}
                            </span>
                        </div>
                    )}
                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        {order.customer_name}
                    </h3>
                </div>
                {/* Badge de Status: Pill Style */}
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 ${
                    order.status === 'ready' ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-200' :
                    order.status === 'pending' ? 'bg-amber-100 text-amber-600 border-amber-200' :
                    order.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                    'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                    {order.status === 'ready' ? '¡LISTO!' : order.status}
                </div>
            </div>

            {/* Lista de Productos */}
            <div className="flex-1 space-y-3 mb-6 font-mono text-[11px] text-slate-700">                
                {order.order_items?.map((item, idx) => {
                    const subtotal = (item.quantity * item.unit_price).toFixed(2);
                    return (
                        <div key={idx} className="flex justify-between items-start leading-tight">
                            <span className="pr-2">
                                <span className="font-black text-slate-900 mr-1">{item.quantity}x</span>
                                {item.itemable?.name || item.item_name}
                                {item.quantity > 1 && (
                                    <span className="text-[9px] text-slate-400 block ml-5">
                                        (S/ {parseFloat(item.unit_price).toFixed(2)} c/u)
                                    </span>
                                )}
                            </span>
                            <span className="text-slate-600 font-bold whitespace-nowrap italic">
                                S/ {subtotal}
                            </span>
                        </div>
                    );
                })}
                
                {order.order_type === 'delivery' && parseFloat(order.delivery_fee) > 0 && (
                    <div className="flex justify-between items-center border-t border-dashed pt-2 mt-2 border-slate-200">
                        <span className="font-bold text-slate-900 uppercase text-[9px]">Envío / Delivery</span>
                        <span className="text-slate-600 font-bold italic">
                            S/ {parseFloat(order.delivery_fee).toFixed(2)}
                        </span>
                    </div>
                )}
            </div>

            {/* Total con fondo tenue */}
            <div className="bg-slate-50 -mx-6 px-6 py-4 border-t border-dashed border-slate-300 mb-4">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Total Comanda</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">S/ {order.total_price}</span>
                </div>
            </div>

            {/* ACCIONES CONDICIONALES */}
            {canManage ? (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => onEdit(order)} className="flex items-center justify-center gap-1.5 p-2 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase hover:bg-blue-100 transition-colors border border-blue-100">
                            <Edit3 size={12} /> Editar
                        </button>
                        <button onClick={() => onDelete(order.id)} className="flex items-center justify-center gap-1.5 p-2 bg-red-50 text-red-500 rounded-xl text-[9px] font-black uppercase hover:bg-red-100 transition-colors border border-red-100">
                            <Trash2 size={12} /> Anular
                        </button>
                    </div>                   
                    <button
                        onClick={() => onComplete(order)}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-orange-200 transition-all active:scale-95"
                    >
                        Confirmar Despacho
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    <button
                        onClick={() => onDetail(order)}
                        className="w-full flex items-center justify-center gap-2 p-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 hover:text-white transition-all border border-slate-200"
                    >
                        <Eye size={14} /> Ver Detalle Completo
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderCard;