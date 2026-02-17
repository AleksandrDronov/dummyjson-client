import { useState } from 'react';
import type { Product } from '../types/product';
import { ProgressBar } from './ui/ProgressBar';
import { SortIndicator } from './ui/SortIndicator';
import { persistSortState } from '../utils/sortUtils';
import type { SortState, SortKey } from '../utils/sortUtils';
import { useProductSorting } from '../hooks/useProductSorting';

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

  const sortedProducts = useProductSorting(products, sort ?? internalSort);

  const handleSortClick = (key: SortKey) => {
    const next: SortState =
      sort.key === key
        ? { key, direction: sort.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' };

    persistSortState(next);
    onSortChange(next);
  };

  return (
    <div className="table-card">
      {isLoading && <ProgressBar />}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSortClick('title')}>
                Наименование
                {sort.key === 'title' && <SortIndicator direction={sort.direction} />}
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
                Оценка
                {sort.key === 'rating' && <SortIndicator direction={sort.direction} />}
              </th>
              <th onClick={() => handleSortClick('price')}>
                Цена
                {sort.key === 'price' && <SortIndicator direction={sort.direction} />}
              </th>
              <th>Остаток</th>
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
                    {product.thumbnail && (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="product-thumbnail"
                      />
                    )}
                    <div>
                      <p className="product-title-main">{product.title}</p>
                      <p className="product-sub">
                        <span>{product.category}</span>
                      </p>
                    </div>
                  </td>
                  <td className='product-brand'>{product.brand}</td>
                  <td>{product.sku}</td>
                  <td className={product.rating < 3 ? 'rating rating-low' : 'rating'}>
                    {product.rating.toFixed(1)}
                  </td>
                  <td>
                    {product.price.toLocaleString('ru-RU', { style: 'currency', currency: 'USD' })}
                  </td>
                  <td>{product.stock}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

