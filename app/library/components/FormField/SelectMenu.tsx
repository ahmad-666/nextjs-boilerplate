//this component should only used inside <FormField /> and should not use standalone

import { Fragment, useMemo, useCallback } from "react";
import Checkbox from "../Checkbox";
import useColorParser from "../../hooks/useColorParser";
import type { SelectMenuProps, SelectItemProps } from "./types";

const SelectItem = ({
  itemValue,
  itemClick, //for set value of whole form-field
  color = "primary",
  isActive = false,
  isSelected = false,
  disabled = false,
  children,
  className = "",
}: SelectItemProps) => {
  const parsedColor = useColorParser(color);
  const clickHandler = useCallback(() => {
    if (itemClick) itemClick(itemValue);
  }, [itemValue, itemClick]);
  return (
    <li
      onClick={clickHandler}
      className={`p-3 text-body1 text-text-main transition-colors duration-100 ease-linear hover:bg-card-main ${
        isActive ? "!bg-card-main" : ""
      } ${
        disabled ? "pointer-events-none opacity-40" : "cursor-pointer"
      } ${className}`}
      style={{
        backgroundColor: isSelected ? `${parsedColor}33` : undefined,
      }}
    >
      {children}
    </li>
  );
};

export default function SelectMenu({
  value, //value of whole form-field ,each item has its own item.value
  itemClick, //setValue for change value of whole form-field
  activeItemIndex,
  items = [],
  multiple = false,
  itemJsx,
  noDataText,
  color = "primary",
  itemClassName = "",
  className = "",
}: SelectMenuProps) {
  const isItemsEmpty = useMemo(() => {
    return !items.length;
  }, [items.length]);
  return (
    <div className={`${className}`}>
      <ul>
        {isItemsEmpty && (
          <SelectItem disabled className={`p-5 ${itemClassName}`}>
            {noDataText}
          </SelectItem>
        )}
        {!isItemsEmpty &&
          items.map((item, i) => {
            const isSelected = !multiple
              ? value === item.value
              : value.includes(item.value);
            const isActive = activeItemIndex === i;
            return (
              <Fragment key={item.value}>
                {!multiple && (
                  <SelectItem
                    itemValue={item.value}
                    itemClick={itemClick}
                    isActive={isActive}
                    isSelected={isSelected}
                    disabled={item.disabled}
                    color={color}
                    className={`${itemClassName}`}
                  >
                    {!itemJsx ? item.text : itemJsx(item)}
                  </SelectItem>
                )}

                {multiple && (
                  <SelectItem
                    itemValue={item.value}
                    itemClick={itemClick}
                    isActive={isActive}
                    isSelected={isSelected}
                    disabled={item.disabled}
                    color={color}
                    className={`flex items-center ${itemClassName}`}
                  >
                    <Checkbox
                      value={value}
                      checkboxValue={item.value}
                      disabled={item.disabled}
                      multiple
                      color={color}
                      hideDetails
                      className="me-3"
                    ></Checkbox>
                    {!itemJsx ? item.text : itemJsx(item)}
                  </SelectItem>
                )}
              </Fragment>
            );
          })}
      </ul>
    </div>
  );
}
