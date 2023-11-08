import { useState, useEffect, useMemo, useCallback } from "react";

type UsePaginationArgs = {
  page: number;
  pageSize: number;
  totalItems: number;
  siblingCount?: number;
};
type EllipsisPage = {
  type: "ellipsis";
  value: "...";
};
type NumberPage = {
  type: "page";
  value: number;
};
type Page = EllipsisPage | NumberPage;

const usePagination = ({
  page,
  pageSize,
  totalItems,
  siblingCount = 1,
}: UsePaginationArgs) => {
  const [pages, setPages] = useState<Page[]>([]);
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize);
  }, [pageSize, totalItems]);
  const totalVisiblePages = useMemo(() => {
    return siblingCount + 5; //first page + dot + active page + dot + last page
  }, [siblingCount]);
  const firstPage = useMemo<NumberPage>(() => {
    return {
      type: "page",
      value: 1,
    };
  }, []);
  const ellipsisPage = useMemo<EllipsisPage>(() => {
    return {
      type: "ellipsis",
      value: "...",
    };
  }, []);
  const lastPage = useMemo<NumberPage>(() => {
    return {
      type: "page",
      value: totalPages,
    };
  }, [totalPages]);
  const leftSiblingStart = useMemo(() => {
    return Math.max(firstPage.value, page - siblingCount);
  }, [firstPage.value, page, siblingCount]);
  const rightSiblingEnd = useMemo(() => {
    return Math.min(page + siblingCount, lastPage.value);
  }, [lastPage.value, page, siblingCount]);
  const showLeftDots = useMemo(() => {
    return leftSiblingStart >= firstPage.value + 2;
    //1 for active page , 1 for first page
  }, [firstPage.value, leftSiblingStart]);
  const showRightDots = useMemo(() => {
    return rightSiblingEnd <= totalPages - 2; //1 for active page , 1 for last page
  }, [rightSiblingEnd, totalPages]);
  const generatePages = useCallback((start: number, end: number) => {
    const arr: NumberPage[] = [];
    const length = end - start + 1;
    for (let i = 0; i < length; i++)
      arr[i] = { type: "page", value: i + start };
    return arr;
  }, []);
  useEffect(() => {
    if (totalPages <= totalVisiblePages) {
      setPages(generatePages(1, totalPages)); //if we don't want any dots
    } else {
      if (showLeftDots && !showRightDots) {
        const rightRange = generatePages(leftSiblingStart, totalPages);
        setPages([firstPage, ellipsisPage, ...rightRange]);
      } else if (!showLeftDots && showRightDots) {
        const leftRange = generatePages(1, rightSiblingEnd);
        setPages([...leftRange, ellipsisPage, lastPage]);
      } else if (showLeftDots && showRightDots) {
        const middleRange = generatePages(leftSiblingStart, rightSiblingEnd);
        setPages([
          firstPage,
          ellipsisPage,
          ...middleRange,
          ellipsisPage,
          lastPage,
        ]);
      }
    }
  }, [
    totalPages,
    totalVisiblePages,
    firstPage,
    lastPage,
    showLeftDots,
    showRightDots,
    leftSiblingStart,
    rightSiblingEnd,
    generatePages,
    ellipsisPage,
  ]);
  return {
    pages,
    totalPages,
    totalVisiblePages,
    firstPage,
    lastPage,
    leftSiblingStart,
    rightSiblingEnd,
  };
};
export default usePagination;
