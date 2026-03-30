import { useState, useEffect } from "react";
import {
  ChefHat,
  Plus,
  Pencil,
  Trash2,
  Utensils,
  X,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // 1. Actualizamos el estado inicial para incluir la categoría
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    price: "",
    category: "pizza",
  });
  const [addIng, setAddIng] = useState({ ingredient_id: "", quantity: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resRec, resIng] = await Promise.all([
        fetch("http://localhost:3000/api/v1/recipes"),
        fetch("http://localhost:3000/api/v1/ingredients"),
      ]);
      setRecipes(await resRec.json());
      setIngredients(await resIng.json());
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreateRecipe = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/v1/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe: newRecipe }),
      });
      if (res.ok) {
        setIsRecipeModalOpen(false);
        setNewRecipe({ name: "", price: "", category: "pizza" });
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateRecipe = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/recipes/${recipeToEdit.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipe: recipeToEdit }),
        },
      );
      if (res.ok) {
        setIsEditMode(false);
        setRecipeToEdit(null);
        fetchData(); // Recargamos para ver los nuevos márgenes calculados
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este plato de BIGA?")) {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/recipes/${id}`, {
          method: "DELETE",
        });
        if (res.ok) fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Función para vincular un ingrediente a la receta
  const handleAddIngredient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost:3000/api/v1/recipe_ingredients",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipe_ingredient: {
              ...addIng,
              recipe_id: selectedRecipe.id,
            },
          }),
        },
      );

      if (res.ok) {
        const updatedRecipe = await res.json();
        // Actualizamos el modal y la lista general para ver el nuevo costo
        setSelectedRecipe(updatedRecipe);
        setAddIng({ ingredient_id: "", quantity: "" }); // Limpiamos el form
        fetchData();
      }
    } catch (error) {
      console.error("Error al añadir insumo:", error);
    }
  };

  const handleDeleteRecipeIngredient = async (riId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/recipe_ingredients/${riId}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        // Refrescamos la receta actual para que desaparezca de la lista del modal
        const resRec = await fetch(
          `http://localhost:3000/api/v1/recipes/${selectedRecipe.id}`,
        );
        setSelectedRecipe(await resRec.json());
        fetchData(); // Refrescamos el "semáforo" de afuera
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-black text-gray-400 italic">
        Cocinando el menú...
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter">
            MENÚ
          </h2>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">
            Gestión de Rentabilidad · BIGA
          </p>
        </div>
        <button
          onClick={() => setIsRecipeModalOpen(true)}
          className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-red-700 transition-all flex items-center gap-2 uppercase text-sm"
        >
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      {/* GRID DE PRODUCTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(recipes) &&
          recipes.map((recipe) => {
            // 2. Usamos el status_health que viene del Serializer de Rails
            const isHealthy = recipe.status_health === "rentable";
            const cardColor = isHealthy
              ? "border-green-500 bg-green-50/20"
              : "border-amber-500 bg-amber-50/20";
            const textColor = isHealthy ? "text-green-600" : "text-amber-600";

            return (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className={`bg-white border-l-[12px] rounded-[2rem] p-8 cursor-pointer hover:shadow-2xl transition-all group relative shadow-sm ${cardColor}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-3 rounded-xl ${isHealthy ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}
                  >
                    {recipe.category === "pizza" ? (
                      <ChefHat size={24} />
                    ) : (
                      <Utensils size={24} />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      P. Venta
                    </p>
                    <p className="text-2xl font-black text-gray-900">
                      S/ {recipe.price}
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-gray-800 mb-1 uppercase tracking-tight leading-none">
                  {recipe.name}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                  {recipe.category?.replace("_", " ") || "Sin categoría"}
                </p>

                <div className="flex items-center gap-4 mb-8 bg-white/50 p-4 rounded-2xl">
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                      Costo Real
                    </p>
                    <p className="font-bold text-gray-700">
                      S/ {recipe.total_cost || "0.00"}
                    </p>
                  </div>
                  <div className="flex-1 border-l-2 border-gray-100 pl-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                      Margen
                    </p>
                    <div className="flex items-center gap-1">
                      <p className={`font-black text-xl ${textColor}`}>
                        {recipe.margin_percentage}%
                      </p>
                      {isHealthy ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        <AlertCircle size={16} className="text-amber-500" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-gray-400 group-hover:text-gray-900 transition-colors pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Ajustar Receta
                  </span>
                  <ChevronRight size={18} />
                </div>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecipeToEdit(recipe);
                      setIsEditMode(true);
                    }}
                    className="p-2 bg-white shadow-md rounded-full text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRecipe(recipe.id);
                    }}
                    className="p-2 bg-white shadow-md rounded-full text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* MODAL 1: CREAR PRODUCTO CON CATEGORÍA */}
      {isRecipeModalOpen && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl">
            <h3 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter">
              NUEVO PRODUCTO
            </h3>
            <form onSubmit={handleCreateRecipe} className="space-y-6">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase block mb-3 ml-2">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pizza Americana"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-red-500 font-bold"
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, name: e.target.value })
                  }
                />
              </div>

              {/* SELECT DE CATEGORÍA */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase block mb-3 ml-2">
                  Categoría (Margen Objetivo)
                </label>
                <select
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-red-500 font-bold"
                  value={newRecipe.category}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, category: e.target.value })
                  }
                >
                  <option value="pizza">Pizza (60% min)</option>
                  <option value="bebida_reventa">
                    Bebida Reventa (30% min)
                  </option>
                  <option value="bebida_casa">Bebida Casa (75% min)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase block mb-3 ml-2">
                  Precio de Venta
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-4 font-black text-gray-400">
                    S/
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-12 py-4 outline-none focus:border-red-500 font-bold"
                    onChange={(e) =>
                      setNewRecipe({ ...newRecipe, price: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsRecipeModalOpen(false)}
                  className="flex-1 py-4 font-black text-gray-400 uppercase text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black shadow-lg uppercase text-xs tracking-widest"
                >
                  Crear Plato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DETALLE DE RECETA E INGREDIENTES */}
      {selectedRecipe && !isEditMode && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            {/* Lado Izquierdo: Formulario para añadir */}
            <div className="p-10 md:w-1/2 border-r border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="mb-6 text-gray-400 hover:text-gray-900"
              >
                <X size={32} />
              </button>
              <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter uppercase">
                {selectedRecipe.name}
              </h3>
              <p className="text-blue-600 font-bold mb-10 tracking-widest uppercase text-xs">
                Configuración de Receta
              </p>

              <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 mb-8 shadow-sm">
                <p className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest text-center">
                  Añadir Insumo a la Mezcla
                </p>
                <form onSubmit={handleAddIngredient} className="space-y-4">
                  <select
                    className="w-full bg-gray-50 p-4 rounded-xl font-bold border-2 border-transparent focus:border-gray-900 outline-none"
                    onChange={(e) =>
                      setAddIng({ ...addIng, ingredient_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar Insumo...</option>
                    {ingredients.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} ({i.unit})
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.001"
                      placeholder="Cantidad (ej: 0.150)"
                      required
                      className="flex-1 bg-gray-50 p-4 rounded-xl font-bold border-2 border-transparent focus:border-gray-900 outline-none"
                      onChange={(e) =>
                        setAddIng({ ...addIng, quantity: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      className="bg-gray-900 text-white px-6 rounded-xl font-black italic hover:bg-red-600 transition-colors"
                    >
                      AÑADIR
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Lado Derecho: Lista de Insumos actuales */}
            <div className="p-10 md:w-1/2 overflow-y-auto bg-white">
              <h4 className="text-xs font-black text-gray-400 uppercase mb-6 tracking-widest">
                Insumos en esta receta
              </h4>
              <div className="space-y-4">
                {selectedRecipe.recipe_ingredients &&
                selectedRecipe.recipe_ingredients.length > 0 ? (
                  selectedRecipe.recipe_ingredients.map((ri) => (
                    <div
                      key={ri.id}
                      className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border-2 border-transparent hover:border-red-100 transition-all"
                    >
                      <div>
                        <p>{ri.ingredient_name}</p>
                        <p>
                          {ri.quantity} {ri.unit} — S/ {ri.subtotal}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteRecipeIngredient(ri.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <Utensils
                      size={48}
                      className="mx-auto text-gray-100 mb-4"
                    />
                    <p className="text-gray-300 italic font-medium">
                      Esta receta no tiene ingredientes aún.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDITAR PRODUCTO */}
      {isEditMode && recipeToEdit && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl">
            <h3 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter uppercase">
              EDITAR PLATO
            </h3>
            <form onSubmit={handleUpdateRecipe} className="space-y-6">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase block mb-3 ml-2">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold"
                  value={recipeToEdit.name}
                  onChange={(e) =>
                    setRecipeToEdit({ ...recipeToEdit, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase block mb-3 ml-2">
                  Categoría
                </label>
                <select
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold"
                  value={recipeToEdit.category}
                  onChange={(e) =>
                    setRecipeToEdit({
                      ...recipeToEdit,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="pizza">Pizza (60% min)</option>
                  <option value="bebida_reventa">
                    Bebida Reventa (30% min)
                  </option>
                  <option value="bebida_casa">Bebida Casa (75% min)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase block mb-3 ml-2">
                  Precio de Venta
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold"
                  value={recipeToEdit.price}
                  onChange={(e) =>
                    setRecipeToEdit({ ...recipeToEdit, price: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    setRecipeToEdit(null);
                  }}
                  className="flex-1 py-4 font-black text-gray-400 uppercase text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg uppercase text-xs tracking-widest"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
