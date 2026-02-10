import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Product } from '../types/product';
import { fetchProducts } from '../api/products';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { ProductTable } from '../components/ProductTable';
import { AddProductForm } from '../components/AddProductForm';
import { Toast } from '../components/Toast';
import { loadInitialSort, type SortState } from '../utils/sortUtils';
import { PlusIcon } from '../components/icons/PlusIcon';
import { ArrowsIcon } from '../components/icons/ArrowsIcon';
import { Pagination } from '../components/icons/Pagination';
import { SearchField } from '../components/SearchField';

export function ProductsPage() {
  const { logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearch = useDebouncedValue(searchQuery, 400);
  const [sort, setSort] = useState<SortState>(() => loadInitialSort());
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const PAGE_SIZE = 5;

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const fetchData = useCallback(async () => {
    startLoading();
    setError(undefined);
    try {
      const response = await fetchProducts({
        searchQuery: debouncedSearch,
        skip: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      });
      setProducts(response.products);
      setTotal(response.total);
    } catch {
      setError('Не удалось загрузить список товаров');
    } finally {
      stopLoading();
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, page, fetchData]);

  const allProducts = useMemo(() => [...localProducts, ...products], [localProducts, products]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const calculatePaginationInfo = () => {
    const startIndex = (page - 1) * PAGE_SIZE + 1;
    let endIndex = page * PAGE_SIZE;
    endIndex = endIndex > total ? total : endIndex;
    return `${startIndex}-${endIndex} из ${total}`;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleProductAdded = (product: Product) => {
    setLocalProducts((prev) => [product, ...prev]);
    setToastMessage('Товар успешно добавлен');
  };

  const handleToastClose = () => {
    setToastMessage('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Товары</h1>
        <SearchField value={searchQuery} onChange={handleSearchChange} />
        <button type="button" className="button secondary small" onClick={logout}>
          Выйти
        </button>
      </header>

      <main className="page-content">
        <div className="toolbar">
          <h2>Все позиции</h2>
          <button
            type="button"
            className="button secondary small"
            onClick={fetchData}
            title="Обновить"
            aria-label="Обновить список товаров"
          >
            <ArrowsIcon />
          </button>
          <button
            type="button"
            className="button primary small"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusIcon />
            Добавить
          </button>
        </div>

        <ProductTable
          products={allProducts}
          isLoading={isLoading}
          error={error}
          sort={sort}
          onSortChange={setSort}
        />
        
        <div className="pagination-toolbar">
          <span className="pagination-info">
            Показано {calculatePaginationInfo()}
          </span>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </main>

      {isAddModalOpen && (
        <AddProductForm
          onProductAdded={handleProductAdded}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      <Toast message={toastMessage} onClose={handleToastClose} />
    </div>
  );
}
