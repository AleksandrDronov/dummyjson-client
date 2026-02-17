import { useState, useCallback } from 'react';
import type { Product } from '../types/product';

interface UseProductModalProps {
  onProductAdded: (product: Product) => void;
}

export function useProductModal({ onProductAdded }: UseProductModalProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleProductAdded = useCallback((product: Product) => {
    onProductAdded(product);
  }, [onProductAdded]);

  return {
    isAddModalOpen,
    handleOpenAddModal,
    handleCloseAddModal,
    handleProductAdded,
  };
}
