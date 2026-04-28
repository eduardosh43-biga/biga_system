import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar'; 
import CartSideBar from '../../components/CartSideBar';
import Menu from '../menu/Menu'; 
import { ArrowLeft } from 'lucide-react';
import api from '../../assets/services/api';

const OrdersNew = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState("mesa");
  const [tableNumber, setTableNumber] = useState("");
  const [deliveryAddress,setDeliveryAddress] = useState("");
  const [deliveryFee,setDeliveryFee] = useState("");
  const [mermaReason, setMermaReason] = useState("")

  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit_id');

  useEffect(() => {
    if (editId) {
      const loadOrderToEdit = async () => {
        try {
          const res = await api(`/orders/${editId}`);
          if (res && res.ok) {
            const data = await res.json();
            setCustomerName(data.customer_name);
            setOrderType(data.order_type);
            const loadedCart = data.order_items.map(item => ({
              id: item.itemable_id,
              order_item_id: item.id,
              name: item.itemable_name,
              price: item.unit_price,
              quantity: item.quantity,
              isPromo: item.itemable_type === 'Promotion'
            }));
            setCart(loadedCart);
          }
        } catch (error) {
          console.error("Error cargando pedido para editar", error);
        }
      };
      loadOrderToEdit();
    }
  }, [editId]);

  const handleAddToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      const price = item.isPromo ? item.sale_price : item.price;
      return [...prev, { ...item, price, quantity: 1 }];
    });
  };

  const handleSubmit = async () => {
    const method = editId ? "PATCH" : "POST";
    const endpoint = editId ? `/orders/${editId}` : "/orders";

    const orderData = {
      order: {
        customer_name: orderType === 'merma' ? `MERMA: ${mermaReason}` : customerName,
        order_type: orderType,
        status: 'pending',
        table_number: orderType === 'mesa' ? tableNumber : null,
        delivery_address: orderType === 'delivery' ? deliveryAddress : null,
        delivery_fee: orderType === 'delivery' ? parseFloat(deliveryFee || 0) : 0,
        order_items_attributes: cart.map(item => ({
          id: item.order_item_id,
          itemable_id: item.id,
          itemable_type: item.isPromo ? 'Promotion' : 'Recipe',
          quantity: item.quantity,                    
          unit_price: (orderType === 'merma' || orderType === 'personal') ? 0 : item.price
        }))
      }
    };

    try {
      const response = await api(endpoint, {
        method: method,
        body: orderData
      });

      if (response && response.ok) {
        navigate('/orders');
      } else if (response) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* 1. SIDEBAR (Con lógica de hamburguesa para móvil) */}
      <Sidebar />

      {/* 2. EL MENÚ (Centro) */}
      <div className="flex-1 overflow-y-auto ml-0 lg:ml-64 p-4">
        <header className="mb-4 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">          
            <h1 className="text-xl font-black italic">MODO VENTA - BIGA</h1>
            <button onClick={() => navigate('/orders')} className="text-slate-400 text-sm font-bold"><ArrowLeft size={20} strokeWidth={5}/>CANCELAR</button>
          
        </header>

        {/* Reutilizamos tu Menu.jsx pasándole el viewMode */}
        <Menu viewMode="pos" onItemClick={handleAddToCart} />
      </div>

      {/* 3. EL CARRITO GLOBAL (Derecha) */}
      <div className="hidden xl:block w-96 shrink-0">
        <CartSideBar 
          cart={cart} 
          setCart={setCart}
          customerName={customerName}
          setCustomerName={setCustomerName}
          orderType={orderType}
          setOrderType={setOrderType}
          onSubmit={handleSubmit}
          setTableNumber={setTableNumber}
          setDeliveryAddress={setDeliveryAddress}
          setDeliveryFee={setDeliveryFee}
                  setMermaReason={setMermaReason}
        />
      </div>
    </div>
  );
};

export default OrdersNew;

