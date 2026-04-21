import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar'; 
import CartSideBar from '../../components/CartSideBar';
import Menu from '../menu/Menu'; 
import { ArrowLeft } from 'lucide-react';

const OrdersNew = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState("mesa");
  const [tableNumber, setTableNumber] = useState("");
  const [deliveryAddress,setDeliveryAddress] = useState("");
  const [deliveryFee,setDeliveryFee] = useState("");


  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit_id');

    useEffect(() => {
        if (editId) {
            // Si hay un edit_id, pedimos los datos a la API
            const loadOrderToEdit = async () => {
                try {
                    const res = await fetch(`http://localhost:3000/api/v1/orders/${editId}`);
                    const data = await res.json();

                    // Llenamos los estados con lo que trajo Rails
                    setCustomerName(data.customer_name);
                    setOrderType(data.order_type);

                    // Convertimos los items al formato que entiende tu carrito
                    const loadedCart = data.order_items.map(item => ({
                        id: item.itemable_id, // ID de la Pizza o Promo
                        order_item_id: item.id, // ID del registro en la tabla intermedia (IMPORTANTE)
                        name: item.itemable_name,
                        price: item.unit_price,
                        quantity: item.quantity,
                        isPromo: item.itemable_type === 'Promotion'
                    }));
                    setCart(loadedCart);
                } catch (error) {
                    console.error("Error cargando pedido para editar", error);
                }
            };
            loadOrderToEdit();
        }
    }, [editId]); // Este efecto solo corre cuando el editId cambia

  // Función para capturar los clicks del menú
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
        const url = editId
            ? `http://localhost:3000/api/v1/orders/${editId}`
            : "http://localhost:3000/api/v1/orders";

        // Preparamos los datos según tu SCHEMA
        const orderData = {
            order: {
                // Lógica de nombre: Si es merma, guardamos la razón ahí
                customer_name: orderType === 'merma' ? `MERMA: ${mermaReason}` : customerName,
                order_type: orderType,
                status: 'pending',

                // Campos específicos del Schema (solo se envían si corresponden)
                table_number: orderType === 'mesa' ? tableNumber : null,
                delivery_address: orderType === 'delivery' ? deliveryAddress : null,
                delivery_fee: orderType === 'delivery' ? parseFloat(deliveryFee || 0) : 0,

                // Atributos anidados para los productos
                order_items_attributes: cart.map(item => ({
                    id: item.order_item_id, // Para que Rails sepa si editar uno existente
                    itemable_id: item.id,
                    itemable_type: item.isPromo ? 'Promotion' : 'Recipe',
                    quantity: item.quantity,
                    // Si es merma, el precio unitario es 0 para no inflar tus ventas
                    unit_price: orderType === 'merma' ? 0 : item.price
                }))
            }
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                // No cambiamos el estilo de los mensajes de éxito
                navigate('/orders');
            } else {
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
        />
      </div>
    </div>
  );
};

export default OrdersNew;

