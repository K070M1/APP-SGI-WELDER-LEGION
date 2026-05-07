import { useState } from 'react';

export function usePagination(totalRecords: number, initialPageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const pageStart = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const pageEnd = Math.min(currentPage * pageSize, totalRecords);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1);
  };

  return {
    currentPage,
    pageSize: String(pageSize),
    totalRecords,
    totalPages,
    pageStart,
    pageEnd,
    canNextPage: currentPage < totalPages,
    canPrevPage: currentPage > 1,
    handleNextPage,
    handlePrevPage,
    handlePageSizeChange,
  };
}