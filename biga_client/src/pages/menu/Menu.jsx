import React, { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import CategoryTabs from "./components/CategoryTabs";
import RecipeModal from "./components/RecipeModal";
import IngredientModal from "./components/IngredientModal";
import PromoModal from "./components/PromoModal";
import { Pizza, Star, Utensils, GlassWater, BottleWine, CakeSlice, Plus } from "lucide-react";

const Menu = ({ viewMode = "admin", onItemClick }) => {
  const [recipes, setRecipes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("pizza");
  const [selectedPromo, setSelectedPromo] = useState(null);

  // Estados de control para Modales
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoToEdit, setPromoToEdit] = useState(null);

  const categoryTabs = [
    { id: "pizza", label: "Pizzas", icon: <Pizza size={16} /> },
    { id: "promotion", label: "Promos", icon: <Star size={16} /> },
    { id: "entrada", label: "Entradas", icon: <Utensils size={16} /> },
    { id: "bebida_casa", label: "Bebidas Casa", icon: <GlassWater size={16} /> },
    { id: "bebida_reventa", label: "Gaseosas", icon: <BottleWine size={16} /> },
    { id: "postre", label: "Postres", icon: <CakeSlice size={16} /> },
  ];

  useEffect(() => { fetchData(); }, []);

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
    } catch (error) { console.error(error); }
  };

  const handleCardClick = (item) => {
    if (viewMode === "pos") {
      onItemClick(item);
    } else {
      if (item.isPromo) {
        setPromoToEdit(item);        
        setIsPromoModalOpen(true);   
      } else {
        setSelectedRecipe(item);
      }
    }
  };

  const handleDelete = async (id, isPromo) => { // <--- Agregamos isPromo
    const type = isPromo ? "promotions" : "recipes"; // Define la ruta correcta
    const label = isPromo ? "esta Promoción" : "este Producto";

    if (window.confirm(`¿Seguro que quieres eliminar ${label} de BIGA?`)) {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/${type}/${id}`, {
          method: "DELETE"
        });

        if (res.ok) {
          fetchData(); // Refresca la lista
        } else {
          alert("Error al eliminar");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    }
  };

  const allItems = [
    ...recipes.map(r => ({ ...r, isPromo: false })),
    ...promotions.map(p => ({ ...p, isPromo: true, category: "promotion" }))
  ];
  const itemsToShow = allItems.filter(i => i.category === activeCategory);

  if (loading) return <div className="p-20 text-center font-black text-slate-400 italic">Cocinando...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-900">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl font-black tracking-tighter">MENÚ</h2>
          <p className="text-slate-400 font-bold uppercase text-xs">BIGA PIZZA POS</p>
        </div>
        {viewMode === "admin" && (
          <button
            onClick={() => activeCategory === "promotion" ? setIsPromoModalOpen(true) : setIsRecipeModalOpen(true)}
            className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl uppercase text-sm flex items-center gap-2"
          >
            <Plus size={20} /> Nuevo {activeCategory === "promotion" ? "Combo" : "Producto"}
          </button>
        )}
      </div>

      <CategoryTabs tabs={categoryTabs} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {itemsToShow.map(item => (
          <ProductCard
            key={item.isPromo ? `p-${item.id}` : `r-${item.id}`}
            item={item} viewMode={viewMode} onClick={handleCardClick}            
            onDelete={handleDelete}
            onEdit={(i) => {
              if (i.isPromo) {
                setPromoToEdit(i);
                setIsPromoModalOpen(true);
              } else {
                setRecipeToEdit(i);
                setIsRecipeModalOpen(true);
              }
            }}
          />
        ))}
      </div>

      <RecipeModal
        isOpen={isRecipeModalOpen} fetchData={fetchData} recipeToEdit={recipeToEdit}
        onClose={() => { setIsRecipeModalOpen(false); setRecipeToEdit(null); }}
      />
      <IngredientModal
        selectedRecipe={selectedRecipe} setSelectedRecipe={setSelectedRecipe}
        ingredients={ingredients} fetchData={fetchData}
      />
      <PromoModal
        isOpen={isPromoModalOpen} fetchData={fetchData} recipes={recipes} promoToEdit={promoToEdit}
        onClose={() => { setIsPromoModalOpen(false); setPromoToEdit(null); }}
      />
    </div>
  );
};

export default Menu;