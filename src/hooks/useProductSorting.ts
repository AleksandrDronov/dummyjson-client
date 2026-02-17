import { useMemo } from 'react';
import type { Product } from '../types/product';
import { compareValues } from '../utils/sortUtils';
import type { SortState } from '../utils/sortUtils';

export function useProductSorting(products: Product[], sort: SortState) {
  return useMemo(() => {
    const copy = [...products];
    copy.sort((a, b) => {
      switch (sort.key) {
        case 'title':
          return compareValues(a.title, b.title, sort.direction);
        case 'price':
          return compareValues(a.price, b.price, sort.direction);
        case 'brand':
          return compareValues(a.brand, b.brand, sort.direction);
        case 'sku':
          return compareValues(a.sku, b.sku, sort.direction);
        case 'rating':
          return compareValues(a.rating, b.rating, sort.direction);
        default:
          return 0;
      }
    });
    return copy;
  }, [products, sort]);
}
