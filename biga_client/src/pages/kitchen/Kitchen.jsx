import React, { useEffect, useState } from 'react';
import KitchenCard from './components/KitchenCard';
import { RefreshCcw } from 'lucide-react';
import { createConsumer } from '@rails/actioncable';
import api from '../../assets/services/api';

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
            }
        } catch (error) {
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
            if (res && res.ok) await fetchKitchenOrders();
        } catch (error) {
            console.error("Error al despachar:", error);
        }
    };

    if (loading) return <div className="p-20 text-center font-black text-slate-400 italic">CALENTANDO EL HORNO...</div>;

    return (
        <div className="min-h-screen bg-slate-900 p-8 no-scrollbar">
            <header className="flex justify-between items-center mb-10 border-b-4 border-red-600 pb-6">
                <div>
                    <h1 className="text-5xl font-black text-white italic tracking-tighter">COCINA BIGA</h1>
                    <p className="text-red-500 font-bold uppercase text-xs tracking-widest mt-1">Producción en tiempo real</p>
                </div>
                <button
                    onClick={fetchKitchenOrders}
                    className="p-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all"
                >
                    <RefreshCcw size={24} />
                </button>
            </header>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                    <p className="text-2xl font-black uppercase italic">No hay pedidos pendientes</p>
                    <p className="text-sm">¡Buen trabajo, equipo!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
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