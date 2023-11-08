import { MenuProps as MenuComponentProps } from "../Menu";

export type As =
  | "textfield"
  | "textarea"
  | "select"
  | "autocomplete"
  | "combobox";
export type Type = "text" | "number" | "email" | "tel" | "date";
export type Variant = "outlined" | "filled";
export type LabelPos = "inside" | "outside";
export type ItemValue = number | string;
export type Element = HTMLInputElement | HTMLTextAreaElement;
export type Value = any;
export type SetValue = (newVal: Value) => void;
export type Item = {
  value: ItemValue;
  text: string;
  disabled?: boolean;
  [key: string]: any;
};
export type JsxArg = { isFocus: boolean; isActive: boolean; hasError: boolean };
export type MenuProps = Pick<MenuComponentProps,"className" | "zIndex">
export type Basic = {
  value: Value;
  setValue?: SetValue;
  variant?: Variant;
  label?: string;
  asterisk?: boolean;
  labelPos?: LabelPos;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  loading?: boolean;
  clearable?: boolean;
  dense?: boolean;
  id?: string;
  name?: string;
  color?: string;
  textColor?: string;
  bgColor?: string;
  labelColor?: string;
  borderColor?: string;
  iconColor?: string;
  errorColor?: string;
  hideDetails?: boolean;
  error?: string;
  hint?: string;
  autoFocus?: boolean;
  startOuterIcon?: string;
  startInnerIcon?: string;
  endOuterIcon?: string;
  endInnerIcon?: string;
  startOuterJsx?: (arg: JsxArg) => React.ReactNode;
  startInnerJsx?: (arg: JsxArg) => React.ReactNode;
  endOuterJsx?: (arg: JsxArg) => React.ReactNode;
  endInnerJsx?: (arg: JsxArg) => React.ReactNode;
  onInput?: (e: React.FormEvent<Element>) => void;
  onChange?: (newVal: Value) => void;
  onKeyDown?: (e: React.KeyboardEvent<Element>) => void;
  onKeyUp?: (e: React.KeyboardEvent<Element>) => void;
  onFocus?: (inputRef: React.MutableRefObject<Element>) => void;
  onBlur?: (inputRef: React.MutableRefObject<Element>) => void;
  onClear?: (newVal: Value) => void;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  className?: string;
};
export type Menu = {
  multiple?: boolean;
  items: Item[];
  noDataText?: string;
  inputSearch?: string;
  setInputSearch?: (newSearch: string) => void;
  searchFn?: (query: string, item: Item) => boolean;
  itemJsx?: (item: Item) => React.ReactNode;
  valueJsx?: (selectedItem: Item) => React.ReactNode;
};
export type SelectMenuProps = Omit<
  Menu,
  "inputSearch" | "setInputSearch" | "searchFn" | "valueJsx"
> &
  Pick<Basic, "value" | "color" | "itemClassName" | "className"> & {
    itemClick?: SetValue;
    setIsSelectActive?: (newVal: boolean) => void;
    activeItemIndex?: number;
  };
export type SelectItemProps = Pick<
  SelectMenuProps,
  "itemClick" | "setIsSelectActive" | "color" | "className"
> & {
  itemValue?: Value;
  isSelected?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};
export type FormLabelProps = Pick<
  Basic,
  "labelPos" | "asterisk" | "id" | "color" | "className"
> & {
  as: As;
  children: React.ReactNode;
  isActive?: boolean;
};
export type TextField = {
  //included props
  type?: Type;
  //excluded props
  minHeight?: never;
  maxHeight?: never;
  autoGrow?: never;
  multiple?: never;
  items?: never;
  noDataText?: never;
  inputSearch?: never;
  setInputSearch?: never;
  searchFn?: never;
  itemJsx?: never;
  valueJsx?: never;
  menuProps?: never;
};
export type TextArea = {
  //included props
  minHeight?: number;
  maxHeight?: number;
  autoGrow?: boolean;
  //excluded props
  type?: never;
  multiple?: never;
  items?: never;
  noDataText?: never;
  inputSearch?: never;
  setInputSearch?: never;
  searchFn?: never;
  itemJsx?: never;
  valueJsx?: never;
  menuProps?: never;
};
export type Select = {
  //excluded props
  type?: never;
  minHeight?: never;
  maxHeight?: never;
  autoGrow?: never;
  menuProps?: MenuProps;
} & Menu;
export type TextFieldProps = Basic & TextField;
export type TextAreaProps = Basic & TextArea;
export type SelectProps = Basic & Select;
export type AutoCompleteProps = Basic & Select;
export type ComboBoxProps = Basic & Select;
export type FormFieldProps = {
  as: As;
} & (
  | TextFieldProps
  | TextAreaProps
  | SelectProps
  | AutoCompleteProps
  | ComboBoxProps
);
