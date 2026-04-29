import React, { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import CategoryTabs from "./components/CategoryTabs";
import RecipeModal from "./components/RecipeModal";
import IngredientModal from "./components/IngredientModal";
import PromoModal from "./components/PromoModal";
import { Pizza, Star, Utensils, GlassWater, BottleWine, CakeSlice, Plus } from "lucide-react";
import api from "../../assets/services/api";

const Menu = ({ viewMode = "admin", onItemClick }) => {
  const [recipes, setRecipes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("pizza");

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

  useEffect(() => { 
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {      
      const [resRec, resIng, resProm] = await Promise.all([
        api("/recipes"),
        api("/ingredients"),
        api("/promotions")
      ]);

      if (resRec?.ok && resIng?.ok && resProm?.ok) {
        const [recipesData, ingredientsData, promotionsData] = await Promise.all([
          resRec.json(),
          resIng.json(),
          resProm.json()
        ]);

        setRecipes(recipesData);
        setIngredients(ingredientsData);
        setPromotions(promotionsData);
      }
    } catch (error) {
      console.error("Error cargando datos de BIGA:", error);
    } finally {
      setLoading(false);
    }
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

  const handleDelete = async (id, isPromo) => {
    const type = isPromo ? "promotions" : "recipes";
    const label = isPromo ? "esta Promoción" : "este Producto";

    if (window.confirm(`¿Seguro que quieres eliminar ${label} de BIGA?`)) {
      try {
        const res = await api(`/${type}/${id}`, {
          method: "DELETE"
        });

        if (res && res.ok) {
          await fetchData();
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
          <h2 className="text-5xl font-black tracking-tighter italic uppercase">MENÚ<span className="text-biga-orange">.</span></h2>
          <p className="text-slate-600 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">BIGA PIZZA POS</p>
        </div>
        {viewMode === "admin" && (
          <button
            onClick={() => activeCategory === "promotion" ? setIsPromoModalOpen(true) : setIsRecipeModalOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-orange-200 hover:scale-105 transition-all flex items-center gap-3 uppercase text-xs active:scale-95"
          >
            <Plus size={20} /> {activeCategory === "promotion" ? "Nueva Promo" : "Nuevo Producto"}
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