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
  Star,
} from "lucide-react";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isPromoEditMode, setIsPromoEditMode] = useState(false);
  const [promoToEdit, setPromoToEdit] = useState(null);

  // Estado para la categoría activa en la vista (Filtro)
  const [activeCategory, setActiveCategory] = useState("pizza");

  const [newRecipe, setNewRecipe] = useState({
    name: "",
    price: "",
    category: "pizza",
  });
  const [addIng, setAddIng] = useState({ ingredient_id: "", quantity: "" });

  const [newPromo, setNewPromo] = useState({
    name: "",
    sale_price: "",
    description: "",
    promotion_items_attributes: [], // Aquí guardaremos las recetas del combo
  });

  const categoryTabs = [
    { id: "pizza", label: "Pizzas", icon: <ChefHat size={18} /> },
    { id: "promotion", label: "Promos", icon: <Star size={18} /> },
    { id: "entrada", label: "Entradas", icon: <Utensils size={18} /> },
    { id: "bebida_casa", label: "Bebidas Casa", icon: <Utensils size={18} /> },
    { id: "bebida_reventa", label: "Gaseosas", icon: <Utensils size={18} /> },
    { id: "cremolada", label: "Cremoladas", icon: <Utensils size={18} /> },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resRec, resIng, resProm] = await Promise.all([
        fetch("http://localhost:3000/api/v1/recipes"),
        fetch("http://localhost:3000/api/v1/ingredients"),
        fetch("http://localhost:3000/api/v1/promotions"),
      ]);
      setRecipes(await resRec.json());
      setIngredients(await resIng.json());
      setPromotions(await resProm.json());
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
        fetchData();
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
        setSelectedRecipe(updatedRecipe);
        setAddIng({ ingredient_id: "", quantity: "" });
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
        { method: "DELETE" },
      );
      if (res.ok) {
        const resRec = await fetch(
          `http://localhost:3000/api/v1/recipes/${selectedRecipe.id}`,
        );
        setSelectedRecipe(await resRec.json());
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // CREAR PROMO
  const handleCreatePromo = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/v1/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promotion: newPromo }),
      });
      if (res.ok) {
        setIsPromoModalOpen(false);
        setNewPromo({
          name: "",
          sale_price: "",
          description: "",
          promotion_items_attributes: [],
        });
        fetchData(); // Recarga todo
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ACTUALIZAR PROMO
  const handleUpdatePromo = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/promotions/${promoToEdit.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promotion: promoToEdit }),
        },
      );
      if (res.ok) {
        setIsPromoEditMode(false);
        setPromoToEdit(null);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ELIMINAR PROMO
  const handleDeletePromo = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este combo de BIGA?")) {
      try {
        const res = await fetch(
          `http://localhost:3000/api/v1/promotions/${id}`,
          {
            method: "DELETE",
          },
        );
        if (res.ok) fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const allMenuItems = [
    ...(Array.isArray(recipes)
      ? recipes.map((r) => ({ ...r, isPromo: false }))
      : []),
    ...(Array.isArray(promotions)
      ? promotions.map((p) => ({ ...p, isPromo: true, category: "promotion" }))
      : []),
  ];

  const itemsToShow = allMenuItems.filter(
    (item) => item.category === activeCategory,
  );

  const openEditPromo = (promo) => {
    setPromoToEdit({
      ...promo,
      // Preparamos los items para que Rails los entienda al editar
      promotion_items_attributes: promo.promotion_items.map((pi) => ({
        id: pi.id,
        recipe_id: pi.recipe_id,
        quantity: pi.quantity,
      })),
    });
    setIsPromoEditMode(true);
  };

  if (loading)
    return (
      <div className="p-10 text-center font-black text-gray-400 italic">
        Cocinando el menú...
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter">
            MENÚ
          </h2>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">
            Gestión de Rentabilidad · BIGA
          </p>
        </div>

        <div className="flex gap-4">
          {/* Botón condicional o ambos botones */}
          {activeCategory === "promotion" ? (
            <button
              onClick={() => setIsPromoModalOpen(true)}
              className="bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-yellow-600 transition-all flex items-center gap-2 uppercase text-sm"
            >
              <Star size={20} /> Nueva Promo
            </button>
          ) : (
            <button
              onClick={() => setIsRecipeModalOpen(true)}
              className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-red-700 transition-all flex items-center gap-2 uppercase text-sm"
            >
              <Plus size={20} /> Nuevo Producto
            </button>
          )}
        </div>
      </div>
      {/* TABS DE CATEGORÍAS */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-4">
        {categoryTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap
              ${
                activeCategory === tab.id
                  ? "bg-gray-900 text-white shadow-lg scale-105"
                  : "bg-white text-gray-400 hover:bg-gray-50 border-2 border-transparent"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* GRID DE PRODUCTOS UNIFICADO (RECETAS + PROMOS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {itemsToShow.map((item) => {
          // 1. Normalización de variables: Aquí está el truco
          const isPromo = item.isPromo; // La etiqueta que pusimos en el "embudo"
          const isHealthy = item.status_health === "rentable";

          // Si es promo usa 'sale_price', si es receta usa 'price'
          const priceToShow = isPromo ? item.sale_price : item.price;

          // Colores basados en rentabilidad
          const cardColor = isHealthy
            ? "border-green-500 bg-green-50/20"
            : "border-amber-500 bg-amber-50/20";
          const textColor = isHealthy ? "text-green-600" : "text-amber-600";

          // Generar una Key única para React (evita errores de consola)
          const itemKey = isPromo ? `promo-${item.id}` : `recipe-${item.id}`;

          return (
            <div
              key={itemKey}
              onClick={() =>
                isPromo ? setSelectedPromo(item) : setSelectedRecipe(item)
              }
              className={`bg-white border-l-[12px] rounded-[2rem] p-8 cursor-pointer hover:shadow-2xl transition-all group relative shadow-sm ${cardColor}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`p-3 rounded-xl ${isHealthy ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}
                >
                  {/* Icono dinámico según categoría o tipo */}
                  {isPromo ? (
                    <Star size={24} className="text-yellow-500" />
                  ) : item.category === "pizza" ? (
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
                    S/ {priceToShow}
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-800 mb-1 uppercase tracking-tight leading-none">
                {item.name}
              </h3>

              {/* Etiqueta de categoría */}
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                {isPromo
                  ? "COMBOS BIGA"
                  : item.category?.replace("_", " ") || "Sin categoría"}
              </p>

              {/* Sección de Costos y Margen */}
              <div className="flex items-center gap-4 mb-8 bg-white/50 p-4 rounded-2xl">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                    Costo Real
                  </p>
                  <p className="font-bold text-gray-700">
                    S/ {item.total_cost || "0.00"}
                  </p>
                </div>
                <div className="flex-1 border-l-2 border-gray-100 pl-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                    Margen
                  </p>
                  <div className="flex items-center gap-1">
                    <p className={`font-black text-xl ${textColor}`}>
                      {item.margin_percentage}%
                    </p>
                    {isHealthy ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : (
                      <AlertCircle size={16} className="text-amber-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Pie de la tarjeta */}
              <div className="flex justify-between items-center text-gray-400 group-hover:text-gray-900 transition-colors pt-2 border-t border-gray-100">
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isPromo ? "Ver detalle combo" : "Ajustar Receta"}
                </span>
                <ChevronRight size={18} />
              </div>

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.isPromo) {
                      openEditPromo(item);
                    } else {
                      setRecipeToEdit(item);
                      setIsEditMode(true);
                    }
                  }}
                  className="p-2 bg-white shadow-md rounded-full text-blue-600 hover:bg-blue-50"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.isPromo) {
                      handleDeletePromo(item.id);
                    } else {
                      handleDeleteRecipe(item.id);
                    }
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

      {/* MODAL 1: CREAR PRODUCTO */}
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
              <div>
                <label className="text-xs font-black text-gray-400 uppercase block mb-3 ml-2">
                  Categoría
                </label>
                <select
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-red-500 font-bold"
                  value={newRecipe.category}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, category: e.target.value })
                  }
                >
                  <option value="pizza">Pizza (65% min)</option>
                  <option value="bebida_reventa">
                    Bebida Reventa (30% min)
                  </option>
                  <option value="bebida_casa">Bebida Casa (75% min)</option>
                  <option value="entrada">Entrada (60% min)</option>
                  <option value="cremolada">Cremolada (70% min)</option>
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

      {/* MODAL 2: DETALLE E INGREDIENTES */}
      {selectedRecipe && !isEditMode && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
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
                    placeholder="Cantidad"
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
            <div className="p-10 md:w-1/2 overflow-y-auto bg-white">
              <h4 className="text-xs font-black text-gray-400 uppercase mb-6 tracking-widest">
                Insumos actuales
              </h4>
              <div className="space-y-4">
                {selectedRecipe.recipe_ingredients?.map((ri) => (
                  <div
                    key={ri.id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border-2 border-transparent hover:border-red-100 transition-all"
                  >
                    <div>
                      <p className="font-bold">{ri.ingredient_name}</p>
                      <p className="text-sm text-gray-500">
                        {ri.quantity} {ri.unit} — S/ {ri.subtotal}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteRecipeIngredient(ri.id)}
                      className="text-gray-300 hover:text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDITAR */}
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
                  <option value="pizza">Pizza (65% min)</option>
                  <option value="bebida_reventa">
                    Bebida Reventa (30% min)
                  </option>
                  <option value="bebida_casa">Bebida Casa (75% min)</option>
                  <option value="entrada">Entrada (60% min)</option>
                  <option value="cremolada">Cremolada (70% min)</option>
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

      {isPromoModalOpen && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
                Nuevo Combo BIGA
              </h3>
              <button onClick={() => setIsPromoModalOpen(false)}>
                <X size={32} />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase block mb-2">
                    Nombre del Combo
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold"
                    onChange={(e) =>
                      setNewPromo({ ...newPromo, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase block mb-2">
                    Precio de Venta
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold"
                    onChange={(e) =>
                      setNewPromo({ ...newPromo, sale_price: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* BUSCADOR/SELECTOR DE RECETAS PARA EL COMBO */}
              <div className="bg-blue-50 p-6 rounded-[2rem] border-2 border-blue-100">
                <h4 className="text-xs font-black text-blue-600 uppercase mb-4 tracking-widest">
                  Añadir Recetas al Combo
                </h4>
                <select
                  className="w-full p-4 rounded-xl font-bold mb-4"
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const recipeId = parseInt(e.target.value);

                    // Solo guardamos recipe_id y quantity
                    setNewPromo({
                      ...newPromo,
                      promotion_items_attributes: [
                        ...newPromo.promotion_items_attributes,
                        { recipe_id: recipeId, quantity: 1 },
                      ],
                    });
                  }}
                >
                  <option value="">Selecciona una Pizza o Bebida...</option>
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Costo: S/ {r.total_cost})
                    </option>
                  ))}
                </select>
                {/* LISTA DE ITEMS SELECCIONADOS */}
                <div className="space-y-2">
                  {newPromo.promotion_items_attributes.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm"
                    >
                      <span className="font-bold text-sm">
                        {recipes.find((r) => r.id === item.recipe_id)?.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          className="w-16 p-1 border rounded text-center font-bold"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            const updated = [
                              ...newPromo.promotion_items_attributes,
                            ];
                            updated[index] = {
                              ...updated[index],
                              quantity: val,
                            };
                            setNewPromo({
                              ...newPromo,
                              promotion_items_attributes: updated,
                            });
                          }}
                        />
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => {
                            const updated =
                              newPromo.promotion_items_attributes.filter(
                                (_, i) => i !== index,
                              );
                            setNewPromo({
                              ...newPromo,
                              promotion_items_attributes: updated,
                            });
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all"
              >
                Guardar Promoción
              </button>
            </form>
          </div>
        </div>
      )}
      {/* MODAL 5: DETALLE DE PROMO (Vista Rápida) */}
      {selectedPromo && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
                {selectedPromo.name}
              </h3>
              <button onClick={() => setSelectedPromo(null)}>
                <X size={32} />
              </button>
            </div>
            <div className="space-y-4 mb-8">
              {selectedPromo.promotion_items?.map((pi) => (
                <div
                  key={pi.id}
                  className="flex justify-between bg-gray-50 p-4 rounded-2xl font-bold border-2 border-gray-100"
                >
                  <span>{pi.recipe_name}</span>
                  <span className="text-red-600">x{pi.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-6 border-t">
              <span className="text-xl font-black">TOTAL COMBO</span>
              <span className="text-3xl font-black text-red-600">
                S/ {selectedPromo.sale_price}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: EDITAR PROMO */}
      {isPromoEditMode && promoToEdit && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-2xl shadow-2xl">
            <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter">
              Editar Combo
            </h3>
            <form onSubmit={handleUpdatePromo} className="space-y-6">
              <input
                className="w-full bg-gray-50 border-2 p-4 rounded-2xl font-bold"
                value={promoToEdit.name}
                onChange={(e) =>
                  setPromoToEdit({ ...promoToEdit, name: e.target.value })
                }
              />
              <input
                type="number"
                className="w-full bg-gray-50 border-2 p-4 rounded-2xl font-bold"
                value={promoToEdit.sale_price}
                onChange={(e) =>
                  setPromoToEdit({ ...promoToEdit, sale_price: e.target.value })
                }
              />
              {/* Aquí podrías listar los items y permitir borrarlos con _destroy */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsPromoEditMode(false)}
                  className="flex-1 font-black text-gray-400"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black"
                >
                  GUARDAR CAMBIOS
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
