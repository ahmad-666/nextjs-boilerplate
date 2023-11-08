//for client-side pagination we don't handle it from inside of DataTable component and we should config 'items' prop that apply page,pageSize(just like what server does) ... items.slice((page-1)*pageSize,(page-1)*pageSize+pageSize)
//we use finalizeItems memo and we show it on ui ... first we make deep copy of items prop(so changes will not affect items prop value) then we apply search,sort on it
//page,pageSize,selectedRows need to be state on parents because we need them on parent
//search,expandedRows are just local states on DataTable

import { useState, useMemo, useCallback } from "react";
import TableDesktop from "./TableDesktop";
import TableMobile from "./TableMobile";
import Pagination from "../Pagination";
import TextField from "../TextField";
import Select from "../Select";
import ProgressLinear from "../ProgressLinear";
import Checkbox from "../Checkbox";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useTranslations } from "next-intl";
import type { DataTableProps, Header, Item } from "./types";

export default function DataTable({
  headers, //should use useMemo that return array
  items, //should use useState that is array
  variant = "outlined",
  spacing = 4,
  color = "primary",
  height = "auto",
  pagination = true,
  page = 1,
  setPage,
  pageSize = 10,
  setPageSize,
  pageSizes = [
    { value: 10, text: "10" },
    { value: 25, text: "25" },
    { value: 50, text: "50" },
    { value: 100, text: "100" },
  ],
  totalItems,
  globalSearch = true,
  loading = false,
  loadingText,
  noDataText,
  mobileBreakpoint = 700, //-1 for totally disable it
  fixHeader = false, //when we set it to true we should use explicit height
  selection = false,
  selectedRows = [], //contain array of ids of selected rows
  setSelectedRows,
  expand = false,
  singleExpand = true,
  expandJsx,
  headerClassName = "", //apply on <thead> , don't have any <thead> on mobile version, we can use headerCellClassName
  headerRowClassName = "", //apply on all <tr> inside <thead> , don't have any <thead> on mobile version , we can use headerCellClassName
  headerCellClassName = "", //apply on all <th> inside <thead>
  bodyClassName = "", //apply on <tbody>
  bodyRowClassName = "", //apply on all <tr> inside <tbody>
  bodyCellClassName = "", //apply on all <td> inside <tbody>
  expandRowClassName = "",
  expandCellClassName = "",
  className = "",
}: DataTableProps) {
  const isMobile = useMediaQuery(`(width<=${mobileBreakpoint}px)`);
  const [sortBy, setSortBy] = useState<null | string>(null);
  const [sortOrder, setSortOrder] = useState<null | "asc" | "desc">(null);
  const [toggleAllCheckbox, setToggleAllCheckbox] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedRows, setExpandedRows] = useState<
    null | number | string | (number | string)[]
  >(singleExpand ? null : []); //id or expanded row
  const t = useTranslations("dataTable");
  const translations = useMemo(() => {
    return {
      noData: noDataText || t("noData"),
      loading: loadingText || t("loading"),
      search: t("search"),
      pageSize: t("pageSize"),
      sortBy: t("sortBy"),
    };
  }, [loadingText, noDataText, t]);
  const containerMaxHeight = useMemo(() => {
    if (isMobile) return undefined;
    return typeof height === "number" ? `${height}px` : height;
  }, [isMobile, height]);
  const finalizeItems = useMemo(() => {
    let results: Item[] = [...items]; //make copy of items
    if (globalSearch && search) {
      results = results.filter((item) => {
        return !!Object.values(item).find((value) =>
          `${value}`.includes(search)
        );
      });
    }
    if (sortBy && sortOrder) {
      results = results.sort((firstItem: Item, secondItem: Item) => {
        const firstVal = firstItem[sortBy];
        const secondVal = secondItem[sortBy];
        if (
          (sortOrder === "asc" && firstVal > secondVal) ||
          (sortOrder === "desc" && firstVal < secondVal)
        )
          return 1;
        else if (
          (sortOrder === "asc" && firstVal < secondVal) ||
          (sortOrder === "desc" && firstVal > secondVal)
        )
          return -1;
        else return 0;
      });
    }
    return results;
  }, [items, globalSearch, search, sortBy, sortOrder]);
  const finalizeHeaders = useMemo(() => {
    const headersCopy = [...headers];
    const selectionHeader: Header = {
      value: "checkbox-select",
      text: "",
      sortable: false,
      headerJsx: () => {
        return (
          <Checkbox
            value={toggleAllCheckbox}
            setValue={(val) => {
              setToggleAllCheckbox(val);
              if (setSelectedRows) {
                if (val) setSelectedRows(items.map((item) => item.id));
                else setSelectedRows([]);
              }
            }}
            multiple={false}
            color={color}
            hideDetails
          />
        );
      },
      itemJsx: ({ item }) => {
        return (
          <Checkbox
            checkboxValue={item.id}
            value={selectedRows}
            setValue={(val) => {
              if (setSelectedRows) setSelectedRows(val);
              if (val.length === items.length) setToggleAllCheckbox(true);
              else setToggleAllCheckbox(false);
            }}
            multiple
            color={color}
            hideDetails
          />
        );
      },
    };
    return !selection ? [...headersCopy] : [selectionHeader, ...headersCopy];
  }, [
    color,
    headers,
    items,
    selectedRows,
    selection,
    setSelectedRows,
    toggleAllCheckbox,
  ]);
  const cellAlignmentClassName = useCallback(
    (align: "start" | "center" | "end") => {
      if (align === "center") return "text-center";
      else if (align === "end") return "text-end";
      else return "text-start";
    },
    []
  );
  const updateSortBy = useCallback(
    (sortable: boolean, sort: string) => {
      if (sortable) {
        let newSortBy: null | string = null;
        let newSortOrder: null | "asc" | "desc" = null;
        if (sortBy === sort) {
          //same sortBy
          newSortBy = sortOrder === null || sortOrder === "asc" ? sort : null;
          newSortOrder =
            sortOrder === null ? "asc" : sortOrder === "asc" ? "desc" : null;
        } else {
          //totally new sortBy
          newSortBy = sort;
          newSortOrder = "asc";
        }
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
      }
    },
    [sortBy, sortOrder]
  );
  const updatePage = useCallback(
    (page: number) => {
      if (setPage) setPage(page);
    },
    [setPage]
  );
  const updatePageSize = useCallback(
    (pageSize: number | string) => {
      if (setPageSize) setPageSize(pageSize as number);
    },
    [setPageSize]
  );
  const updateSearch = useCallback((search: string) => {
    setSearch(search);
  }, []);
  const updateExpandedRows = useCallback(
    (id: number | string) => {
      let currentlyExpandedRows;
      if (singleExpand) {
        currentlyExpandedRows = expandedRows as null | number | string;
        const isExpanded = currentlyExpandedRows === id;
        if (!isExpanded) setExpandedRows(id);
        else setExpandedRows(null);
      } else {
        currentlyExpandedRows = expandedRows as (number | string)[];
        const isExpanded = currentlyExpandedRows.includes(id);
        if (!isExpanded) setExpandedRows([...currentlyExpandedRows, id]);
        else setExpandedRows(currentlyExpandedRows.filter((exp) => exp !== id));
      }
    },
    [expandedRows, singleExpand]
  );
  return (
    <div className={`${className}`}>
      {globalSearch && (
        <div className="mb-6 flex flex-col items-center justify-start gap-4 sm:flex-row sm:justify-between">
          <TextField
            value={search}
            setValue={updateSearch}
            label={translations.search}
            variant="filled"
            color={color}
            hideDetails
            dense
          />
        </div>
      )}
      <div
        className="overflow-auto"
        style={{
          maxHeight: containerMaxHeight,
        }}
      >
        {!isMobile && (
          <TableDesktop
            finalizeHeaders={finalizeHeaders}
            items={items}
            finalizeItems={finalizeItems}
            variant={variant}
            sortBy={sortBy}
            sortOrder={sortOrder}
            updateSortBy={updateSortBy}
            loading={loading}
            spacing={spacing}
            fixHeader={fixHeader}
            expand={expand}
            singleExpand={singleExpand}
            expandJsx={expandJsx}
            expandedRows={expandedRows}
            updateExpandedRows={updateExpandedRows}
            cellAlignmentClassName={cellAlignmentClassName}
            headerClassName={headerClassName}
            headerRowClassName={headerRowClassName}
            headerCellClassName={headerCellClassName}
            bodyClassName={bodyClassName}
            bodyRowClassName={bodyRowClassName}
            bodyCellClassName={bodyCellClassName}
            expandRowClassName={expandRowClassName}
            expandCellClassName={expandCellClassName}
          />
        )}
        {isMobile && (
          <TableMobile
            sortLabel={translations.sortBy}
            finalizeHeaders={finalizeHeaders}
            items={items}
            finalizeItems={finalizeItems}
            variant={variant}
            sortBy={sortBy}
            updateSortBy={updateSortBy}
            loading={loading}
            spacing={spacing}
            expand={expand}
            singleExpand={singleExpand}
            expandJsx={expandJsx}
            expandedRows={expandedRows}
            updateExpandedRows={updateExpandedRows}
            headerCellClassName={headerCellClassName}
            bodyClassName={bodyClassName}
            bodyRowClassName={bodyRowClassName}
            bodyCellClassName={bodyCellClassName}
            expandRowClassName={expandRowClassName}
            expandCellClassName={expandCellClassName}
          />
        )}
      </div>
      {loading && (
        <div>
          <ProgressLinear color={color} height={4} indeterminate />
          <p className="mt-4 text-center text-body1 font-bold text-text-main">
            {translations.loading}
          </p>
        </div>
      )}
      {!loading && !finalizeItems.length && (
        <div className="mt-4">
          <p className="text-center text-body1 font-bold text-text-main">
            {translations.noData}
          </p>
        </div>
      )}
      {pagination && !loading && !!finalizeItems.length && (
        <div className="mt-4 flex flex-col items-center justify-start gap-4 sm:flex-row sm:justify-between">
          <Pagination
            page={page}
            setPage={updatePage}
            pageSize={pageSize}
            total={totalItems!}
            sibling={1}
            size={35}
            color={color}
            spacing={2}
          />
          <Select
            className="w-[110px]"
            value={pageSize}
            setValue={updatePageSize}
            variant="filled"
            color={color}
            label={translations.pageSize}
            hideDetails
            items={pageSizes}
            dense
          />
        </div>
      )}
    </div>
  );
}
