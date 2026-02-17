import { useCallback } from 'react';

const PAGE_SIZE = 5;

interface UsePaginationProps {
  totalPages: number;
  total: number;
  page: number;
  setPage: (page: number) => void;
}

export function usePagination({ totalPages, total, page, setPage }: UsePaginationProps) {

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages, setPage]);

  const paginationInfo = `${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, total)} из ${total}`;

  return {
    handlePageChange,
    paginationInfo,
  };
}
