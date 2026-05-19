import React, { useState, useEffect } from 'react';
import OrderCard from './components/OrderCard';
import OrderDetailModal from './components/OrderDetailModal';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock } from 'lucide-react';
import api from '../../assets/services/api';
import { toast } from '../../assets/services/notifications';
import Modal from '../../components/Modal';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);  
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Estado para Modal de Confirmación
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: null, title: '', message: '' });
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
        toast("Error al cargar pedidos", "error");
      }
    } catch (error) {
      console.error("Error de red:", error);
      setOrders([]);
      toast("Error de conexión", "error");
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
  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Anular Pedido",
      message: "¿Anular este pedido? El registro quedará guardado como 'Anulado'.",
      onConfirm: async () => {
        try {
          const response = await api(`/orders/${id}`, {
            method: 'DELETE', 
          });
  
          if (response && response.ok) {
            toast("Pedido anulado", "success");
            setOrders(prevOrders =>
              prevOrders.map(order =>
                order.id === id ? { ...order, status: 'cancelled' } : order
              )
            );
          } else {
            toast("No se pudo anular", "error");
          }
        } catch (error) {
          toast("Error de conexión", "error");
          console.error("Error al anular:", error);
        }
      }
    });
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
        toast("Pedido finalizado", "success");
        await fetchOrders(); 
      } else {
        const data = await res?.json();
        toast(data?.errors || "Error al cerrar pedido", "error");
      }
    } catch (error) {
      toast("Error de conexión", "error");
      console.error("Error al cerrar pedido:", error);
    } finally {
      setShowPaymentModal(false);
    }
  };

  return (
    <div className="p-8 bg-slate-200 min-h-screen ml-4">
      <Modal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        title={confirmModal.title}
        type="danger"
        onConfirm={confirmModal.onConfirm}
      >
        {confirmModal.message}
      </Modal>

      <div className="flex justify-between items-center mb-12 py-4">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Panel de Pedidos<span className="text-biga-orange">.</span>
          </h1>
          <p className="text-slate-600 font-bold uppercase text-[10px] tracking-[0.4em] mt-3">BIGA PIZZERIA · Central de Comandas</p>
        </div>

        <button
          onClick={() => navigate("/orders/new")}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 rounded-2xl font-black shadow-lg shadow-orange-200 hover:scale-105 transition-all flex items-center gap-3 uppercase text-xs active:scale-95"
        >
          <Plus size={24} strokeWidth={3} /> Nuevo Pedido
        </button>
      </div>

      {/* SECCIÓN 1: PENDIENTES (COMANDAS VIVAS) */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-3 w-12 bg-biga-orange rounded-full"></div>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic text-slate-900">Pendientes de Cocina</h2>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 rounded-[2.5rem] bg-white/50 shadow-inner">
            <Clock size={48} className="text-slate-300 mb-4" />
            <p className="text-xl font-black text-slate-400 uppercase italic tracking-tight">Sin pedidos en preparación</p>
          </div>
        ) : (
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
        )}
      </section>

      {/* SECCIÓN 2: HISTORIAL (TODOS LOS DEMÁS) */}
      <section className="opacity-80">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-1 w-8 bg-slate-400 rounded-full"></div>
          <h2 className="text-xl font-black tracking-tighter uppercase italic text-slate-500">Historial Reciente</h2>
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

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Cerrar Pedido"
        type="info"
        confirmText="Confirmar Pago"
        onConfirm={null} // El pago se maneja por los botones internos por ahora, o podríamos refactorizarlo
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-biga-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">💰</div>
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
        </div>
      </Modal>

      <OrderDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}

export default Orders;