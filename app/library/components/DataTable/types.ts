type Align = "start" | "center" | "end";
type Variant = "outlined" | "zebra";
type NumberString = number | string;
type SortBy = null | string;
type SortOrder = null | "asc" | "desc";

export type Item = {
  id: NumberString;
  [key: string]: any;
};

export type Header = {
  value: string;
  text: string;
  align?: Align;
  sortable?: boolean;
  width?: NumberString;
  minWidth?: NumberString;
  maxWidth?: NumberString;
  headerJsx?: ({
    header,
    headers,
  }: {
    header: Header;
    headers: Header[];
  }) => React.ReactNode; //jsx of <th>
  itemJsx?: ({
    item,
    items,
    header,
    headers,
    isExpanded,
    updateExpandedRows,
  }: {
    item: Item;
    items: Item[];
    header: Header;
    headers: Header[];
    isExpanded: boolean;
    updateExpandedRows: (id: NumberString) => void;
  }) => React.ReactNode; //jsx of <td>
  headerClassName?: string; //for desktop --> apply on specific <th> , for mobile --> apply to header <div>
  cellClassName?: string; //for desktop --> apply on specific <td> , for mobile --> apply on body <div>
};

export type TableDesktopProps = Pick<
  DataTableProps,
  | "items"
  | "variant"
  | "loading"
  | "spacing"
  | "fixHeader"
  | "expand"
  | "singleExpand"
  | "expandJsx"
  | "headerClassName"
  | "headerRowClassName"
  | "headerCellClassName"
  | "bodyClassName"
  | "bodyRowClassName"
  | "bodyCellClassName"
  | "expandRowClassName"
  | "expandCellClassName"
> & {
  finalizeHeaders: Header[];
  finalizeItems: Item[];
  sortBy: SortBy;
  sortOrder: SortOrder;
  updateSortBy: (sortable: boolean, sort: string) => void;
  expandedRows: null | NumberString | NumberString[];
  updateExpandedRows: (id: NumberString) => void;
  cellAlignmentClassName: (align: Align) => string;
};

export type TableMobileProps = Pick<
  DataTableProps,
  | "items"
  | "variant"
  | "loading"
  | "spacing"
  | "expand"
  | "singleExpand"
  | "expandJsx"
  | "headerCellClassName"
  | "bodyClassName"
  | "bodyRowClassName"
  | "bodyCellClassName"
  | "expandRowClassName"
  | "expandCellClassName"
> & {
  sortLabel: string;
  finalizeHeaders: Header[];
  finalizeItems: Item[];
  sortBy: SortBy;
  updateSortBy: (sortable: boolean, sort: string) => void;
  expandedRows: null | NumberString | NumberString[];
  updateExpandedRows: (id: NumberString) => void;
};

export type DataTableProps = {
  headers: Header[];
  items: Item[];
  variant?: Variant;
  spacing?: number;
  color?: string;
  height?: NumberString;
  pagination?: boolean;
  page?: number;
  setPage?: (page: number) => void;
  pageSize?: number;
  setPageSize?: (pageSize: number) => void;
  pageSizes?: { value: number; text: string }[];
  totalItems?: number;
  globalSearch?: boolean;
  loading?: boolean;
  loadingText?: string;
  noDataText?: string;
  mobileBreakpoint?: number;
  fixHeader?: boolean;
  selection?: boolean;
  selectedRows?: NumberString[];
  setSelectedRows?: (selectedRows: NumberString[]) => void;
  expand?: boolean;
  singleExpand?: boolean;
  expandJsx?: ({
    item,
    items,
    headers,
  }: {
    item: Item;
    items: Item[];
    headers: Header[];
  }) => React.ReactNode;
  headerClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  bodyClassName?: string;
  bodyRowClassName?: string;
  bodyCellClassName?: string;
  expandRowClassName?: string;
  expandCellClassName?: string;
  className?: string;
};
