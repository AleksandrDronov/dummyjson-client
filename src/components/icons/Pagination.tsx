import { ArrowIcon } from './ArrowIcon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageButtons = Array.from({ length: 5 }, (_, i) => {
    const page = currentPage + i - 2;

    if (page > 0 && page <= totalPages) {
      return (
        <button
          key={page}
          className="pagination-button"
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
          style={{
            backgroundColor: page === currentPage ? '#797fea' : '',
            color: page === currentPage ? '#fff' : '',
          }}
        >
          {page}
        </button>
      );
    }
  });

  return (
    <div className="pagination">
      <button
        className="pagination-button-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowIcon />
      </button>
      {pageButtons}
      <button
        className="pagination-button-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        style={{ transform: 'rotate(180deg)' }}
      >
        <ArrowIcon />
      </button>
    </div>
  );
}
