import { useMemo, useCallback, useId } from "react";
import FormHint from "../FormField/FormHint";
import Icon from "../Icon";
import useColorParser from "../../hooks/useColorParser";

export type RadioProps = {
  radioValue: number | string;
  value: null | number | string;
  setValue?: (val: null | number | string) => void;
  name: string;
  id?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode; //as label
  hideDetails?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readonly?: boolean;
  className?: string;
};

export default function Radio({
  name,
  id,
  radioValue, //specific value of current radio
  value, //model of radio
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
}: RadioProps) {
  const generatedId = useId();
  const parsedColor = useColorParser(color);
  const inputId = useMemo(() => {
    return id || generatedId;
  }, [id, generatedId]);
  const isSelected = useMemo(() => {
    return radioValue === value;
  }, [radioValue, value]);
  const radioColor = useMemo(() => {
    if (!isSelected) return "transparent";
    else if (!disabled) return parsedColor;
    return `${parsedColor}99`;
  }, [parsedColor, disabled, isSelected]);
  const radioSize = useMemo(() => {
    let dimension = 0;
    if (size === "sm") dimension = 15;
    else if (size === "md") dimension = 22;
    else if (size === "lg") dimension = 28;
    return dimension;
  }, [size]);
  const radioChangeHandler = useCallback(() => {
    if (setValue && !isSelected) {
      setValue(radioValue);
    }
  }, [setValue, isSelected, radioValue]);
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
            width: `${radioSize}px`,
            height: `${radioSize}px`,
          }}
        >
          <input
            className="absolute start-0 top-0 z-1 h-full w-full cursor-[inherit] appearance-none opacity-0"
            id={inputId}
            type="radio"
            name={name}
            value={radioValue}
            readOnly={readonly}
            disabled={disabled}
            onChange={radioChangeHandler}
          />
          <div
            className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-circle border-border-main transition-colors duration-200 ease-linear ${
              !isSelected ? "border border-solid" : "border-none"
            }`}
            style={{
              backgroundColor: radioColor,
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
        <label className="cursor-[inherit] ps-2" htmlFor={inputId}>
          {children}
        </label>
      </div>
      <FormHint hideDetails={hideDetails} error={error} hint={hint} />
    </div>
  );
}
