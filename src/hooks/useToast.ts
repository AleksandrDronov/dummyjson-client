import { useState, useCallback } from 'react';

export function useToast() {
  const [toastMessage, setToastMessage] = useState('');

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const handleToastClose = useCallback(() => {
    setToastMessage('');
  }, []);

  return {
    toastMessage,
    showToast,
    handleToastClose,
  };
}
