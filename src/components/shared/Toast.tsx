import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-bold max-w-sm
        ${type === 'success'
          ? 'bg-stone-900 border-[#8B7355]/40 text-white'
          : 'bg-red-950 border-red-700/40 text-red-200'}`}
    >
      {type === 'success'
        ? <CheckCircle2 className="w-5 h-5 text-[#D2B48C] shrink-0" />
        : <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// Global toast container — mount once in App
interface ToastItem { id: number; message: string; type: ToastType; }

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: number) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-3 items-center">
      <AnimatePresence>
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => onRemove(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}
