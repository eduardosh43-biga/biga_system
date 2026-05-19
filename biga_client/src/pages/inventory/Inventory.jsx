import { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, X, Calendar, Pencil, Trash2 } from 'lucide-react';
import api from '../../assets/services/api';
import { toast } from '../../assets/services/notifications';
import Modal from '../../components/Modal';

const Inventory = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados Modal 1: Nuevo Insumo
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('kg');
  const [minimumStock, setMinimumStock] = useState(0); 

  // Estados Modal 2: Gestionar Lotes
  const [selectedIng, setSelectedIng] = useState(null);
  const [batchData, setBatchData] = useState({ quantity: '', cost: '', expiry_date: '' });

  // Estados modal 3: Editar los cards de ingredientes
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);

  // Estado para Modal de Confirmación Genérico
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    onConfirm: null, 
    type: 'info' 
  });

  const fetchIngredients = async () => {
    try {
      const res = await api('/ingredients');
      if (res && res.ok) {
        const data = await res.json();
        setIngredients(data);
      }
    } catch (error) {
      toast("Error al cargar insumos", "error");
      console.error("Error fetching ingredients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchIngredients(); 
  }, []);

  const handleSaveIngredient = async (e) => {
    e.preventDefault();
    try {
      const response = await api('/ingredients', {
        method: 'POST',
        body: { ingredient: { name, unit, minimum_stock: minimumStock } }
      });
      if (response && response.ok) {
        setIsModalOpen(false);
        setName('');
        setMinimumStock(0);
        toast("Insumo creado correctamente", "success");
        await fetchIngredients();
      } else {
        toast("No se pudo crear el insumo", "error");
      }
    } catch (error) { 
      toast("Error de conexión", "error");
      console.error(error); 
    }
  };

  const handleSaveBatch = async (e) => {
    e.preventDefault();
    const calculatedUnitPrice = parseFloat(batchData.cost) / parseFloat(batchData.quantity);
  
    const payload = {
      inventory_batch: {
        ingredient_id: selectedIng.id,
        quantity: batchData.quantity,
        cost_per_unit: calculatedUnitPrice.toFixed(2),
        expiry_date: batchData.expiry_date
      }
    };
  
    try {
      const response = await api('/inventory_batches', {
        method: 'POST',
        body: payload
      });
  
      if (response && response.ok) {
        toast("Lote registrado con éxito", "success");
        setSelectedIng(null);
        setBatchData({ quantity: '', cost: '', expiry_date: '' });
        await fetchIngredients();
      } else {
        toast("Error al registrar lote", "error");
      }
    } catch (error) {
      toast("Error de conexión", "error");
      console.error("Error al registrar lote:", error);
    }
  };

  const handleDeleteBatch = (batchId) => {
    setConfirmModal({
      isOpen: true,
      title: "Eliminar Lote",
      message: "¿Seguro que quieres eliminar este lote? El stock se restará automáticamente.",
      type: "danger",
      onConfirm: async () => {
        try {
          const response = await api(`/inventory_batches/${batchId}`, {
            method: 'DELETE'
          });
      
          if (response && response.ok) {
            toast("Lote eliminado", "success");
            await fetchIngredients();
            setSelectedIng(null); 
          } else {
            toast("No se pudo eliminar el lote", "error");
          }
        } catch (error) {
          toast("Error de conexión", "error");
          console.error("Error al eliminar lote:", error);
        }
      }
    });
  };

  const handleUpdateIngredient = async (e) => {
    e.preventDefault();
    try {
      const res = await api(`/ingredients/${editingIngredient.id}`, {
        method: 'PATCH',
        body: { ingredient: editingIngredient }
      });
  
      if (res && res.ok) {
        toast("Insumo actualizado", "success");
        setIsEditModalOpen(false);
        await fetchIngredients();
      } else {
        toast("Error al actualizar insumo", "error");
      }
    } catch (error) {
      toast("Error de conexión", "error");
      console.error("Error al actualizar:", error);
    }
  };

  const handleDeleteIngredient = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Eliminar Insumo",
      message: "¿Estás seguro? Si borras este insumo, se quitará de todas las recetas de BIGA.",
      type: "danger",
      onConfirm: async () => {
        try {
          const res = await api(`/ingredients/${id}`, {
            method: 'DELETE'
          });
          if (res && res.ok) {
            toast("Insumo eliminado", "success");
            await fetchIngredients();
          } else {
            toast("No se pudo eliminar el insumo", "error");
          }
        } catch (error) {
          toast("Error de conexión", "error");
          console.error("Error al eliminar:", error);
        }
      }
    });
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Cargando almacén...</div>;

  return (
    <div className="relative ml-4 mt-4">
      {/* Modal de Confirmación */}
      <Modal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        title={confirmModal.title}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
      >
        {confirmModal.message}
      </Modal>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Almacén de Insumos</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-orange-200 hover:scale-105 transition-all flex items-center gap-2 uppercase text-xs active:scale-95"
        >
          <Plus size={20} className="inline mr-2" /> Nuevo Insumo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(ingredients) && ingredients.map((ing) => {
          const isLowStock = ing.low_stock;
          const isNearExpiry = ing.near_expiry;
          const stockLevel = Math.min((ing.stock / (ing.minimum_stock || 1)) * 100, 100);

          return (
            <div key={ing.id} className={`group relative bg-white rounded-2xl shadow-xl p-6 border-l-[6px] transition-all hover:scale-[1.01] ${
              isNearExpiry ? 'border-red-500 shadow-red-100/20' : 
              isLowStock ? 'border-amber-500 shadow-amber-100/20' : 'border-emerald-500 shadow-slate-200/50'
            }`}>
              {/* Acciones Rápidas (Discretas) */}
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setEditingIngredient(ing); setIsEditModalOpen(true); }}
                  className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteIngredient(ing.id)}
                  className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{ing.name}</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
                    Mínimo: {ing.minimum_stock} {ing.unit}
                  </p>
                </div>
                {isNearExpiry && (
                  <div className="bg-red-50 p-2 rounded-full">
                    <AlertTriangle size={16} className="text-red-500 animate-pulse" />
                  </div>
                )}
              </div>

              <div className="flex items-end justify-between mt-8">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-black text-slate-900 font-mono tracking-tighter leading-none">{ing.stock}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ing.unit}</span>
                </div>
                <button 
                  onClick={() => setSelectedIng(ing)}
                  className="text-[10px] font-black text-blue-600 uppercase border-b border-blue-100 hover:border-blue-600 transition-all tracking-widest pb-0.5"
                >
                  Gestionar Lotes
                </button>
              </div>

              {/* Barra de Stock Visual */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nivel de Stock</span>
                  <span className={`text-[9px] font-black uppercase ${isLowStock ? 'text-red-500' : 'text-emerald-500'}`}>
                    {isLowStock ? 'Crítico' : 'Óptimo'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ease-out ${isLowStock ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${stockLevel}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: NUEVO INSUMO */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Insumo"
        type="info"
        confirmText="Crear Insumo"
        onConfirm={() => {
          // Para que funcione con el form actual, simulamos el submit o refactorizamos
          document.getElementById('new-ingredient-form')?.requestSubmit();
        }}
      >
        <form id="new-ingredient-form" onSubmit={handleSaveIngredient} className="space-y-6">
          <div>
            <label className="text-xs font-black text-gray-400 uppercase block mb-2">Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-red-500" placeholder="Ej: Queso Mozzarella" />
          </div>
          
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
        </form>
      </Modal>

      {/* MODAL 2: GESTIONAR LOTES */}
      {selectedIng && (
        <div 
          className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 backdrop-blur-md p-4 cursor-pointer"
          onClick={() => setSelectedIng(null)}
        >
          <div 
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border-4 border-blue-50 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
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
                  <button className="md:col-span-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-black shadow-lg shadow-orange-200 hover:scale-[1.02] transition-all uppercase tracking-widest">
                    Registrar Lote
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDITAR INSUMO */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Insumo"
        type="info"
        confirmText="Guardar Cambios"
        onConfirm={() => {
          document.getElementById('edit-ingredient-form')?.requestSubmit();
        }}
      >
        {editingIngredient && (
          <form id="edit-ingredient-form" onSubmit={handleUpdateIngredient} className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block tracking-widest">Nombre del Insumo</label>
              <input 
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold text-gray-700"
                value={editingIngredient.name}
                onChange={e => setEditingIngredient({...editingIngredient, name: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block tracking-widest">Unidad</label>
                <input 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold text-gray-700"
                  value={editingIngredient.unit}
                  onChange={e => setEditingIngredient({...editingIngredient, unit: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block tracking-widest">Stock Mínimo</label>
                <input 
                  type="number" step="0.01"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold text-gray-700"
                  value={editingIngredient.minimum_stock}
                  onChange={e => setEditingIngredient({...editingIngredient, minimum_stock: e.target.value})}
                  required
                />
              </div>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};

export default Inventory;