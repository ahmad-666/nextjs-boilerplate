import { useMemo, Fragment } from "react";
import AutoComplete from "../AutoComplete";
import type { TableMobileProps } from "./types";

export default function TableMobile({
  sortLabel,
  finalizeHeaders,
  items,
  finalizeItems,
  variant,
  sortBy,
  updateSortBy,
  loading,
  spacing = 4,
  expand,
  singleExpand,
  expandJsx,
  expandedRows,
  updateExpandedRows,
  headerCellClassName = "",
  bodyClassName = "",
  bodyRowClassName = "",
  bodyCellClassName = "",
  expandRowClassName = "",
  expandCellClassName = "",
}: TableMobileProps) {
  const sortItems = useMemo(() => {
    return finalizeHeaders
      .filter((header) => header.sortable)
      .map((header) => ({
        text: header.text,
        value: header.value,
      }));
  }, [finalizeHeaders]);
  return (
    <div>
      {!!sortItems.length && (
        <AutoComplete
          className="mb-4"
          value={sortBy!}
          setValue={(val) => {
            if (!val) updateSortBy(true, "");
            else updateSortBy(true, `${val}`);
          }}
          items={sortItems}
          label={sortLabel}
          multiple={false}
          hideDetails
          clearable
          dense
        />
      )}
      <table className="w-full border-spacing-0">
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
                    } ${bodyRowClassName}`}
                  >
                    {finalizeHeaders.map((header) => {
                      const {
                        text,
                        headerJsx,
                        value: headerValue,
                        itemJsx,
                        headerClassName = "",
                        cellClassName = "",
                      } = header;
                      const cellValue = item[headerValue];
                      return (
                        <td
                          key={headerValue}
                          className={`flex w-full items-start justify-between gap-4 ${
                            variant === "outlined"
                              ? "last:border-0 last:border-b last:border-solid last:border-divider-lighten1 group-last:border-b-0 dark:last:border-divider-main"
                              : ""
                          }`}
                          style={{
                            padding: `${spacing * 4}px`,
                          }}
                        >
                          <div
                            className={`text-body1 font-bold text-text-main ${
                              headerValue === "checkbox-select" ? "hidden" : ""
                            } ${headerClassName} ${headerCellClassName}`}
                          >
                            {headerJsx ? (
                              headerJsx({ header, headers: finalizeHeaders })
                            ) : (
                              <span>{text}</span>
                            )}
                          </div>
                          <div
                            className={`text-body2 text-text-main ${cellClassName} ${bodyCellClassName}`}
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
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  {expand && isExpanded && expandJsx && (
                    <tr className={`overflow-hidden ${expandRowClassName}`}>
                      <td
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
    </div>
  );
}
