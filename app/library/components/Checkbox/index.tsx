import { useCallback, useMemo, useId } from "react";
import FormHint from "../FormField/FormHint";
import Icon from "../Icon";
import useColorParser from "../../hooks/useColorParser";

export type SingleCheckbox = {
  multiple: false;
  checkboxValue?: never;
  value: boolean;
  setValue?: (val: boolean) => void;
};
export type MultipleCheckbox = {
  multiple: true;
  checkboxValue: any;
  value: any[];
  setValue?: (val: any[]) => void;
};
export type NormalProps = {
  name?: string;
  id?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode; //as label
  hideDetails?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readonly?: boolean;
  className?: string;
};
export type CheckboxProps =
  | (SingleCheckbox & NormalProps)
  | (MultipleCheckbox & NormalProps);

export default function Checkbox({
  name,
  id,
  multiple,
  checkboxValue, //specific value of current checkbox , don't set if value is bool
  value, //model of checkbox , bool or any[]
  setValue,
  color = "primary",
  size = "md",
  children,
  hideDetails = false,
  error = "",
  hint = "",
  disabled = false,
  readonly = false,
  className = "",
}: CheckboxProps) {
  const generatedId = useId();
  const parsedColor = useColorParser(color);
  const inputId = useMemo(() => {
    return id || generatedId;
  }, [id, generatedId]);
  const isSelected = useMemo(() => {
    if (!multiple) return value;
    else return value.includes(checkboxValue);
  }, [multiple, value, checkboxValue]);
  const checkboxColor = useMemo(() => {
    if (!isSelected) return "transparent";
    else if (!disabled) return parsedColor;
    return `${parsedColor}99`;
  }, [parsedColor, disabled, isSelected]);
  const checkboxSize = useMemo(() => {
    let dimension = 0;
    if (size === "sm") dimension = 15;
    else if (size === "md") dimension = 22;
    else if (size === "lg") dimension = 28;
    return dimension;
  }, [size]);
  const toggleCheckbox = useCallback(() => {
    if (setValue) {
      if (!multiple) setValue(!value);
      else {
        if (isSelected)
          return setValue(value.filter((v) => v !== checkboxValue));
        else return setValue([...value, checkboxValue]);
      }
    }
  }, [multiple, setValue, checkboxValue, isSelected, value]);
  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`flex items-center ${
          readonly || disabled ? "pointer-events-none" : "cursor-pointer"
        }`}
      >
        <div
          className="relative"
          style={{
            width: `${checkboxSize}px`,
            height: `${checkboxSize}px`,
          }}
        >
          <input
            className="absolute start-0 top-0 z-1 h-full w-full cursor-[inherit] appearance-none opacity-0"
            id={inputId}
            type="checkbox"
            name={name}
            value={checkboxValue}
            readOnly={readonly}
            disabled={disabled}
            onChange={toggleCheckbox}
          />
          <div
            className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-xs border-border-main transition-colors duration-200 ease-linear ${
              !isSelected ? "border border-solid" : "border-none"
            }`}
            style={{
              backgroundColor: checkboxColor,
            }}
          >
            <Icon
              icon="mdi-check"
              color="white"
              size={size}
              className={`transition-opacity duration-200 ease-linear ${
                isSelected ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>
        {children && (
          <label
            className="cursor-[inherit] ps-2"
            htmlFor={inputId}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {children}
          </label>
        )}
      </div>
      <FormHint hideDetails={hideDetails} error={error} hint={hint} />
    </div>
  );
}
