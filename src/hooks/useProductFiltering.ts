import { useMemo } from 'react';
import type { Product } from '../types/product';

export function useProductFiltering(
  apiProducts: Product[],
  localProducts: Product[],
  searchQuery: string
) {
  return useMemo(() => {
    const filteredLocal = localProducts.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return [...filteredLocal, ...apiProducts];
  }, [localProducts, apiProducts, searchQuery]);
}
