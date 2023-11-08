import { Fragment } from "react";
import Icon from "../Icon";
import Button from "../Button";
import usePagination from "../../hooks/usePagination";
import useLocaleDetails from "../../hooks/useLocaleDetails";

export type PageItemProps = {
  active?: boolean;
  disabled?: boolean;
  size?: number;
  color?: string;
  rounded?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};
export type PaginationProps = {
  page: number;
  setPage: (val: number) => void;
  pageSize?: number;
  total: number;
  sibling?: number;
  size?: number;
  color?: string;
  rounded?: boolean;
  spacing?: number;
  className?: string;
};

const PageItem = ({
  active = false,
  disabled = false,
  size = 40,
  color = "primary",
  rounded = false,
  onClick = () => {},
  children,
}: PageItemProps) => {
  return (
    <li style={{ height: `${size}px` }}>
      <Button
        disabled={disabled}
        onClick={onClick}
        variant={active ? "filled" : "text"}
        color={color}
        width={size}
        height={size}
        className={`!p-0 ${rounded ? "!rounded-circle" : "!rounded-sm"}`}
      >
        {children}
      </Button>
    </li>
  );
};
export default function Pagination({
  page,
  setPage,
  pageSize = 10,
  total,
  sibling = 1,
  size = 40,
  color = "primary",
  rounded = false,
  spacing = 2,
  className = "",
}: PaginationProps) {
  const { pages, totalPages } = usePagination({
    page,
    pageSize,
    totalItems: total,
    siblingCount: sibling,
  });
  const { dir } = useLocaleDetails();
  return (
    <div className={`inline-block ${className}`}>
      <ul
        className="flex items-center"
        style={{ columnGap: `${spacing * 4}px` }}
      >
        <PageItem
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          size={size}
          color={color}
          rounded={rounded}
        >
          <Icon
            icon={dir === "ltr" ? "mdi:chevron-left" : "mdi:chevron-right"}
            size="md"
            color={color}
          />
        </PageItem>
        {pages.map((pageDetail, i) => (
          <Fragment key={`${i}-${pageDetail.value}`}>
            {pageDetail.type === "ellipsis" && (
              <PageItem disabled size={size} color={color} rounded={rounded}>
                ...
              </PageItem>
            )}
            {pageDetail.type === "page" && (
              <PageItem
                active={page === pageDetail.value}
                onClick={() => setPage(pageDetail.value)}
                size={size}
                color={color}
                rounded={rounded}
              >
                {pageDetail.value}
              </PageItem>
            )}
          </Fragment>
        ))}
        <PageItem
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          size={size}
          color={color}
          rounded={rounded}
        >
          <Icon
            icon={dir === "ltr" ? "mdi:chevron-right" : "mdi:chevron-left"}
            size="md"
            color={color}
          />
        </PageItem>
      </ul>
    </div>
  );
}
