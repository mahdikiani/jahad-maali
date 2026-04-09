import { useState, useCallback } from 'react';
import type { ToastType } from '../components/shared/Toast';

let _id = 0;

export function useToast() {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([]);

  const show = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++_id;
    setToasts(t => [...t, { id, message, type }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  return { toasts, show, remove };
}
