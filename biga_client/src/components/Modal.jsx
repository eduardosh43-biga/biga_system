import React from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, type = 'info', confirmText = 'Aceptar', onConfirm }) => {
  if (!isOpen) return null;

  const icons = {
    info: <Info className="text-blue-500" size={24} />,
    success: <CheckCircle className="text-emerald-500" size={24} />,
    warning: <AlertCircle className="text-amber-500" size={24} />,
    danger: <AlertCircle className="text-red-500" size={24} />,
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              {icons[type]}
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">{title}</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>
          
          <div className="text-slate-600 font-medium mb-8">
            {children}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 border-2 border-slate-100 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={() => { onConfirm?.(); onClose(); }}
              className={`flex-1 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white shadow-lg transition-all active:scale-95 ${
                type === 'danger' ? 'bg-red-500 shadow-red-500/20' : 'bg-biga-orange shadow-orange-500/20'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
