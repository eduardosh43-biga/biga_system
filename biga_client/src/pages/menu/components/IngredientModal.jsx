import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";

const IngredientModal = ({ selectedRecipe, setSelectedRecipe, ingredients, fetchData }) => {
    const [addIng, setAddIng] = useState({ ingredient_id: "", quantity: "" });

    if (!selectedRecipe) return null;

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3000/api/v1/recipe_ingredients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recipe_ingredient: { ...addIng, recipe_id: selectedRecipe.id } }),
            });
            if (res.ok) {
                const updated = await res.json();
                setSelectedRecipe(updated);
                setAddIng({ ingredient_id: "", quantity: "" });
                fetchData();
            }
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/api/v1/recipe_ingredients/${id}`, { method: "DELETE" });
            if (res.ok) {
                const resRec = await fetch(`http://localhost:3000/api/v1/recipes/${selectedRecipe.id}`);
                setSelectedRecipe(await resRec.json());
                fetchData();
            }
        } catch (error) { console.error(error); }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
                <div className="p-10 md:w-1/2 bg-gray-50/50">
                    <button onClick={() => setSelectedRecipe(null)} className="mb-6"><X size={32} /></button>
                    <h3 className="text-4xl font-black uppercase">{selectedRecipe.name}</h3>
                    <p className="text-blue-600 font-bold mb-10 text-xs">Añadir Insumos</p>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <select
                            className="w-full p-4 rounded-xl font-bold border-2"
                            value={addIng.ingredient_id}
                            onChange={(e) => setAddIng({ ...addIng, ingredient_id: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar...</option>
                            {ingredients.map(i => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                        </select>
                        <div className="flex gap-2">
                            <input
                                type="number" step="0.001" placeholder="Cantidad" required className="flex-1 p-4 rounded-xl border-2 font-bold"
                                value={addIng.quantity}
                                onChange={(e) => setAddIng({ ...addIng, quantity: e.target.value })}
                            />
                            <button type="submit" className="bg-gray-900 text-white px-6 rounded-xl font-black italic">AÑADIR</button>
                        </div>
                    </form>
                </div>
                <div className="p-10 md:w-1/2 overflow-y-auto bg-white">
                    <h4 className="text-xs font-black text-gray-400 uppercase mb-6">Insumos Actuales</h4>
                    <div className="space-y-4">
                        {selectedRecipe.recipe_ingredients?.map((ri) => (
                            <div key={ri.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border-2 hover:border-red-100 transition-all">
                                <div>
                                    <p className="font-bold">{ri.ingredient_name}</p>
                                    <p className="text-sm text-gray-500">{ri.quantity} {ri.unit} — S/ {ri.subtotal}</p>
                                </div>
                                <button onClick={() => handleDelete(ri.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={20} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IngredientModal;