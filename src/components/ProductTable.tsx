import { useMemo, useState } from 'react';
import type { Product } from '../types/product';
import { ProgressBar } from './ProgressBar';
import { compareValues, persistSortState } from '../utils/sortUtils';
import type { SortState, SortDirection, SortKey } from '../utils/sortUtils';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  error?: string;
  sort: SortState;
  onSortChange: (next: SortState) => void;
}

export function ProductTable({
  products,
  isLoading,
  error,
  sort,
  onSortChange,
}: ProductTableProps) {
  const [internalSort] = useState<SortState>(sort);

  const sortedProducts = useMemo(() => {
    const currentSort = sort ?? internalSort;
    const copy = [...products];
    copy.sort((a, b) => {
      switch (currentSort.key) {
        case 'title':
          return compareValues(a.title, b.title, currentSort.direction);
        case 'price':
          return compareValues(a.price, b.price, currentSort.direction);
        case 'brand':
          return compareValues(a.brand, b.brand, currentSort.direction);
        case 'sku':
          return compareValues(a.sku, b.sku, currentSort.direction);
        case 'rating':
          return compareValues(a.rating, b.rating, currentSort.direction);
        default:
          return 0;
      }
    });
    return copy;
  }, [products, sort, internalSort]);

  const handleSortClick = (key: SortKey) => {
    const next: SortState =
      sort.key === key
        ? { key, direction: sort.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' };

    persistSortState(next);
    onSortChange(next);
  };

  return (
    <div className="card table-card">
      {isLoading && <ProgressBar />}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSortClick('title')}>
                Наименование
                {sort.key === 'title' && <SortIndicator direction={sort.direction} />}
              </th>
              <th onClick={() => handleSortClick('price')}>
                Цена
                {sort.key === 'price' && <SortIndicator direction={sort.direction} />}
              </th>
              <th onClick={() => handleSortClick('brand')}>
                Вендор
                {sort.key === 'brand' && <SortIndicator direction={sort.direction} />}
              </th>
              <th onClick={() => handleSortClick('sku')}>
                Артикул
                {sort.key === 'sku' && <SortIndicator direction={sort.direction} />}
              </th>
              <th onClick={() => handleSortClick('rating')}>
                Рейтинг
                {sort.key === 'rating' && <SortIndicator direction={sort.direction} />}
              </th>
              <th>Остаток</th>
              <th>Категория</th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr>
                <td colSpan={7} className="table-error">
                  {error}
                </td>
              </tr>
            )}
            {!error && sortedProducts.length === 0 && !isLoading && (
              <tr>
                <td colSpan={7} className="table-empty">
                  Товары не найдены
                </td>
              </tr>
            )}
            {!error &&
              sortedProducts.map((product) => (
                <tr key={product.id}>
                  <td className="product-title">
                    <div className="product-title-main">{product.title}</div>
                    <div className="product-sub">
                      <span>{product.brand}</span>
                      {product.thumbnail && (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="product-thumbnail"
                        />
                      )}
                    </div>
                  </td>
                  <td>
                    {product.price.toLocaleString('ru-RU', { style: 'currency', currency: 'USD' })}
                  </td>
                  <td>{product.brand}</td>
                  <td>{product.sku}</td>
                  <td className={product.rating < 3 ? 'rating rating-low' : 'rating'}>
                    {product.rating.toFixed(1)}
                  </td>
                  <td>{product.stock}</td>
                  <td>{product.category}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface SortIndicatorProps {
  direction: SortDirection;
}

function SortIndicator({ direction }: SortIndicatorProps) {
  return <span className="sort-indicator">{direction === 'asc' ? '▲' : '▼'}</span>;
}
