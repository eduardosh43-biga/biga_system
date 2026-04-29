import React from 'react';
import { ChefHat, Star, CheckCircle2, AlertCircle, ChevronRight, Pencil, Trash2 } from "lucide-react";

const ProductCard = ({ item, viewMode, onClick, onEdit, onDelete }) => {
    const isPromo = item.isPromo;
    const isHealthy = item.status_health === "rentable";
    const priceToShow = isPromo ? item.sale_price : item.price;

    const cardBorder = isHealthy ? "border-emerald-500" : "border-amber-500";
    const marginBg = isHealthy ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";

    return (
        <div
            onClick={() => onClick(item)}
            className={`bg-white border-l-[6px] rounded-[2rem] cursor-pointer hover:shadow-2xl transition-all group relative shadow-lg overflow-hidden flex flex-col ${cardBorder}`}
        >
            <div className="p-8 pb-4 flex-1">
                <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${isHealthy ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                        {isPromo ? <Star size={24} className="text-biga-orange" /> : <ChefHat size={24} />}
                    </div>
                    <div className="bg-biga-orange text-white px-4 py-2 rounded-xl shadow-lg shadow-orange-500/20 transform rotate-2 group-hover:rotate-0 transition-transform">
                        <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1 opacity-80">Precio Venta</p>
                        <p className="text-xl font-bold font-mono leading-none">S/ {priceToShow}</p>
                    </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tighter leading-none italic">
                    {item.name}
                </h3>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                    {isPromo ? "COMBOS BIGA" : item.category?.replace("_", " ")}
                </p>

                {/* SOLO ADMIN: Costos y Márgenes */}
                {viewMode === "admin" && (
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Costo Prod.</p>
                            <p className="font-mono font-bold text-slate-700">S/ {item.total_cost || "0.00"}</p>
                        </div>
                        <div className="flex-1 flex flex-col items-end">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Margen</p>
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-sm ${marginBg}`}>
                                {item.margin_percentage}%
                                {isHealthy ? <CheckCircle2 size={12} strokeWidth={3} /> : <AlertCircle size={12} strokeWidth={3} />}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer optimizado para acción */}
            <div className="bg-slate-50 p-5 flex justify-between items-center border-t border-slate-100 group-hover:bg-slate-100 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-biga-dark transition-colors">
                    {viewMode === "pos" ? "Añadir al pedido" : (isPromo ? "Ver detalle combo" : "Ajustar Receta")}
                </span>
                <div className="bg-white p-2 rounded-full shadow-sm group-hover:translate-x-1 transition-transform">
                    <ChevronRight size={16} className="text-biga-orange" />
                </div>
            </div>

            {/* Botones de edición flotantes */}
            {viewMode === "admin" && (
                <div className="absolute top-24 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                        className="p-3 bg-white shadow-xl rounded-2xl text-blue-600 hover:scale-110 transition-transform"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id, isPromo); }}
                        className="p-3 bg-white shadow-xl rounded-2xl text-red-600 hover:scale-110 transition-transform"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;