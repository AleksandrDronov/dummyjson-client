import { useState, useCallback } from 'react';
import type { Product } from '../types/product';
import { loadInitialSort, type SortState } from '../utils/sortUtils';

export function useProductsPageState() {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<SortState>(() => loadInitialSort());
  const [page, setPage] = useState(1);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  }, []);

  const handleProductAdded = useCallback((product: Product) => {
    setLocalProducts((prev) => [product, ...prev]);
  }, []);

  return {
    localProducts,
    searchQuery,
    sort,
    page,
    setSort,
    setPage,
    handleSearchChange,
    handleProductAdded,
  };
}
