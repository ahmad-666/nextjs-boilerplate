import { useState, useCallback, useEffect } from "react";
import useColorParser from "../../hooks/useColorParser";
import type { TimeInputProps } from "./types";

const ACCEPTED_KEYS = ["ArrowLeft", "ArrowRight", "Tab", "Delete", "Backspace"];
export default function TimeInput({
  value, //something like 01,15,45,... must be string because we convert 9 to '09' and ...
  setValue,
  defaultMax,
  min,
  max,
  color = "primary",
  size = 50,
  disabled = false,
  className = "",
}: TimeInputProps) {
  const [inputVal, setInputVal] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const parsedColor = useColorParser(color);
  const keydownHandler = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;
      const isAccepted = ACCEPTED_KEYS.includes(key);
      const isNumber = /^[\d]+$/.test(key);
      if (!isAccepted && !isNumber) return e.preventDefault();
      return null;
    },
    []
  );
  const focusHandler = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocus(true);
    e.target.select();
  }, []);
  const blurHandler = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocus(false);
      const enteredVal = +e.target.value;
      let normalizeVal: number = enteredVal;
      let finalizeVal: string;
      if (max && enteredVal > max) normalizeVal = max;
      else if (min && enteredVal < min) normalizeVal = min;
      finalizeVal = normalizeVal < 10 ? `0${normalizeVal}` : `${normalizeVal}`;
      setInputVal(finalizeVal);
      setValue(finalizeVal);
    },
    [min, max, setValue]
  );
  const changeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const enteredVal = +e.target.value;
      let normalizeVal: number = enteredVal;
      if (defaultMax && enteredVal >= defaultMax) normalizeVal = defaultMax - 1;
      setInputVal(`${normalizeVal}`);
    },
    [defaultMax]
  );
  useEffect(() => {
    setInputVal(value);
  }, [value]);
  return (
    <div className={`${className}`}>
      <input
        type="text"
        value={inputVal}
        onKeyDown={keydownHandler}
        onFocus={focusHandler}
        onBlur={blurHandler}
        onChange={changeHandler}
        className={`rounded-sm border border-solid bg-transparent text-center text-body1 font-bold text-text-main outline-none focus:border-2 ${
          disabled ? "opacity-40" : ""
        }`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderColor: isFocus ? parsedColor : "#ccc",
        }}
        disabled={disabled}
      />
    </div>
  );
}
