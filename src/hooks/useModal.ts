import { useState, useEffect, useCallback } from 'react';

interface UseModalProps {
  onClose: () => void;
  closeDelay?: number;
  openDelay?: number;
}

export function useModal({ onClose, closeDelay = 300, openDelay = 10 }: UseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, closeDelay);
  }, [onClose, closeDelay]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, openDelay);
    return () => clearTimeout(timer);
  }, [openDelay]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  return {
    isOpen,
    isClosing,
    handleClose,
    handleBackdropClick,
  };
}
