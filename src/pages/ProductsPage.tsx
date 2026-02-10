import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Product } from '../types/product';
import { fetchProducts } from '../api/products';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { ProductTable } from '../components/ProductTable';
import { AddProductForm } from '../components/AddProductForm';
import { Toast } from '../components/Toast';
import { loadInitialSort, type SortState } from '../utils/sortUtils';

export function ProductsPage() {
  const { user, logout } = useAuth();
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
  const PAGE_SIZE = 10;

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();
  }, [debouncedSearch, page]);

  const allProducts = useMemo(() => [...localProducts, ...products], [localProducts, products]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

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

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-left">
          <h1>Товары</h1>
          <p className="page-subtitle">Список товаров из DummyJSON</p>
        </div>
        <div className="page-header-right">
          {user && (
            <div className="user-info">
              <span className="user-name">
                {user.firstName} {user.lastName}
              </span>
            </div>
          )}
          <button type="button" className="button secondary" onClick={logout}>
            Выйти
          </button>
        </div>
      </header>

      <main className="page-content">
        <div className="toolbar">
          <div className="toolbar-left">
            <input
              type="search"
              className="input"
              placeholder="Поиск по наименованию или описанию..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPage(1); // сбросить страницу при поиске
              }}
            />
          </div>
          <div className="toolbar-right">
            <button
              type="button"
              className="button primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              Добавить товар
            </button>
          </div>
        </div>

        <ProductTable
          products={allProducts}
          isLoading={isLoading}
          error={error}
          sort={sort}
          onSortChange={setSort}
        />

        <div
          className="pagination"
          style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}
        >
          <button
            className="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            style={{ marginRight: 8 }}
          >
            Назад
          </button>
          <span style={{ alignSelf: 'center' }}>
            Страница {page} из {totalPages || 1}
          </span>
          <button
            className="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            style={{ marginLeft: 8 }}
          >
            Вперёд
          </button>
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
