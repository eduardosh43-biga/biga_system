import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";

const PromoModal = ({ isOpen, onClose, fetchData, promoToEdit, recipes }) => {
    const [promo, setPromo] = useState({ name: "", sale_price: "", promotion_items_attributes: [] });

    useEffect(() => {
        if (promoToEdit) {
            setPromo({
                ...promoToEdit,
                promotion_items_attributes: promoToEdit.promotion_items.map(pi => ({
                    id: pi.id, recipe_id: pi.recipe_id, quantity: pi.quantity
                }))
            });
        } else {
            setPromo({ name: "", sale_price: "", promotion_items_attributes: [] });
        }
    }, [promoToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = promoToEdit ? `http://localhost:3000/api/v1/promotions/${promoToEdit.id}` : "http://localhost:3000/api/v1/promotions";
        const method = promoToEdit ? "PATCH" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ promotion: promo }),
            });
            if (res.ok) { fetchData(); onClose(); }
        } catch (error) { console.error(error); }
    };

    const handleRemoveItem = (index) => {
        const itemToRemove = promo.promotion_items_attributes[index];

        let newAttributes;
        if (itemToRemove.id) {
            // Si el item ya existe en la DB, le ponemos _destroy: true en lugar de borrarlo del array
            newAttributes = promo.promotion_items_attributes.map((item, i) =>
                i === index ? { ...item, _destroy: true } : item
            );
        } else {
            // Si es un item nuevo (no tiene ID), lo podemos filtrar normalmente
            newAttributes = promo.promotion_items_attributes.filter((_, i) => i !== index);
        }

        setPromo({ ...promo, promotion_items_attributes: newAttributes });
    };

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] p-10 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto text-slate-900">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-3xl font-black uppercase tracking-tighter">Configurar Combo</h3>
                    <button onClick={onClose}><X size={32} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Nombre Combo" className="bg-gray-50 border-2 p-4 rounded-2xl font-bold"
                            value={promo.name} onChange={(e) => setPromo({ ...promo, name: e.target.value })}
                        />
                        <input
                            type="number" placeholder="Precio Venta" className="bg-gray-50 border-2 p-4 rounded-2xl font-bold"
                            value={promo.sale_price} onChange={(e) => setPromo({ ...promo, sale_price: e.target.value })}
                        />
                    </div>
                    <div className="bg-blue-50 p-6 rounded-[2rem] border-2 border-blue-100">
                        <h4 className="text-xs font-black text-blue-600 uppercase mb-4">Contenido del Combo</h4>
                        <select
                            className="w-full p-4 rounded-xl font-bold mb-4"
                            onChange={(e) => {
                                if (!e.target.value) return;
                                const recipeId = parseInt(e.target.value);
                                setPromo({ ...promo, promotion_items_attributes: [...promo.promotion_items_attributes, { recipe_id: recipeId, quantity: 1 }] });
                            }}
                        >
                            <option value="">Añadir producto...</option>
                            {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                        <div className="space-y-2">
                            {promo.promotion_items_attributes.map((item, index) => {
                                if (item._destroy) return null;
                                return (
                                <div key={index} className="flex justify-between items-center bg-white p-3 rounded-xl">
                                    <span className="font-bold text-sm text-slate-700">{recipes.find(r => r.id === item.recipe_id)?.name}</span>
                                        <button type="button" onClick={() => handleRemoveItem(index)}>
                                        <Trash2 size={16} className="text-red-500" />
                                    </button>
                                </div>
                                )
                            })}
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">Guardar Promoción</button>
                </form>
            </div>
        </div>
    );
};

export default PromoModal;