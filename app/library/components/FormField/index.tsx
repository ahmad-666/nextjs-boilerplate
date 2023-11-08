//on <input /> , <textarea /> we use onBlur,onInput,onChange,onKeydown,onKeyup but not onFocus
//onFocus is when we clicked on main container

import {
  useState,
  useRef,
  useMemo,
  useCallback,
  useId,
  useEffect,
} from "react";
import { useTranslations } from "next-intl";
import FormLabel from "./FormLabel";
import FormHint from "./FormHint";
import SelectMenu from "./SelectMenu";
import Menu from "../Menu";
import Button from "../Button";
import Icon from "../Icon";
import ProgressLinear from "../ProgressLinear";
import useColorParser from "../../hooks/useColorParser";
import useHover from "../../hooks/useHover";
import useLocaleDetails from "../../hooks/useLocaleDetails";
import type { Item, Element, FormFieldProps } from "./types";

export default function FormField({
  as,
  type = "text",
  value,
  setValue,
  variant = "outlined",
  label,
  asterisk = false,
  labelPos = "inside",
  placeholder,
  id,
  name,
  color = "primary",
  bgColor = "card",
  textColor = "text",
  labelColor = "text-lighten1",
  borderColor = "border",
  iconColor = "text-lighten1",
  errorColor = "error",
  loading = false,
  clearable = false,
  dense = false,
  readonly = false,
  disabled = false,
  error = "",
  hint = "",
  hideDetails = false,
  autoFocus = false,
  startInnerIcon,
  startOuterIcon,
  endInnerIcon,
  endOuterIcon,
  startInnerJsx,
  startOuterJsx,
  endInnerJsx,
  endOuterJsx,
  onInput,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  onClear,
  minHeight = 100,
  maxHeight = 300,
  autoGrow = true,
  items = [],
  noDataText,
  multiple,
  itemJsx,
  valueJsx,
  inputSearch, //only useful for Select,AutoComplete,ComboBox ... for value of search field
  setInputSearch, //only useful for Select,AutoComplete,ComboBox
  searchFn, //take search query + item as arg and return boolean , if return true we have item else we filter it
  menuProps,
  containerClassName = "", //apply to main container of <input /> or <textarea />
  inputClassName = "", //apply to <input /> or <textarea />
  labelClassName = "", //apply to <label />
  menuClassName = "", //apply to wrapper of menu for Select,AutoComplete,ComboBox
  itemClassName = "", //will be apply to each item in Select,AutoComplete,ComboBox
  className = "", //apply to highest wrapper
}: FormFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const inputRef = useRef<Element>(null!); //<input /> for TextField and <textarea /> for TextArea
  const menuRef = useRef<HTMLDivElement>(null!); //only for select,autocomplete,combobox , container of menu of items
  const isContainerHover = useHover(containerRef);
  const colorParsed = useColorParser(color);
  const textColorParsed = useColorParser(textColor);
  const bgColorParsed = useColorParser(bgColor);
  const labelColorParsed = useColorParser(labelColor);
  const borderColorParsed = useColorParser(borderColor);
  const errorColorParsed = useColorParser(errorColor);
  const generatedId = useId();
  const [isFocus, setIsFocus] = useState(autoFocus);
  const [isSelectActive, setIsSelectActive] = useState(autoFocus); //only useful for select,autocomplete,combobox
  //this state is used for showing menu of select + showing search field of select
  //we don't use isFocus state and use another state for having more control
  const [search, setSearch] = useState("");
  const [shouldFilter, setShouldFilter] = useState(false); //only for select,autocomplete,combobox , only if it sets to true we start filter items
  const [activeItemIndex, setActiveItemIndex] = useState(-1); //only useful for select,autocomplete,combobox , for times we open menu and press ArrowDown,ArrowUp keys for move through elements
  const t = useTranslations("formField");
  const { dir } = useLocaleDetails();
  const inputId = useMemo(() => {
    return id || generatedId;
  }, [id, generatedId]);
  const isActive = useMemo(() => {
    return !!(isFocus || (!multiple ? value : value.length));
  }, [multiple, value, isFocus]);
  const hasError = useMemo(() => {
    return !!error;
  }, [error]);
  const hasStartOuter = useMemo(() => {
    return !!(startOuterIcon || startOuterJsx);
  }, [startOuterIcon, startOuterJsx]);
  const hasStartInner = useMemo(() => {
    return !!(startInnerIcon || startInnerJsx);
  }, [startInnerIcon, startInnerJsx]);
  const hasEndInner = useMemo(() => {
    return !!(endInnerIcon || endInnerJsx);
  }, [endInnerIcon, endInnerJsx]);
  const hasEndOuter = useMemo(() => {
    return !!(endOuterIcon || endOuterJsx);
  }, [endOuterIcon, endOuterJsx]);
  const isTextArea = useMemo(() => {
    return as === "textarea";
  }, [as]);
  const isSelect = useMemo(() => {
    return as === "select" || as === "autocomplete" || as === "combobox";
  }, [as]);
  const TextTag = useMemo(() => {
    if (as === "textarea") return "textarea";
    return "input";
  }, [as]);
  const inputType = useMemo(() => {
    if (as === "textfield") return type; //for textfield
    else if (isSelect) return "text"; //for select,autocomplete,combobox
    return undefined; //for textarea
  }, [as, isSelect, type]);
  const inputMode = useMemo(() => {
    if (type === "number") return "numeric";
    else if (type === "tel") return "tel";
    else return "text";
  }, [type]);
  const spacing = useMemo(() => {
    return dense ? 8 : 12;
  }, [dense]);
  const showClearBtn = useMemo(() => {
    return !!(
      clearable &&
      (!multiple ? value : value.length) &&
      !readonly &&
      !disabled &&
      (isContainerHover || isFocus)
    );
  }, [
    clearable,
    multiple,
    value,
    readonly,
    disabled,
    isContainerHover,
    isFocus,
  ]);
  const coloring = useMemo(() => {
    return {
      bgColor: bgColorParsed,
      textColor: textColorParsed,
      borderColor: hasError
        ? errorColorParsed
        : isFocus
        ? colorParsed
        : borderColorParsed,
      labelColor: hasError
        ? errorColorParsed
        : isFocus
        ? colorParsed
        : labelColorParsed,
      iconColor: hasError ? errorColor : isFocus ? color : iconColor,
      loaderColor: color,
    };
  }, [
    color,
    errorColor,
    colorParsed,
    textColorParsed,
    labelColorParsed,
    borderColorParsed,
    bgColorParsed,
    iconColor,
    errorColorParsed,
    isFocus,
    hasError,
  ]);
  const filteredItems = useMemo(() => {
    //final items that we show on the menu
    if (!shouldFilter) return items;
    else if (!searchFn) {
      return items.filter((item) =>
        item.text.toLowerCase().includes(search.toLowerCase())
      );
    }
    return items.filter((item) => searchFn(search, item));
  }, [shouldFilter, items, search, searchFn]);
  const selectedItems = useMemo<Item[]>(() => {
    //value that we see
    //we always return Item[] from this useMemo even for multiple:false
    const valueArray = !multiple ? [value] : [...value];
    const targetItems = valueArray
      .map((val) => {
        const targetItem = items.find((item) => item.value === val);
        if (as !== "combobox" && targetItem) return targetItem;
        else if (as === "combobox")
          return targetItem || ({ value: val, text: val } as Item);
        else undefined;
      })
      .filter((item) => item?.value !== undefined) as Item[];
    return targetItems;
  }, [as, value, items, multiple]);
  const showSelectItems = useMemo(() => {
    return isSelect && ((!multiple && !isSelectActive) || multiple);
  }, [isSelect, multiple, isSelectActive]);
  const showTextfield = useMemo(() => {
    //because we want 'ref' of form element we should not use conditional rendering on it and when showTextfield is false we only add 'width: 0' to it
    if (
      as === "textfield" ||
      as === "textarea" ||
      ((as === "autocomplete" || as === "combobox") && isSelectActive)
    )
      return true;
    else return false;
  }, [as, isSelectActive]);
  const translations = useMemo(() => {
    return {
      noDataText: noDataText || t("noData"),
    };
  }, [noDataText, t]);
  const menuPosition = useMemo(() => {
    if (as === "select" && dir === "ltr") return "left-top";
    else if (as === "select" && dir === "rtl") return "right-top";
    else if (as !== "select" && dir === "ltr") return "left-bottom";
    else if (as !== "select" && dir === "rtl") return "right-bottom";
  }, [as, dir]);
  const updateValue = useCallback(
    (newValue: any) => {
      //for preventing nesting if/else to much we use 'return'
      if (setValue) {
        if (!isSelect) setValue(newValue); //for text-field,textarea
        else {
          //for select,autocomplete,combobox
          if (!multiple) {
            const item = items.find((item) => item.value === newValue);
            setSearch(item?.text || "");
            setIsSelectActive(false);
            setShouldFilter(false);
            setValue(newValue);
          } else {
            setSearch("");
            const isSelected = value.includes(newValue);
            if (!isSelected) setValue([...value, newValue]);
            //if we already select it and we need to deselect it
            else setValue(value.filter((val: any) => val !== newValue));
          }
        }
      }
    },
    [isSelect, multiple, value, items, setValue]
  );
  const addComboboxItem = useCallback(() => {
    //we should not add things like empty string or ...
    if (
      search.trim().length &&
      (!multiple || (multiple && !value.includes(search)))
    ) {
      //for multiple:true only add new item if value is unique
      const item = items.find(
        (item) => item.text.toLowerCase() === search.toLowerCase()
      );
      updateValue(item && !item.disabled ? item.value : search);
      setSearch("");
    }
  }, [multiple, value, search, items, updateValue]);
  const keydownHandler = useCallback(
    (e: React.KeyboardEvent<Element>) => {
      const { key } = e;
      if (isSelect && key === "ArrowDown") {
        setActiveItemIndex((old) => (old + 1) % filteredItems.length);
      } else if (isSelect && key === "ArrowUp") {
        setActiveItemIndex((old) =>
          old - 1 >= 0 ? old - 1 : filteredItems.length - 1
        );
      } else if (isSelect && key === "Enter") {
        const item = filteredItems.find((item, i) => i === activeItemIndex);
        if (item && !item.disabled) updateValue(item.value);
        else if (as === "combobox") addComboboxItem();
      } else if (
        key === "Backspace" &&
        isSelect &&
        multiple &&
        !search.trim().length &&
        setValue
      ) {
        //only delete if search field is empty
        setValue(value.filter((val: any, i: number) => i !== value.length - 1));
      }
      if (onKeyDown) onKeyDown(e);
    },
    [
      as,
      isSelect,
      multiple,
      value,
      search,
      activeItemIndex,
      filteredItems,
      setValue,
      updateValue,
      onKeyDown,
      addComboboxItem,
    ]
  );
  const keyupHandler = useCallback(
    (e: React.KeyboardEvent<Element>) => {
      if (onKeyUp) onKeyUp(e);
    },
    [onKeyUp]
  );
  const inputHandler = useCallback(
    (e: React.FormEvent<Element>) => {
      if (isTextArea && autoGrow) {
        //first we make current height to 0 then we find scrollHeight and apply it
        inputRef.current.style.setProperty("height", "0");
        const newHeight = inputRef.current.scrollHeight;
        inputRef.current.style.setProperty("height", `${newHeight}px`);
      }
      if (onInput) onInput(e);
    },
    [onInput, isTextArea, autoGrow]
  );
  const changeHandler = useCallback(
    (e: React.ChangeEvent<Element>) => {
      //this is onChange of <input /> , <textarea /> and not onChange of <Select>,<AutoComplete>,<ComboBox>
      const newVal = e.target.value;
      if (!isSelect) {
        updateValue(newVal);
        if (onChange) onChange(newVal);
      } else {
        setShouldFilter(true);
        setSearch(newVal);
      }
    },
    [isSelect, updateValue, onChange]
  );
  const selectChangeHandler = useCallback(
    (newVal: any) => {
      //this is onChange of <Select>,<AutoComplete>,<ComboBox> and not onChange of <input /> , <textarea />
      if (isSelect) {
        updateValue(newVal);
        if (onChange) onChange(newVal);
      }
    },
    [isSelect, updateValue, onChange]
  );
  const focusHandler = useCallback(() => {
    //it's not onFocus event and actually it is click handler on main container but will act same as onFocus
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocus(true);
      if (!isFocus && isSelect && !multiple) {
        //we only select if we already don't focus on it
        setTimeout(() => {
          inputRef.current.select();
        }, 0);
      }
      if (isSelect) {
        //we always do these things even if we already have focus
        if (!readonly && !disabled) setIsSelectActive(true);
        if (!multiple) setSearch(selectedItems?.[0]?.text || "");
      }
      if (!isFocus && onFocus) onFocus(inputRef);
    }
  }, [readonly, disabled, isFocus, onFocus, isSelect, multiple, selectedItems]);
  const blurHandler = useCallback(() => {
    //it's not onBlur event and actually it is for times we click outside both container,menu
    if (inputRef.current) {
      inputRef.current.blur();
      setIsFocus(false);
      if (isSelect) {
        //we always do these things even if we already have blur
        setIsSelectActive(false);
        setSearch("");
        setShouldFilter(false);
        if (as === "combobox") addComboboxItem();
      }
      if (isFocus && onBlur) onBlur(inputRef); //we only blur if we already don't blur on it
    }
  }, [as, isFocus, onBlur, isSelect, addComboboxItem]);
  const clearHandler = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); //for not opening select menu
      const newVal = !multiple ? "" : [];
      if (setValue) setValue(newVal);
      setSearch("");
      if (onChange) onChange(newVal);
      if (onClear) onClear(newVal);
    },
    [multiple, setValue, onClear, onChange]
  );
  const documentClickHandler = useCallback(
    (e: MouseEvent) => {
      const clickedElm = e.target as HTMLElement;
      const isInsideContainer = containerRef.current.contains(clickedElm);
      const isInsideMenu = menuRef.current?.contains(clickedElm);
      if (!isInsideContainer && !isInsideMenu) blurHandler();
    },
    [blurHandler]
  );
  useEffect(() => {
    //update local search state whenever inputSearch prop changes
    if (isSelect) {
      setSearch(inputSearch || "");
    }
  }, [isSelect, inputSearch]);
  useEffect(() => {
    //update inputSearch prop whenever we update local search state
    if (isSelect && setInputSearch) setInputSearch(search);
  }, [isSelect, search, setInputSearch]);
  useEffect(() => {
    //whenever change search/visibility of menu we make activeItemIndex to -1 to reset it
    setActiveItemIndex(-1);
  }, [search, isSelectActive]);
  useEffect(() => {
    //add click lister for check when we click outside of main container + menu to close menu
    document.addEventListener("click", documentClickHandler);
    return () => {
      document.removeEventListener("click", documentClickHandler);
    };
  }, [documentClickHandler]);
  return (
    <div className={`${className}`}>
      <div className={`${disabled ? "pointer-events-none opacity-50" : ""}`}>
        {label && labelPos === "outside" && (
          <FormLabel
            as={as}
            id={inputId}
            color={coloring.labelColor}
            labelPos="outside"
            asterisk={asterisk}
            className={`mb-2 ${labelClassName}`}
          >
            {label}
          </FormLabel>
        )}
        <div
          className="flex items-baseline"
          style={{
            columnGap: `${spacing}px`,
          }}
        >
          {hasStartOuter && (
            <div className="flex shrink-0">
              {startOuterIcon && (
                <Icon
                  icon={startOuterIcon}
                  size="sm"
                  color={coloring.iconColor}
                />
              )}
              {startOuterJsx && startOuterJsx({ isFocus, isActive, hasError })}
            </div>
          )}
          <div className="w-full grow">
            <div
              ref={containerRef}
              onClick={focusHandler}
              className={`flex overflow-hidden rounded-sm ${
                isTextArea ? "items-start" : "items-center"
              } ${variant === "outlined" ? "border border-solid" : ""} ${
                variant === "outlined" && isFocus ? "border-2" : ""
              } ${dense && !isTextArea ? "min-h-[40px]" : ""} ${
                !dense && !isTextArea ? "min-h-[56px]" : ""
              } ${
                readonly || disabled ? "cursor-auto" : "cursor-text"
              } ${containerClassName}`}
              style={{
                padding: `${spacing}px`,
                columnGap: `${spacing}px`,
                borderColor:
                  variant === "outlined" ? coloring.borderColor : undefined,
                backgroundColor:
                  variant === "filled" ? coloring.bgColor : undefined,
              }}
            >
              {hasStartInner && (
                <div className="flex shrink-0">
                  {startInnerIcon && (
                    <Icon
                      icon={startInnerIcon}
                      size="sm"
                      color={coloring.iconColor}
                    />
                  )}
                  {startInnerJsx &&
                    startInnerJsx({ isFocus, isActive, hasError })}
                </div>
              )}
              <div
                className={`relative flex grow ${
                  !dense ? "text-body1" : "text-body2"
                }`}
              >
                {label && labelPos === "inside" && (
                  <FormLabel
                    as={as}
                    id={inputId}
                    color={coloring.labelColor}
                    labelPos="inside"
                    asterisk={asterisk}
                    isActive={isActive}
                    className={`transition-all duration-100 ease-linear ${labelClassName}`}
                  >
                    {label}
                  </FormLabel>
                )}
                <div
                  className="flex w-full flex-wrap items-start"
                  style={{
                    marginTop:
                      label && labelPos === "inside"
                        ? `${spacing}px`
                        : undefined,
                    gap: `${spacing}px`,
                  }}
                >
                  {showSelectItems &&
                    selectedItems.map((item, i) => (
                      <div key={item.value} className="text-text-main">
                        {!valueJsx
                          ? `${item.text}${
                              i < selectedItems.length - 1 ? " , " : ""
                            }`
                          : valueJsx(item)}
                      </div>
                    ))}
                  <TextTag
                    autoComplete="off"
                    autoFocus={autoFocus}
                    inputMode={inputMode}
                    ref={inputRef as any}
                    value={!isSelect ? value : search}
                    type={inputType}
                    id={inputId}
                    name={name}
                    placeholder={placeholder}
                    readOnly={readonly || as === "select"}
                    disabled={disabled}
                    onInput={inputHandler}
                    onChange={changeHandler}
                    onKeyDown={keydownHandler}
                    onKeyUp={keyupHandler}
                    className={`appearance-none border-none bg-transparent outline-none placeholder:text-text-lighten1 ${
                      showTextfield
                        ? "w-full min-w-[64px] max-w-full flex-1"
                        : "w-0"
                    } ${isTextArea ? "resize-none" : ""} ${
                      dense
                        ? "placeholder:text-body2"
                        : "placeholder:text-body1"
                    } ${inputClassName}`}
                    style={{
                      color: coloring.textColor,
                      minHeight:
                        isTextArea && minHeight ? `${minHeight}px` : undefined,
                      maxHeight:
                        isTextArea && maxHeight ? `${maxHeight}px` : undefined,
                      font: "inherit",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>
              <div
                className="flex shrink-0 items-center"
                style={{
                  columnGap: `${spacing}px`,
                }}
              >
                {isSelect && (
                  <Icon
                    icon="mdi:chevron-down"
                    className={`transition-transform duration-100 ease-linear ${
                      !isSelectActive ? "rotate-0" : "rotate-180"
                    }`}
                    size="sm"
                    color={coloring.iconColor}
                  />
                )}
                {showClearBtn && (
                  <Button
                    variant="text"
                    className="!p-0"
                    onClick={clearHandler}
                  >
                    <Icon
                      icon="mdi:close"
                      size="sm"
                      color={coloring.iconColor}
                    />
                  </Button>
                )}
                {hasEndInner && (
                  <div className="flex shrink-0">
                    {endInnerIcon && (
                      <Icon
                        icon={endInnerIcon}
                        size="sm"
                        color={coloring.iconColor}
                      />
                    )}
                    {endInnerJsx &&
                      endInnerJsx({ isFocus, isActive, hasError })}
                  </div>
                )}
              </div>
            </div>
            {loading && (
              <ProgressLinear
                color={coloring.loaderColor}
                height={3}
                indeterminate
              />
            )}
            <FormHint
              hideDetails={hideDetails}
              hint={hint}
              error={error}
              errorColor={errorColor}
            />
          </div>
          {hasEndOuter && (
            <div className="flex shrink-0">
              {endOuterIcon && (
                <Icon
                  icon={endOuterIcon}
                  size="sm"
                  color={coloring.iconColor}
                />
              )}
              {endOuterJsx && endOuterJsx({ isFocus, isActive, hasError })}
            </div>
          )}
        </div>
      </div>
      {isSelect && (
        <Menu
          ref={menuRef}
          activatorRef={containerRef}
          open={isSelectActive}
          setOpen={(newVal) => setIsSelectActive(newVal)}
          fullWidth
          maxHeight={260}
          position={menuPosition}
          offsetY={as === "select" ? 0 : 2}
          closeOnOutsideClick
          closeOnContentClick={false}
          className="!rounded-sm !p-0 !shadow"
          {...menuProps}
        >
          <SelectMenu
            value={value}
            itemClick={selectChangeHandler}
            activeItemIndex={activeItemIndex}
            items={filteredItems}
            itemJsx={itemJsx}
            multiple={multiple}
            noDataText={translations.noDataText}
            color={color}
            itemClassName={itemClassName}
            className={menuClassName}
          ></SelectMenu>
        </Menu>
      )}
    </div>
  );
}
