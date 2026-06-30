import { useEffect, useState } from 'react';

export function usePagination(
  totalRecords: number,
  initialPageSize: number = 10
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.max(
    1,
    Math.ceil(totalRecords / pageSize)
  );

  const pageStart =
    totalRecords === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const pageEnd = Math.min(
    currentPage * pageSize,
    totalRecords
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleNextPage = () => {
    setCurrentPage((previousPage) =>
      Math.min(previousPage + 1, totalPages)
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((previousPage) =>
      Math.max(previousPage - 1, 1)
    );
  };

  const handlePageSizeChange = (size: string) => {
    const newPageSize = Number(size);

    if (
      !Number.isFinite(newPageSize) ||
      newPageSize <= 0
    ) {
      return;
    }

    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const resetPage = () => {
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

    setCurrentPage,
    resetPage,
  };
}
