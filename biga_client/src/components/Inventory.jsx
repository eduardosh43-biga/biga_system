import { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, X, Calendar } from 'lucide-react';

const Inventory = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados Modal 1: Nuevo Insumo
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('kg');
  const [minimumStock, setMinimumStock] = useState(0); // <--- Estado para el mínimo

  // Estados Modal 2: Gestionar Lotes
  const [selectedIng, setSelectedIng] = useState(null);
  const [batchData, setBatchData] = useState({ quantity: '', cost: '', expiry_date: '' });

  const fetchIngredients = () => {
    fetch('http://localhost:3000/api/v1/ingredients')
      .then(res => res.json())
      .then(data => {
        setIngredients(data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchIngredients(); }, []);

  const handleSaveIngredient = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/v1/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredient: { name, unit, minimum_stock: minimumStock } })
      });
      if (response.ok) {
        setIsModalOpen(false);
        setName('');
        setMinimumStock(0);
        fetchIngredients();
      }
    } catch (error) { console.error(error); }
  };

  const handleSaveBatch = async (e) => {
    e.preventDefault();
  
    // 1. Calculamos el costo unitario (Costo Total / Cantidad)
    const calculatedUnitPrice = parseFloat(batchData.cost) / parseFloat(batchData.quantity);
  
    const payload = {
      inventory_batch: {
        ingredient_id: selectedIng.id,
        quantity: batchData.quantity,
        cost_per_unit: calculatedUnitPrice.toFixed(2), // <--- ¡Aquí ocurre la magia!
        expiry_date: batchData.expiry_date
      }
    };
  
    try {
      const response = await fetch('http://localhost:3000/api/v1/inventory_batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      if (response.ok) {
        setSelectedIng(null);
        setBatchData({ quantity: '', cost: '', expiry_date: '' });
        fetchIngredients();
      }
    } catch (error) {
      console.error("Error al registrar lote:", error);
    }
  };

  const handleDeleteBatch = async (batchId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este lote? El stock se restará automáticamente.")) return;
  
    try {
      const response = await fetch(`http://localhost:3000/api/v1/inventory_batches/${batchId}`, {
        method: 'DELETE'
      });
  
      if (response.ok) {
        // Recargamos los ingredientes para que el stock se actualice en la tarjeta principal
        fetchIngredients();
        // También necesitamos actualizar el modal actual. 
        // Una forma rápida es cerrar el modal o volver a buscar el ingrediente específico.
        setSelectedIng(null); 
      }
    } catch (error) {
      console.error("Error al eliminar lote:", error);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Cargando almacén...</div>;

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-gray-800">Almacén de Insumos</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-200"
        >
          <Plus size={20} className="inline mr-2" /> Nuevo Insumo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(ingredients) && ingredients.map((ing) => {
          // Lógica de alertas
          const isLowStock = ing.low_stock;
          const isNearExpiry = ing.near_expiry;

          return (
            <div key={ing.id} className={`bg-white rounded-2xl shadow-sm p-6 border-l-[12px] transition-all hover:scale-[1.02] ${
              isNearExpiry ? 'border-red-500 bg-red-50/30' : 
              isLowStock ? 'border-amber-500 bg-amber-50/30' : 'border-green-500'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{ing.name}</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Mínimo: {ing.minimum_stock} {ing.unit}
                  </p>
                </div>
                <div className="flex gap-2">
                  {isLowStock && <Package size={20} className="text-amber-600" />}
                  {isNearExpiry && <AlertTriangle size={20} className="text-red-600 animate-pulse" />}
                </div>
              </div>

              <div className="flex items-end justify-between mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-black text-gray-900">{ing.stock}</span>
                  <span className="text-sm font-bold text-gray-400 uppercase">{ing.unit}</span>
                </div>
                <button 
                  onClick={() => setSelectedIng(ing)}
                  className="text-xs font-black text-blue-600 uppercase border-b-2 border-blue-100"
                >
                  Gestionar Lotes
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: NUEVO INSUMO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 backdrop-blur-md p-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6 text-gray-800">
              <h3 className="text-2xl font-black">Nuevo Insumo</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSaveIngredient} className="space-y-6">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase block mb-2">Nombre</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-red-500" placeholder="Ej: Queso Mozzarella" />
              </div>
              
              {/* AQUÍ VA EL INPUT DEL MÍNIMO (DENTRO DEL MODAL) */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase block mb-2">Stock Mínimo de Alerta</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    value={minimumStock} 
                    onChange={(e) => setMinimumStock(e.target.value)} 
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-red-500 font-bold text-gray-700"
                    min="0"
                  />
                  <span className="font-bold text-gray-400 uppercase">{unit}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase block mb-2">Unidad</label>
                <div className="grid grid-cols-4 gap-2">
                  {['kg', 'gr', 'lt', 'un'].map(u => (
                    <button key={u} type="button" onClick={() => setUnit(u)} className={`py-2 rounded-lg font-bold text-sm ${unit === u ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>{u}</button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-red-700 transition-all uppercase">Crear Insumo</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: GESTIONAR LOTES (LISTADO + REGISTRO) */}
{selectedIng && (
  <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 backdrop-blur-md p-4">
    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border-4 border-blue-50">
      
      {/* Cabecera del Modal */}
      <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter">Control de Lotes</h3>
          <p className="opacity-80 font-bold">{selectedIng.name} ({selectedIng.unit})</p>
        </div>
        <button onClick={() => setSelectedIng(null)} className="hover:rotate-90 transition-transform">
          <X size={32} />
        </button>
      </div>

      <div className="p-8 max-h-[80vh] overflow-y-auto">
        
        {/* SECCIÓN 1: LISTADO DE LOTES EXISTENTES */}
        <div className="mb-10">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Package size={16} /> Lotes en Almacén
          </h4>
          
          <div className="space-y-3">
            {selectedIng.inventory_batches && selectedIng.inventory_batches.length > 0 ? (
              selectedIng.inventory_batches.map((batch) => (
                <div key={batch.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="grid grid-cols-3 gap-8 flex-1">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase">Cantidad</p>
                      <p className="text-lg font-black text-gray-800">{batch.quantity} {selectedIng.unit}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase">Costo Un.</p>
                      <p className="text-lg font-bold text-blue-600">S/ {batch.cost_per_unit}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase">Vencimiento</p>
                      <p className={`text-lg font-bold ${new Date(batch.expiry_date) < new Date() ? 'text-red-500' : 'text-gray-700'}`}>
                        {batch.expiry_date}
                      </p>
                    </div>
                  </div>
                  
                  {/* Botón para eliminar lote (CRUD) */}
                  <button 
                    onClick={() => handleDeleteBatch(batch.id)}
                    className="ml-4 p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-gray-400 italic">No hay lotes registrados para este insumo.</p>
            )}
          </div>
        </div>

        {/* SECCIÓN 2: FORMULARIO PARA NUEVO LOTE */}
        <div className="pt-8 border-t-2 border-dashed border-gray-100">
          <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Ingresar Nuevo Lote</h4>
          <form onSubmit={handleSaveBatch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="number" step="0.01" placeholder="Cant." required 
              className="bg-gray-50 p-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-blue-500"
              onChange={e => setBatchData({...batchData, quantity: e.target.value})} 
            />
            <input 
              type="number" step="0.01" placeholder="Costo Tot." required 
              className="bg-gray-50 p-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-blue-500"
              onChange={e => setBatchData({...batchData, cost: e.target.value})} 
            />
            <input 
              type="date" required 
              className="bg-gray-50 p-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-blue-500"
              onChange={e => setBatchData({...batchData, expiry_date: e.target.value})} 
            />
            <button className="md:col-span-3 bg-blue-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest">
              Registrar Lote
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Inventory;