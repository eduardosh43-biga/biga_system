import { useState, useEffect } from 'react';

let listeners = [];
let toastQueue = [];

export const toast = (message, type = 'info') => {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast = { id, message, type };
  toastQueue = [...toastQueue, newToast];
  listeners.forEach(l => l(toastQueue));
  
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== id);
    listeners.forEach(l => l(toastQueue));
  }, 4000);
};

export const useToasts = () => {
  const [toasts, setToasts] = useState(toastQueue);
  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter(l => l !== setToasts);
    };
  }, []);
  return toasts;
};
