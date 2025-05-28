// src/components/common/Pagination.jsx
import PaginationButton from './PaginationButton';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxPagesToShow = 5;
  const pages = [];

  pages.push(
    <PaginationButton
      key={1}
      onClick={() => onPageChange(1)}
      isActive={currentPage === 1}
    >
      1
    </PaginationButton>
  );
  if (currentPage > maxPagesToShow - 2) {
    pages.push(<span key="ellipsis-start" className="px-4 py-2 text-white">...</span>);
  }
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    pages.push(
      <PaginationButton
        key={i}
        onClick={() => onPageChange(i)}
        isActive={currentPage === i}
      >
        {i}
      </PaginationButton>
    );
  }
  if (currentPage <= totalPages - maxPagesToShow + 2) {
    pages.push(<span key="ellipsis-end" className="px-4 py-2 text-white">...</span>);
  }
  if (totalPages > 1) {
    pages.push(
      <PaginationButton
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
        isActive={currentPage === totalPages}
      >
        {totalPages}
      </PaginationButton>
    );
  }

  return (
    <div className="flex justify-center gap-2 mt-8 flex-wrap">
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        hoverColor="bg-indigo-500"
      >
        Previous
      </PaginationButton>
      {pages}
      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        hoverColor="bg-indigo-500"
      >
        Next
      </PaginationButton>
    </div>
  );
};

export default Pagination;