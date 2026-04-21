import React from 'react';
import { ChefHat, Star, CheckCircle2, AlertCircle, ChevronRight, Pencil, Trash2 } from "lucide-react";

const ProductCard = ({ item, viewMode, onClick, onEdit, onDelete }) => {
    const isPromo = item.isPromo;
    const isHealthy = item.status_health === "rentable";
    const priceToShow = isPromo ? item.sale_price : item.price;

    const cardColor = isHealthy ? "border-green-500 bg-green-50/20" : "border-amber-500 bg-amber-50/20";
    const textColor = isHealthy ? "text-green-600" : "text-amber-600";
    const itemKey = isPromo ? `promo-${item.id}` : `recipe-${item.id}`;

    return (
        <div
            onClick={() => onClick(item)}
            className={`bg-white border-l-[12px] rounded-[2rem] p-8 cursor-pointer hover:shadow-2xl transition-all group relative shadow-sm ${cardColor}`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${isHealthy ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
                    {isPromo ? <Star size={24} className="text-yellow-500" /> : <ChefHat size={24} />}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">P. Venta</p>
                    <p className="text-2xl font-black text-gray-900">S/ {priceToShow}</p>
                </div>
            </div>

            <h3 className="text-2xl font-black text-gray-800 mb-1 uppercase tracking-tight leading-none">
                {item.name}
            </h3>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                {isPromo ? "COMBOS BIGA" : item.category?.replace("_", " ")}
            </p>

            {/* SOLO ADMIN: Costos y Márgenes */}
            {viewMode === "admin" && (
                <div className="flex items-center gap-4 mb-8 bg-white/50 p-4 rounded-2xl">
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Costo Real</p>
                        <p className="font-bold text-gray-700">S/ {item.total_cost || "0.00"}</p>
                    </div>
                    <div className="flex-1 border-l-2 border-gray-100 pl-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Margen</p>
                        <div className="flex items-center gap-1">
                            <p className={`font-black text-xl ${textColor}`}>{item.margin_percentage}%</p>
                            {isHealthy ? <CheckCircle2 size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-amber-500" />}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center text-gray-400 group-hover:text-gray-900 transition-colors pt-2 border-t border-gray-100">
                <span className="text-[10px] font-black uppercase tracking-widest">
                    {viewMode === "pos" ? "Añadir al pedido" : (isPromo ? "Ver detalle combo" : "Ajustar Receta")}
                </span>
                <ChevronRight size={18} />
            </div>

            {/* SOLO ADMIN: Botones de edición flotantes */}
            {viewMode === "admin" && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                        className="p-2 bg-white shadow-md rounded-full text-blue-600 hover:bg-blue-50"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id, isPromo); }}
                        className="p-2 bg-white shadow-md rounded-full text-red-600 hover:bg-red-50"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;