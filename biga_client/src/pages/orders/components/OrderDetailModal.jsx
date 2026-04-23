// import React from 'react';
// import { X, Printer } from 'lucide-react';

// const OrderDetailModal = ({ isOpen, order, onClose }) => {
//     if (!isOpen || !order) return null;

//     return (
//         <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
//             <div className="bg-white w-full max-w-lg rounded-none shadow-2xl flex flex-col overflow-hidden font-mono">
//                 {/* Header estilo recibo */}
//                 <div className="p-6 border-b-2 border-dashed border-slate-200 text-center relative">
//                     <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-900">
//                         <X size={24} />
//                     </button>
//                     <h2 className="text-3xl font-black tracking-tighter">BIGA PIZZA</h2>
//                     <p className="text-xs text-slate-500 uppercase">Tacna, Perú</p>
//                     <p className="text-xs text-slate-500 uppercase">Ticket #{order.id}</p>
//                 </div>

//                 {/* Cuerpo del ticket */}
//                 <div className="p-8 flex-1 overflow-y-auto">
//                     <div className="flex justify-between mb-6">
//                         <span className="text-xs font-bold uppercase">Cliente:</span>
//                         <span className="text-sm font-black uppercase">{order.customer_name}</span>
//                     </div>

//                     <div className="space-y-4 mb-8">
//                         <div className="flex justify-between text-[10px] font-bold text-slate-400 border-b pb-2">
//                             <span>PRODUCTO</span>
//                             <span>TOTAL</span>
//                         </div>
//                         {order.order_items?.map((item, i) => (
//                             <div key={i} className="flex justify-between items-start text-sm">
//                                 <span>{item.quantity}x {item.itemable_name}</span>
//                                 <span className="font-bold">S/ {(item.quantity * item.unit_price).toFixed(2)}</span>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="border-t-2 border-double border-slate-900 pt-4 space-y-2">
//                         <div className="flex justify-between text-xl font-black">
//                             <span>TOTAL</span>
//                             <span>S/ {order.total_price}</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer / Acciones */}
//                 <div className="p-6 bg-slate-50 flex gap-4">
//                     <button
//                         className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
//                         onClick={() => window.print()} // Un pequeño truco para imprimir rápido
//                     >
//                         <Printer size={20} /> IMPRIMIR COMANDA
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OrderDetailModal;

import React from 'react';
import { X, Printer, Calendar, CreditCard, MapPin, Hash } from 'lucide-react';

const OrderDetailModal = ({ isOpen, order, onClose }) => {
    if (!isOpen || !order) return null;

    // Formatear fecha para Tacna
    const orderDate = new Date(order.created_at).toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[500] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md shadow-2xl flex flex-col relative font-mono overflow-hidden">

                {/* Botón Cerrar Flotante */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-900 z-10"
                >
                    <X size={24} />
                </button>

                {/* Header estilo recibo */}
                <div className="p-8 border-b-2 border-dashed border-slate-200 text-center">
                    <h2 className="text-4xl font-black tracking-tighter">BIGA</h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-sans">Pizzería Artesanal · Tacna</p>

                    <div className="mt-4 flex flex-col items-center gap-1">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {order.status === 'completed' ? 'Venta Finalizada' : 'Pedido Anulado'}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <Hash size={10} /> {order.daily_id || order.id}
                        </span>
                    </div>
                </div>

                {/* Info de Cliente y Entrega */}
                <div className="px-8 py-6 space-y-4 bg-slate-50/50 border-b border-dashed border-slate-200">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Cliente</span>
                            <span className="text-sm font-black uppercase">{order.customer_name}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Fecha</span>
                            <span className="text-[11px] font-bold">{orderDate}</span>
                        </div>
                    </div>

                    {/* BLOQUE DE DIRECCIÓN (Solo si es Delivery) */}
                    {order.order_type === 'delivery' && (
                        <div className="p-3 bg-white border-2 border-slate-900 rounded-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <MapPin size={12} className="text-red-600" />
                                <span className="text-[9px] font-black uppercase text-red-600">Dirección de Entrega</span>
                            </div>
                            <p className="text-[12px] font-black uppercase leading-tight">
                                {order.delivery_address || "No se especificó dirección"}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white rounded-lg border border-slate-200">
                                <Hash size={14} className="text-slate-600" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Tipo</span>
                                <span className="text-[11px] font-black uppercase">
                                    {order.order_type === 'mesa' ? `Mesa ${order.table_number}` : 'Para Envío'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white rounded-lg border border-slate-200">
                                <CreditCard size={14} className="text-slate-600" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Pago</span>
                                <span className="text-[11px] font-black uppercase">{order.payment_method || 'Pendiente'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Productos */}
                <div className="p-8 flex-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 border-b pb-2 mb-4">
                        <span>DETALLE</span>
                        <span>SUBTOTAL</span>
                    </div>

                    <div className="space-y-3">
                        {order.order_items?.map((item, i) => (
                            <div key={i} className="flex justify-between items-start text-xs">
                                <div className="flex flex-col">
                                    <span className="font-bold uppercase tracking-tight">
                                        {item.quantity}x {item.item_name}
                                    </span>
                                    <span className="text-[9px] text-slate-400 italic">S/ {parseFloat(item.unit_price).toFixed(2)} c/u</span>
                                </div>
                                <span className="font-black">S/ {(item.quantity * item.unit_price).toFixed(2)}</span>
                            </div>
                        ))}

                        {order.order_type === 'delivery' && parseFloat(order.delivery_fee) > 0 && (
                            <div className="flex justify-between items-center text-xs pt-2 border-t border-dotted">
                                <span className="font-bold uppercase italic text-slate-500">Envío / Delivery</span>
                                <span className="font-black">S/ {parseFloat(order.delivery_fee).toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 border-t-4 border-double border-slate-900 pt-4">
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs font-black">TOTAL COBRADO</span>
                            <span className="text-3xl font-black tracking-tighter">S/ {order.total_price}</span>
                        </div>
                    </div>
                </div>

                {/* Botón de Impresión */}
                <div className="px-8 pb-10 pt-4">
                    <button
                        className="w-full bg-slate-900 text-white py-4 rounded-none font-black flex items-center justify-center gap-2 hover:bg-red-600 transition-colors uppercase text-xs tracking-widest"
                        onClick={() => window.print()}
                    >
                        <Printer size={16} /> Re-imprimir Ticket
                    </button>
                </div>

                {/* Efecto de corte de papel (Zig-zag) */}
                <div className="absolute -bottom-2 left-0 w-full h-4 flex overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="w-4 h-4 bg-slate-900/10 rotate-45 -translate-y-2 shrink-0 border border-slate-200"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;