import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  durationMs?: number;
}

export function Toast({ message, onClose, durationMs = 3000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;

    const id = setTimeout(onClose, durationMs);
    return () => clearTimeout(id);
  }, [message, onClose, durationMs]);

  if (!message) {
    return null;
  }

  return (
    <div className="toast">
      <span>{message}</span>
    </div>
  );
}
