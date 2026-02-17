import { useAuth } from '../hooks/useAuth';
import type { Product } from '../types/product';
import { useProducts } from '../hooks/useProducts';
import { usePagination } from '../hooks/usePagination';
import { useProductModal } from '../hooks/useProductModal';
import { useToast } from '../hooks/useToast';
import { useProductsPageState } from '../hooks/useProductsPageState';
import { ProductTable } from '../components/ProductTable';
import { AddProductForm } from '../components/AddProductForm';
import { Toast } from '../components/ui/Toast';
import { ProductPageHeader } from '../components/ProductPageHeader';
import { ProductPageToolbar } from '../components/ProductPageToolbar';
import { Pagination } from '../components/icons/Pagination';

export function ProductsPage() {
  const { logout } = useAuth();
  const {
    localProducts,
    searchQuery,
    sort,
    page,
    setSort,
    setPage,
    handleSearchChange,
    handleProductAdded,
  } = useProductsPageState();

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

  const {
    isAddModalOpen,
    handleOpenAddModal,
    handleCloseAddModal,
    handleProductAdded: handleModalProductAdded,
  } = useProductModal({
    onProductAdded: handleProductAdded,
  });

  const { toastMessage, showToast, handleToastClose } = useToast();

  const handleProductAddedWithToast = (product: Product) => {
    handleModalProductAdded(product);
    showToast('Товар успешно добавлен');
  };

  return (
    <div className="page">
      <ProductPageHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onLogout={logout}
      />

      <main className="page-content">
        <ProductPageToolbar onRefresh={refresh} onOpenAddModal={handleOpenAddModal} />

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
