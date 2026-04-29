import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../../../assets/services/api";

const RecipeModal = ({ isOpen, onClose, fetchData, recipeToEdit }) => {
    const [recipe, setRecipe] = useState({ name: "", price: "", category: "pizza" });

    useEffect(() => {
        if (recipeToEdit) setRecipe(recipeToEdit);
        else setRecipe({ name: "", price: "", category: "pizza" });
    }, [recipeToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = recipeToEdit
            ? `/recipes/${recipeToEdit.id}`
            : "/recipes";

        const method = recipeToEdit ? "PATCH" : "POST";

        try {
            const res = await api(url, {
                method,
                body: { recipe },
            });
            if (res && res.ok) {
                await fetchData();
                onClose();
            }
        } catch (error) {
            console.error("Error saving recipe:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl text-slate-900">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-3xl font-black tracking-tighter uppercase">
                        {recipeToEdit ? "Editar Producto" : "Nuevo Producto"}
                    </h3>
                    <button onClick={onClose}><X size={32} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs font-black text-gray-400 uppercase block mb-3 ml-2">Nombre</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-red-500 font-bold"
                            value={recipe.name}
                            onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-gray-400 uppercase block mb-3 ml-2">Categoría</label>
                        <select
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold"
                            value={recipe.category}
                            onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
                        >
                            <option value="pizza">Pizza</option>
                            <option value="bebida_reventa">Gaseosas</option>
                            <option value="bebida_casa">Bebida Casa</option>
                            <option value="entrada">Entrada</option>
                            <option value="postre">Postre</option>
                            <option value="promo">Promocion</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-black text-gray-400 uppercase block mb-3 ml-2">Precio de Venta</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold"
                            value={recipe.price}
                            onChange={(e) => setRecipe({ ...recipe, price: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange-200 hover:scale-[1.02] transition-all">
                        {recipeToEdit ? "Guardar Cambios" : "Crear Plato"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RecipeModal;