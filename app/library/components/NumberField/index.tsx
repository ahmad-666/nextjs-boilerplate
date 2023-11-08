//if we want persian number to alphabet we can use --> https://github.com/mahmoud-eskandari/NumToPersian

import { useState, useEffect, useMemo, useCallback } from "react";
import TextField from "../TextField";
import Button from "../Button";
import Icon from "../Icon";
import type { Element, TextFieldProps } from "../FormField/types";

export type Value = null | string | number;
export type Type = "number" | "string";
export type NumberFieldProps = Omit<
  TextFieldProps,
  "value" | "setValue" | "type" | "endInnerJsx" | "onKeyDown" | "onClear"
> & {
  value: Value;
  setValue?: (newVal: Value) => void;
  type?: Type;
  separate?: boolean;
  showArrow?: boolean;
  onlyArrowInteraction?: boolean;
  jumpVal?: number;
  min?: number;
  max?: number;
};

const ACCEPTED_KEYS = [
  "ArrowLeft",
  "ArrowRight",
  "Enter",
  "Space",
  "Backspace",
  "Tab",
  "Control", //for ctrl+a
  "a", //for ctrl+a
];

export default function NumberField({
  value, //for empty value we can use null or "" ... 0 is valid filled value
  setValue,
  type = "number", //for price,age use 'number' and for mobile,tel use 'string'
  separate = true,
  showArrow = false,
  onlyArrowInteraction = false,
  jumpVal = 1,
  min,
  max,
  color = "primary",
  className = "",
  ...rest
}: NumberFieldProps) {
  const [valueStr, setValueStr] = useState("");
  const normalizeValue = useMemo(() => {
    //if value is null or "" we treat it like it is 0
    return value === "" || value === null ? 0 : +value;
  }, [value]);
  const isReachMin = useCallback(
    (val: number) => {
      return !!(typeof min === "number" && val < min);
    },
    [min]
  );
  const isReachMax = useCallback(
    (val: number) => {
      return !!(typeof max === "number" && val > max!);
    },
    [max]
  );
  const onKeyDown = useCallback((e: React.KeyboardEvent<Element>) => {
    //for prevent any unwanted key press
    const { key } = e;
    const isAcceptedKey = ACCEPTED_KEYS.includes(key);
    const isNumber = /^[\d\s]+$/gim.test(key); //any number or whitespace
    if (isAcceptedKey || isNumber) return null; //normal flow
    return e.preventDefault(); //stop for entering key
  }, []);
  const updateValue = useCallback(
    (newVal: number | string) => {
      if (setValue) {
        const formattedValue = `${newVal}`.replace(/[^\d-]+/gim, ""); //add '-' for negative values
        const numberValue = +formattedValue;
        if (formattedValue === "" || isNaN(numberValue)) setValue("");
        else {
          if (!isReachMin(numberValue) && !isReachMax(numberValue))
            setValue(type === "number" ? numberValue : formattedValue);
        }
      }
    },
    [type, isReachMin, isReachMax, setValue]
  );
  const onClear = useCallback(() => {
    updateValue("");
  }, [updateValue]);
  const increaseValue = useCallback(() => {
    updateValue(normalizeValue + jumpVal);
  }, [normalizeValue, jumpVal, updateValue]);
  const decreaseValue = useCallback(() => {
    updateValue(normalizeValue - jumpVal);
  }, [normalizeValue, jumpVal, updateValue]);
  useEffect(() => {
    let newValue = "";
    if (separate) {
      newValue =
        typeof value === "number" ? new Intl.NumberFormat().format(value) : "";
    } else {
      newValue =
        typeof value === "number" || typeof value === "string"
          ? `${value}`
          : "";
    }
    setValueStr(newValue);
  }, [value, separate]);
  return (
    <div className={`${className}`}>
      <TextField
        value={valueStr}
        setValue={updateValue}
        type="text"
        color={color}
        onKeyDown={onKeyDown}
        onClear={onClear}
        containerClassName="h-[58px]"
        inputClassName="dir-ltr"
        readonly={onlyArrowInteraction}
        endInnerJsx={
          showArrow
            ? () => {
                return (
                  <div className="flex flex-col">
                    <Button
                      onClick={increaseValue}
                      variant="text"
                      color={color}
                      className="!p-0"
                    >
                      <Icon icon="mdi:chevron-up" size="sm" color={color} />
                    </Button>
                    <Button
                      onClick={decreaseValue}
                      variant="text"
                      color={color}
                      className="!p-0"
                    >
                      <Icon icon="mdi:chevron-down" size="sm" color={color} />
                    </Button>
                  </div>
                );
              }
            : undefined
        }
        {...rest}
      />
    </div>
  );
}
