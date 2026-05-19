import React from 'react';

const ProductTable = ({ products }) => (
  <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-xl border border-slate-300/50">
    <div className="flex items-center gap-4 mb-6">
      <div className="bg-orange-100 p-2 rounded-full">
        <span className="text-xl">🏆</span>
      </div>
      <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Productos Estrella</h3>
    </div>
    
    <div className="overflow-hidden rounded-xl border border-slate-100">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr className="text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-slate-100">
            <th className="text-left p-4">Rnk</th>
            <th className="text-left p-4">Producto</th>
            <th className="text-right p-4">Ventas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((p, i) => (
            <tr key={i} className="group hover:bg-slate-50 transition-colors">
              <td className="p-4">
                <span className="font-mono font-black text-slate-400 group-hover:text-biga-orange">#{i+1}</span>
              </td>
              <td className="p-4">
                <p className="font-bold uppercase text-slate-800 tracking-tight text-sm">{p.name}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase">{p.type === 'Recipe' ? 'Pizza' : 'Promo'}</p>
              </td>
              <td className="p-4 text-right">
                <span className="font-mono text-lg font-black text-slate-900">{p.quantity}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ProductTable;
