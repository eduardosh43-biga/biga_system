import React from 'react';
import { X, Printer, CreditCard, MapPin, Hash, ExternalLink } from 'lucide-react';

const OrderDetailModal = ({ isOpen, order, onClose }) => {
    if (!isOpen || !order) return null;

    const orderDate = new Date(order.created_at).toLocaleString('es-PE', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    return (
        /* 1. Fondo con scroll habilitado y cierre al hacer clic */
        <div
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[500] flex justify-center p-4 overflow-y-auto cursor-pointer"
            onClick={onClose}
        >
            {/* 2. Contenedor del Ticket (stopPropagation evita que se cierre al tocar el ticket) */}
            <div
                className="bg-white w-full max-w-md shadow-2xl flex flex-col relative font-mono my-auto cursor-default"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Botón Cerrar Flotante */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-900 z-10 p-2"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="p-8 border-b-2 border-dashed border-slate-200 text-center">
                    <h2 className="text-4xl font-black tracking-tighter">BIGA</h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-sans">Pizzería Artesanal · Tacna</p>

                    <div className="mt-4 flex flex-col items-center gap-1">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {order.status === 'completed' ? 'Venta Finalizada' : 'Pedido Anulado'}
                        </span>
                    </div>
                </div>

                {/* Cliente y Dirección */}
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

                    {/* BLOQUE DE DIRECCIÓN RESALTADO */}
                    {order.order_type === 'delivery' && (
                        <div className="p-4 bg-white border-2 border-slate-900 rounded-sm shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-red-600" />
                                    <span className="text-[10px] font-black uppercase text-red-600">Dirección de Entrega</span>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.delivery_address + ", Tacna, Peru")}`}
                                    target="_blank" rel="noreferrer"
                                    className="bg-blue-600 text-white text-[8px] font-black px-2 py-1 flex items-center gap-1"
                                >
                                    <ExternalLink size={10} /> GOOGLE MAPS
                                </a>
                            </div>
                            <p className="text-[13px] font-black uppercase leading-tight">
                                {order.delivery_address || "No especificada"}
                            </p>
                        </div>
                    )}

                    {/* Fila de Detalles Rápidos */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-2">
                            <Hash size={14} className="text-slate-400" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Ticket</span>
                                <span className="text-[11px] font-black">#{order.daily_id || order.id}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard size={14} className="text-slate-400" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Pago</span>
                                <span className="text-[11px] font-black uppercase">{order.payment_method || 'Pendiente'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Productos (Ajustada para tickets largos) */}
                <div className="p-8">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 border-b pb-2 mb-4">
                        <span>DETALLE DE CONSUMO</span>
                        <span>SUBTOTAL</span>
                    </div>

                    <div className="space-y-4">
                        {order.order_items?.map((item, i) => (
                            <div key={i} className="flex justify-between items-start text-xs border-b border-dotted border-slate-100 pb-2">
                                <div className="flex flex-col">
                                    <span className="font-bold uppercase tracking-tight">
                                        {item.quantity}x {item.item_name}
                                    </span>
                                    <span className="text-[9px] text-slate-400 italic">S/ {parseFloat(item.unit_price).toFixed(2)} c/u</span>
                                </div>
                                <span className="font-black">S/ {(item.quantity * item.unit_price).toFixed(2)}</span>
                            </div>
                        ))}

                        {order.order_type === 'delivery' && (
                            <div className="flex justify-between items-center text-xs pt-2">
                                <span className="font-bold uppercase italic text-slate-500">Recargo Delivery</span>
                                <span className="font-black">S/ {parseFloat(order.delivery_fee || 0).toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 border-t-4 border-double border-slate-900 pt-6">
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs font-black">TOTAL A COBRAR</span>
                            <span className="text-4xl font-black tracking-tighter">S/ {order.total_price}</span>
                        </div>
                    </div>
                </div>

                {/* Botón de Impresión */}
                <div className="px-8 pb-12 pt-4">
                    <button
                        className="w-full bg-slate-900 text-white py-4 font-black flex items-center justify-center gap-2 hover:bg-red-600 transition-all uppercase text-xs tracking-widest active:scale-95"
                        onClick={() => window.print()}
                    >
                        <Printer size={16} /> Re-imprimir Comanda
                    </button>
                    <p className="text-[8px] text-center text-slate-400 mt-4 uppercase">Gracias por elegir BIGA · Pizza Artesanal</p>
                </div>

                {/* Efecto Zig-Zag inferior */}
                <div className="absolute -bottom-2 left-0 w-full h-4 flex overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-6 h-6 bg-slate-100 rotate-45 -translate-y-3 shrink-0 border border-slate-200"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;