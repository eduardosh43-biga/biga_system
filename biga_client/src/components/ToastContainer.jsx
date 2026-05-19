import React from "react";
import { useToasts } from "../assets/services/notifications";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContainer = () => {
  const toasts = useToasts();

  const icons = {
    success: <CheckCircle size={18} className="text-emerald-500" />,
    error: <AlertCircle size={18} className="text-red-500" />,
    info: <Info size={18} className="text-blue-500" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-slate-100 animate-in slide-in-from-right-full duration-300"
        >
          {icons[t.type] || icons.info}
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
            {t.message}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
