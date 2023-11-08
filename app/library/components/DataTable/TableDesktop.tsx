import { Fragment } from "react";
import Icon from "../Icon";
import type { TableDesktopProps } from "./types";

export default function TableDesktop({
  finalizeHeaders,
  items,
  finalizeItems,
  variant,
  sortBy,
  sortOrder,
  updateSortBy,
  loading,
  spacing = 4,
  fixHeader = false,
  expand,
  singleExpand,
  expandJsx,
  expandedRows,
  updateExpandedRows,
  cellAlignmentClassName,
  headerClassName = "",
  headerRowClassName = "",
  headerCellClassName = "",
  bodyClassName = "",
  bodyRowClassName = "",
  bodyCellClassName = "",
  expandRowClassName = "",
  expandCellClassName = "",
}: TableDesktopProps) {
  return (
    <table className="w-full border-spacing-0">
      <thead
        className={`${fixHeader ? "sticky top-0" : ""} ${headerClassName}`}
      >
        <tr
          className={`overflow-hidden ${
            variant === "zebra" ? "bg-card-lighten1 dark:bg-card-main" : ""
          }  ${headerRowClassName}`}
        >
          {finalizeHeaders.map((header) => {
            const {
              text,
              value,
              align = "start",
              sortable = true,
              width,
              minWidth,
              maxWidth,
              headerJsx,
              headerClassName = "",
            } = header;
            return (
              <th
                key={value}
                className={`group text-body1 font-bold text-text-main  ${
                  variant === "outlined"
                    ? "border-0 border-b border-solid border-divider-lighten1 dark:border-divider-main"
                    : ""
                } ${
                  variant === "zebra"
                    ? "first:rounded-s-sm last:rounded-e-sm"
                    : ""
                } ${cellAlignmentClassName(align)} ${
                  sortable ? "cursor-pointer" : ""
                } ${headerClassName} ${headerCellClassName}`}
                style={{
                  verticalAlign: "top",
                  padding: `${spacing * 4}px`,
                  width: typeof width === "number" ? `${width}px` : width,
                  minWidth:
                    typeof minWidth === "number" ? `${minWidth}px` : minWidth,
                  maxWidth:
                    typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
                }}
                onClick={() => updateSortBy(sortable, value)}
              >
                {headerJsx ? (
                  headerJsx({ header, headers: finalizeHeaders })
                ) : (
                  <span>{text}</span>
                )}
                {sortable && (
                  <Icon
                    className={`-mb-0.5 ms-2 ${
                      sortBy === value
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                    icon={
                      sortOrder === "desc" ? "mdi:arrow-up" : "mdi:arrow-down"
                    }
                    size="xs"
                    color={sortBy === value ? "primary" : "disable"}
                  />
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      {!loading && !!finalizeItems.length && (
        <tbody className={`${bodyClassName}`}>
          {finalizeItems.map((item) => {
            const isExpanded = singleExpand
              ? expandedRows === item.id
              : (expandedRows as (number | string)[]).includes(item.id);
            return (
              <Fragment key={item.id}>
                <tr
                  className={`group overflow-hidden transition-colors duration-200 ease-linear hover:bg-card-main ${
                    variant === "zebra"
                      ? "even:bg-card-lighten1 dark:even:bg-card-main"
                      : ""
                  }  ${bodyRowClassName}`}
                >
                  {finalizeHeaders.map((header) => {
                    const {
                      value: headerValue,
                      itemJsx,
                      cellClassName = "",
                      align = "start",
                    } = header;
                    const cellValue = item[headerValue];
                    return (
                      <td
                        key={headerValue}
                        className={`text-body2 text-text-main ${
                          variant === "outlined"
                            ? "border-0 border-b border-solid border-divider-lighten1 group-last:border-0 dark:border-divider-main"
                            : ""
                        } ${
                          variant === "zebra"
                            ? "first:rounded-s-sm last:rounded-e-sm"
                            : ""
                        } ${cellAlignmentClassName(
                          align
                        )} ${cellClassName} ${bodyCellClassName}`}
                        style={{
                          padding: `${spacing * 4}px`,
                        }}
                      >
                        {itemJsx ? (
                          itemJsx({
                            item,
                            items,
                            header,
                            headers: finalizeHeaders,
                            isExpanded,
                            updateExpandedRows,
                          })
                        ) : (
                          <span>{cellValue}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                {expand && isExpanded && expandJsx && (
                  <tr className={`overflow-hidden ${expandRowClassName}`}>
                    <td
                      colSpan={finalizeHeaders.length}
                      className={`text-body2 text-text-main ${expandCellClassName}`}
                      style={{
                        padding: `${spacing * 4}px`,
                      }}
                    >
                      {expandJsx({ item, items, headers: finalizeHeaders })}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      )}
    </table>
  );
}
