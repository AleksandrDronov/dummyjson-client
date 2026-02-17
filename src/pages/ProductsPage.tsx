import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Product } from '../types/product';
import { useProducts } from '../hooks/useProducts';
import { usePagination } from '../hooks/usePagination';
import { useProductModal } from '../hooks/useProductModal';
import { useToast } from '../hooks/useToast';
import { ProductTable } from '../components/ProductTable';
import { AddProductForm } from '../components/AddProductForm';
import { Toast } from '../components/ui/Toast';
import { loadInitialSort, type SortState } from '../utils/sortUtils';
import { PlusIcon } from '../components/icons/PlusIcon';
import { ArrowsIcon } from '../components/icons/ArrowsIcon';
import { Pagination } from '../components/icons/Pagination';
import { SearchField } from '../components/ui/SearchField';

export function ProductsPage() {
  const { logout } = useAuth();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<SortState>(() => loadInitialSort());
  const [page, setPage] = useState(1);

  const { products, isLoading, error, totalPages, total, refresh } = useProducts({
    searchQuery,
    page,
    localProducts,
  });

  const { handlePageChange, paginationInfo } = usePagination({
    totalPages,
    total,
    page,
    setPage,
  });

  const { isAddModalOpen, handleOpenAddModal, handleCloseAddModal, handleProductAdded } =
    useProductModal({
      onProductAdded: (product: Product) => {
        setLocalProducts((prev) => [product, ...prev]);
      },
    });

  const { toastMessage, showToast, handleToastClose } = useToast();

  const handleProductAddedWithToast = (product: Product) => {
    handleProductAdded(product);
    showToast('Товар успешно добавлен');
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
            onClick={refresh}
            title="Обновить"
            aria-label="Обновить список товаров"
          >
            <ArrowsIcon />
          </button>
          <button type="button" className="button primary small" onClick={handleOpenAddModal}>
            <PlusIcon />
            Добавить
          </button>
        </div>

        <ProductTable
          products={products}
          isLoading={isLoading}
          error={error}
          sort={sort}
          onSortChange={setSort}
        />

        <div className="pagination-toolbar">
          <span className="pagination-info">Показано {paginationInfo}</span>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </main>

      {isAddModalOpen && (
        <AddProductForm
          onProductAdded={handleProductAddedWithToast}
          onClose={handleCloseAddModal}
        />
      )}

      <Toast message={toastMessage} onClose={handleToastClose} />
    </div>
  );
}
