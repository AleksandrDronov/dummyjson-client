import { useState } from 'react';
import type { Product } from '../types/product';
import { loadInitialSort, type SortState } from '../utils/sortUtils';

export function useProductsPageState() {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<SortState>(() => loadInitialSort());
  const [page, setPage] = useState(1);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleProductAdded = (product: Product) => {
    setLocalProducts((prev) => [product, ...prev]);
  };

  return {
    localProducts,
    searchQuery,
    sort,
    page,
    setSearchQuery,
    setSort,
    setPage,
    handleSearchChange,
    handleProductAdded,
  };
}
