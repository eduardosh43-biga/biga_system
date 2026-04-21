import React from 'react';
import { X, Printer } from 'lucide-react';

const OrderDetailModal = ({ isOpen, order, onClose }) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-none shadow-2xl flex flex-col overflow-hidden font-mono">
                {/* Header estilo recibo */}
                <div className="p-6 border-b-2 border-dashed border-slate-200 text-center relative">
                    <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-900">
                        <X size={24} />
                    </button>
                    <h2 className="text-3xl font-black tracking-tighter">BIGA PIZZA</h2>
                    <p className="text-xs text-slate-500 uppercase">Tacna, Perú</p>
                    <p className="text-xs text-slate-500 uppercase">Ticket #{order.id}</p>
                </div>

                {/* Cuerpo del ticket */}
                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="flex justify-between mb-6">
                        <span className="text-xs font-bold uppercase">Cliente:</span>
                        <span className="text-sm font-black uppercase">{order.customer_name}</span>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 border-b pb-2">
                            <span>PRODUCTO</span>
                            <span>TOTAL</span>
                        </div>
                        {order.order_items?.map((item, i) => (
                            <div key={i} className="flex justify-between items-start text-sm">
                                <span>{item.quantity}x {item.itemable_name}</span>
                                <span className="font-bold">S/ {(item.quantity * item.unit_price).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t-2 border-double border-slate-900 pt-4 space-y-2">
                        <div className="flex justify-between text-xl font-black">
                            <span>TOTAL</span>
                            <span>S/ {order.total_price}</span>
                        </div>
                    </div>
                </div>

                {/* Footer / Acciones */}
                <div className="p-6 bg-slate-50 flex gap-4">
                    <button
                        className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                        onClick={() => window.print()} // Un pequeño truco para imprimir rápido
                    >
                        <Printer size={20} /> IMPRIMIR COMANDA
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;