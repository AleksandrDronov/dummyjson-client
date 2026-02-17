import { useCallback, useEffect, useState } from 'react';
import type { Product } from '../types/product';
import { fetchProducts } from '../api/products';
import { useDebouncedValue } from './useDebouncedValue';
import { useProductFiltering } from './useProductFiltering';

const PAGE_SIZE = 5;

interface UseProductsProps {
  searchQuery: string;
  page: number;
  localProducts: Product[];
}

export function useProducts({ searchQuery, page, localProducts }: UseProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [total, setTotal] = useState(0);
  const debouncedSearch = useDebouncedValue(searchQuery, 600);

  const fetchData = useCallback(
    async (controller?: AbortController) => {
      setIsLoading(true);
      setError(undefined);
      try {
        const response = await fetchProducts({
          searchQuery: debouncedSearch,
          skip: (page - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
        });
        if (!controller?.signal.aborted) {
          setProducts(response.products);
          setTotal(response.total);
        }
      } catch {
        if (!controller?.signal.aborted) {
          setError('Не удалось загрузить список товаров');
        }
      } finally {
        if (!controller?.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [debouncedSearch, page],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller);
    return () => controller.abort();
  }, [debouncedSearch, page, fetchData]);

  const allProducts = useProductFiltering(products, localProducts, debouncedSearch);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const refresh = useCallback(() => {
    const controller = new AbortController();
    fetchData(controller);
  }, [fetchData]);

  return {
    products: allProducts,
    isLoading,
    error,
    totalPages,
    total,
    refresh,
  };
}
