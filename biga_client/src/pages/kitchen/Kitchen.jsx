import React, { useEffect, useState } from 'react';
import KitchenCard from './components/KitchenCard';
import { RefreshCcw, Utensils } from 'lucide-react';
import { createConsumer } from '@rails/actioncable';
import api from '../../assets/services/api';
import { toast } from '../../assets/services/notifications';

const Kitchen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchKitchenOrders = async () => {
        try {
            const res = await api("/orders");

            if (res && res.ok) {
                const data = await res.json();
                // FILTRO CRÍTICO: Solo lo que la cocina debe ver
                const onlyPending = data.filter(o => o.status === 'pending');
                setOrders(onlyPending);
            } else {
                toast("Error al sincronizar cocina", "error");
            }
        } catch (error) {
            toast("Error de conexión", "error");
            console.error("Error en cocina:", error);
        } finally {
            setLoading(false);
        }
    }
   
    useEffect(() => {
        fetchKitchenOrders();
        // 1. Creamos la conexión con el servidor
        const consumer = createConsumer('ws://localhost:3000/cable');

        // 2. Nos suscribimos al canal
        const subscription = consumer.subscriptions.create('KitchenChannel', {
            received: (data) => {
                console.log("¡Nueva orden recibida!", data);
                toast(`¡Nuevo pedido! #${data.order.daily_id}`, "info");
                setOrders(prev => [data.order, ...prev]);
            }
        });
        return () => {
            subscription.unsubscribe();
            consumer.disconnect();
        };
    }, []);

    const handleMarkAsReady = async (id) => {
        try {
            const res = await api(`/orders/${id}`, {
                method: 'PATCH',
                body: { order: { status: 'ready' } }
            });
            if (res && res.ok) {
                toast("Pedido listo para despacho", "success");
                await fetchKitchenOrders();
            } else {
                toast("Error al marcar como listo", "error");
            }
        } catch (error) {
            toast("Error de conexión", "error");
            console.error("Error al despachar:", error);
        }
    };

    if (loading) return <div className="p-20 text-center font-black text-slate-400 italic">CALENTANDO EL HORNO...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8 no-scrollbar">
            <header className="flex justify-between items-center mb-10 border-b border-slate-200 pb-8">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-biga-dark italic tracking-tighter uppercase">
                            Cocina<span className="text-biga-orange">.</span>
                        </h1>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 italic">Línea de producción activa</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">En Vivo</span>
                    </div>
                </div>
                <button
                    onClick={fetchKitchenOrders}
                    className="p-4 bg-white text-slate-400 rounded-2xl hover:text-biga-orange border border-slate-100 shadow-sm transition-all group active:scale-95"
                >
                    <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                </button>
            </header>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-10">
                    <div className="max-w-md w-full border-2 border-dashed border-slate-200 rounded-[3rem] p-16 flex flex-col items-center bg-white/50 backdrop-blur-sm shadow-inner">
                        <div className="bg-slate-100 p-8 rounded-full mb-8">
                            <Utensils size={64} className="text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-black uppercase italic text-slate-400 tracking-tight text-center">Todo en orden</h2>
                        <p className="text-slate-300 font-bold uppercase text-[10px] tracking-widest mt-2">Esperando pedidos...</p>
                    </div>
                </div>
            ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {orders.map(order => (
                        <KitchenCard
                            key={order.id}
                            order={order}
                            onReady={handleMarkAsReady}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Kitchen;