import React, { useState, useEffect } from 'react';
import OrderCard from './components/OrderCard';
import OrderDetailModal from './components/OrderDetailModal';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import api from '../../assets/services/api';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);  
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const pendingOrders = orders
    .filter(o => o.status === 'pending' || o.status === "ready")
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  // 2. Historial: Lo último que se despachó o anuló arriba
  const historyOrders = orders
    .filter(o => o.status !== 'pending' && o.status !== 'ready')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // 1. CARGAR ÓRDENES
  const fetchOrders = async () => {
    try {
      const res = await api('/orders');
      if (res && res.ok) {
        const data = await res.json();        
        setOrders(Array.isArray(data) ? data : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error de red:", error);
      setOrders([]);
    }
  };

  useEffect(() => { 
    fetchOrders(); 
  }, []);

  // 2. LOGICA: VER DETALLE
  const handleDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // 3. LOGICA: ELIMINAR
  const handleDelete = async (id) => {
    if (window.confirm("¿Anular este pedido? El registro quedará guardado como 'Anulado'.")) {
      try {
        const response = await api(`/orders/${id}`, {
          method: 'DELETE', 
        });

        if (response && response.ok) {          
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === id ? { ...order, status: 'cancelled' } : order
            )
          );
        }
      } catch (error) {
        console.error("Error al anular:", error);
      }
    }
  };

  // 4. LOGICA: EDITAR (Redirección al flujo de venta)
  const handleEdit = (order) => {
    navigate(`/orders/new?edit_id=${order.id}`);
  };

  const handleComplete = (order) => {
    if (order.order_type === 'merma') {
      executeFinishOrder(order.id, 'n/a');
    } else {
      setSelectedOrder(order);
      setShowPaymentModal(true);
    }
  };

  const executeFinishOrder = async (id, method) => {
    if (!id) return; 
    try {
      const res = await api(`/orders/${id}`, {
        method: 'PATCH',
        body: {
          order: {
            status: 'completed',
            payment_method: method
          }
        }
      });

      if (res && res.ok) {
        setShowPaymentModal(false);
        await fetchOrders(); 
      }
    } catch (error) {
      console.error("Error al cerrar pedido:", error);
    }
  };

  return (
    <div className="p-8 bg-slate-300 min-h-screen ml-4">
      <div className="flex justify-between items-end mb-12 border-b-2 border-slate-100 pb-8">
        <div>
          <h1 className="text-5xl font-black text-biga-dark tracking-tighter uppercase leading-none italic">
            Panel de Pedidos<span className="text-biga-orange">.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-3">BIGA PIZZERIA · Central de Comandas</p>
        </div>

        <button
          onClick={() => navigate("/orders/new")}
          style={{ backgroundColor: '#f5821f' }}
          className="text-white px-10 py-5 rounded-[2rem] font-black shadow-2xl hover:scale-105 hover:bg-[#1a1a1a] transition-all flex items-center gap-3 uppercase text-xs active:scale-95"
        >
          <Plus size={24} strokeWidth={3} /> Nuevo Pedido
        </button>
      </div>

      {/* SECCIÓN 1: PENDIENTES (COMANDAS VIVAS) */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-3 w-12 bg-biga-orange rounded-full"></div>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic text-biga-dark">Pendientes de Cocina</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pendingOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onDetail={handleDetail}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onComplete={handleComplete}
            />
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: HISTORIAL (TODOS LOS DEMÁS) */}
      <section className="opacity-80">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-1 w-8 bg-slate-300 rounded-full"></div>
          <h2 className="text-xl font-black tracking-tighter uppercase italic text-slate-400">Historial Reciente</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {historyOrders.slice(0, 8).map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onDetail={handleDetail}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-biga-dark/90 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-sm text-center shadow-2xl border-4 border-biga-orange/20">
            <div className="w-20 h-20 bg-biga-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">💰</div>
            <h3 className="text-2xl font-black uppercase mb-2 tracking-tighter text-biga-dark italic">Cerrar Pedido</h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-8">Selecciona el método de pago</p>
            
            <div className="grid gap-4">
              {['efectivo', 'yape', 'plin'].map(m => (
                <button
                  key={m}
                  onClick={() => executeFinishOrder(selectedOrder.id, m)}
                  className="w-full py-5 bg-slate-50 border-2 border-slate-100 hover:border-biga-orange hover:bg-biga-orange/5 rounded-2xl font-black uppercase text-xs transition-all text-biga-dark hover:text-biga-orange"
                >
                  {m}
                </button>
              ))}
            </div>
            <button 
                onClick={() => setShowPaymentModal(false)} 
                className="mt-8 text-slate-300 font-black text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors"
            >
                Volver Atrás
            </button>
          </div>
        </div>
      )}
      <OrderDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}

export default Orders;