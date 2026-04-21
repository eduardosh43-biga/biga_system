import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, User, MapPin, CreditCard, ChevronRight, ArrowLeft, Hash, MessageSquare } from 'lucide-react';

const CartSideBar = ({
    cart, setCart,
    customerName, setCustomerName,
    orderType, setOrderType,
    tableNumber, setTableNumber,
    deliveryAddress, setDeliveryAddress,
    deliveryFee, setDeliveryFee,
    mermaReason, setMermaReason,   
    onSubmit
}) => {
    const [step, setStep] = useState(1);

    const cardStyle = "bg-white rounded-3xl border-l-[6px] border-slate-900 shadow-sm p-4 mb-3 transition-all";
    const inputStyle = "w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 outline-none transition-all text-sm font-bold";
    const labelStyle = "text-[10px] font-black uppercase text-slate-400 mb-1 ml-2 flex items-center gap-1";

    const calculateTotal = () => {
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const fee = orderType === 'delivery' ? parseFloat(deliveryFee || 0) : 0;
        return (subtotal + fee).toFixed(2);
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] p-6 border-l border-slate-200">
            {/* HEADER */}
            <div className="mb-8">
                {step === 1 ? (
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 p-2 rounded-xl text-white"><ShoppingBag size={20} /></div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase">Tu Pedido</h2>
                    </div>
                ) : (
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all">
                        <ArrowLeft size={18} /> <span className="font-black uppercase text-xs">Volver al carrito</span>
                    </button>
                )}
            </div>

            {/* CONTENIDO */}
            <div className="flex-1 overflow-y-auto pr-2">
                {step === 1 ? (
                    /* PASO 1: ITEMS */
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        {cart.length === 0 ? (
                            <div className="text-center py-20 text-slate-300 italic text-sm">Agrega algo del menú...</div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className={cardStyle}>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="font-black text-slate-900 uppercase text-xs leading-tight">{item.name}</span>
                                        <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-1">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1"><Minus size={12} /></button>
                                            <span className="font-black text-xs">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1"><Plus size={12} /></button>
                                        </div>
                                        <span className="font-black text-slate-900 text-sm">S/ {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    /* PASO 2: DETALLES SEGÚN SCHEMA */
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        {/* Tipo de Servicio */}
                        <div>
                            <label className={labelStyle}><MapPin size={10} /> Tipo de Servicio</label>
                            <select value={orderType} onChange={(e) => setOrderType(e.target.value)} className={inputStyle}>
                                <option value="mesa">Mesa</option>
                                <option value="delivery">Delivery</option>
                                <option value="merma">Merma</option>
                                <option value="personal">Personal</option>
                            </select>
                        </div>

                        {/* Nombre (Solo si no es merma) */}
                        {orderType !== 'merma' && (
                            <div>
                                <label className={labelStyle}><User size={10} /> Nombre del Cliente</label>
                                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Ej: Eduardo" className={inputStyle} />
                            </div>
                        )}

                        {/* Campos Condicionales */}
                        {orderType === 'mesa' && (
                            <div>
                                <label className={labelStyle}><Hash size={10} /> Número de Mesa</label>
                                <input type="text" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="Ej: 5" className={inputStyle} />
                            </div>
                        )}

                        {orderType === 'delivery' && (
                            <div className="space-y-4">
                                <div>
                                    <label className={labelStyle}>Dirección de Envío</label>
                                    <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Ej: Av. Bolognesi 123" className={inputStyle} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Costo de Envío (S/)</label>
                                    <input type="number" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} className={inputStyle} placeholder="0.00" />
                                </div>
                            </div>
                        )}

                        {orderType === 'merma' && (
                            <div>
                                <label className={labelStyle}><MessageSquare size={10} /> Razón de la Merma</label>
                                <textarea
                                    value={mermaReason}
                                    onChange={(e) => setMermaReason(e.target.value)}
                                    placeholder="Ej: Se quemó la base, el cliente canceló..."
                                    className={`${inputStyle} h-24 resize-none`}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-200">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total a Cobrar</span>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">S/ {calculateTotal()}</p>
                    </div>
                </div>

                <button
                    onClick={step === 1 ? () => setStep(2) : onSubmit}
                    disabled={cart.length === 0 || (step === 2 && orderType !== 'merma' && !customerName)}
                    className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${step === 1 ? 'bg-slate-900 text-white' : 'bg-red-600 text-white shadow-xl shadow-red-200'
                        } disabled:opacity-30`}
                >
                    {step === 1 ? "Siguiente" : (orderType === 'merma' ? "Registrar Merma" : "Confirmar Pedido")}
                    {step === 1 && <ChevronRight size={16} />}
                </button>
            </div>
        </div>
    );
};

export default CartSideBar;