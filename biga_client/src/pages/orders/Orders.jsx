import React, { useState, useEffect } from 'react';
import OrderCard from './components/OrderCard';
import OrderDetailModal from './components/OrderDetailModal';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

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
      const res = await fetch("http://localhost:3000/api/v1/orders");
      if (res.ok) {
        const data = await res.json();
        // Verificamos que los datos sean un array antes de guardarlos
        setOrders(Array.isArray(data) ? data : []);
      } else {
        console.error("Error del servidor (500)");
        setOrders([]); // Si falla, dejamos el array vacío
      }
    } catch (error) {
      console.error("Error de red:", error);
      setOrders([]);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // 2. LOGICA: VER DETALLE
  const handleDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // 3. LOGICA: ELIMINAR
  const handleDelete = async (id) => {
    if (window.confirm("¿Anular este pedido? El registro quedará guardado como 'Anulado'.")) {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/orders/${id}`, {
          method: 'DELETE', 
        });

        if (response.ok) {          
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
    // Redirigimos a la página de creación pero pasando el ID por la URL
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
    
    if (!id)return; 
    // Verificación rápida
    console.log("Enviando pago:", method);
    try {
      const res = await fetch(`http://localhost:3000/api/v1/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: {
            status: 'completed',
            payment_method: method
          }
        })
      });

      if (res.ok) {
        setShowPaymentModal(false);
        fetchOrders(); // Refrescar la lista para que pase al historial
      }
    } catch (error) {
      console.error("Error al cerrar pedido:", error);
    }
  };

  return (
    
    <div className="p-8 bg-slate-200 min-h-screen ml-4">
      <div className="flex justify-between items-center mb-10 bg-white/50 p-6 rounded-3xl backdrop-blur-sm shadow-sm border border-white/20">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Panel de Pedidos</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">BIGA · Central de Comandas</p>
        </div>

        <button
          onClick={() => navigate("/orders/new")}
          className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-green-700 transition-all flex items-center gap-2 uppercase text-xs active:scale-95"
        >
          <Plus size={20} strokeWidth={3} /> Nuevo Pedido
        </button>
      </div>
      {/* SECCIÓN 1: PENDIENTES (COMANDAS VIVAS) */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-4 w-4 bg-red-600 rounded-full animate-pulse"></div>
          <h2 className="text-2xl font-black tracking-tighter uppercase">Pendientes de Cocina</h2>
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
      <section className="opacity-75">
        <h2 className="text-xl font-black tracking-tighter uppercase mb-8 text-slate-500">Historial Reciente</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[300] flex items-center justify-center">
          <div className="bg-white p-8 rounded-[3rem] w-80 text-center shadow-2xl">
            <h3 className="text-xl font-black uppercase mb-6 tracking-tighter">¿Cómo pagó el cliente?</h3>
            <div className="grid gap-3">
              {['efectivo', 'yape', 'plin'].map(m => (
                <button
                  key={m}
                  onClick={() => executeFinishOrder(selectedOrder.id, m)}
                  className="w-full py-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl font-black uppercase text-xs transition-all"
                >
                  {m}
                </button>
              ))}
            </div>
            <button onClick={() => setShowPaymentModal(false)} className="mt-6 text-slate-300 font-bold text-[10px] uppercase">Cancelar</button>
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