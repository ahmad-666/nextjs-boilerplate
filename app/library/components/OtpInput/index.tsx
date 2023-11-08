import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import FormHint from "../FormField/FormHint";
import useColorParser from "../../hooks/useColorParser";

export type OtpInputProps = {
  length?: number;
  value: string;
  setValue: (val: string) => void;
  type?: "text" | "number";
  size?: "sm" | "md" | "lg";
  color?: string;
  hint?: string;
  error?: string;
  hideDetails?: boolean;
  className?: string;
};

export default function OtpInput({
  length = 5,
  value,
  setValue,
  type = "text",
  size = "md",
  color = "primary",
  hint = "",
  error = "",
  hideDetails = false,
  className = "",
}: OtpInputProps) {
  const inputs = useRef<HTMLInputElement[]>([]);
  const parsedColor = useColorParser(color);
  const parsedBorderColor = useColorParser("border");
  const [focusIndex, setFocusIndex] = useState(0);
  const cssClass = useMemo(() => {
    let widthHeight = "";
    if (size === "sm") {
      widthHeight = "w-[35px] h-[35px]";
    } else if (size === "md") {
      widthHeight = "w-[50px] h-[50px]";
    } else if (size === "lg") {
      widthHeight = "w-[65px] h-[65px]";
    }
    return `${widthHeight}`;
  }, [size]);
  const normalizeValue = useMemo(() => {
    return value.split("");
  }, [value]);
  const getNormalizeIndex = useCallback(
    (index: number) => {
      return Math.min(Math.max(index, 0), length - 1);
    },
    [length]
  );
  const focusNext = useCallback(() => {
    const index = getNormalizeIndex(focusIndex + 1);
    setFocusIndex(index);
  }, [focusIndex, getNormalizeIndex]);
  const focusPrev = useCallback(() => {
    const index = getNormalizeIndex(focusIndex - 1);
    setFocusIndex(index);
  }, [focusIndex, getNormalizeIndex]);
  const changeValueAtFocus = useCallback(
    (newCharacter: string) => {
      const oldArr = [...normalizeValue];
      oldArr[focusIndex] = newCharacter;
      const newVal = oldArr.join("");
      setValue(newVal);
    },
    [focusIndex, setValue, normalizeValue]
  );
  const onFocusHandler = useCallback((index: number) => {
    setFocusIndex(index);
  }, []);
  const onBlurHandler = useCallback(() => {
    setFocusIndex(-1);
  }, []);
  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val) {
        const newCharacter = val[0] || "";
        changeValueAtFocus(newCharacter);
        focusNext();
      }
    },
    [changeValueAtFocus, focusNext]
  );
  const onKeydownHandler = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const key = e.key;
      if (key === "Delete" || key === "Backspace") {
        e.preventDefault();
        if (value[focusIndex]) changeValueAtFocus("");
        else focusPrev();
      } else if (key === "ArrowLeft") {
        e.preventDefault();
        focusPrev();
      } else if (key === "ArrowRight") {
        e.preventDefault();
        focusNext();
      }
    },
    [focusPrev, focusNext, changeValueAtFocus, focusIndex, value]
  );
  const onPasteHandler = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
      if (pastedData) setValue(pastedData);
    },
    [length, setValue]
  );
  useEffect(() => {
    const elm = inputs.current[focusIndex];
    if (elm) {
      elm.focus();
      elm.select();
    }
  }, [focusIndex]);
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-center gap-x-4">
        {[...new Array(length)].map((input, i) => {
          return (
            <div
              key={i}
              className={`overflow-hidden rounded-sm border-solid ${
                i === focusIndex ? "border-2" : "border"
              }  ${cssClass}`}
              style={{
                borderColor: focusIndex === i ? parsedColor : parsedBorderColor,
              }}
            >
              <input
                ref={(input: HTMLInputElement) => (inputs.current[i] = input)}
                className={`h-full w-full border-none bg-card-main text-center text-subtitle1 text-text-main outline-none`}
                type={type}
                value={normalizeValue[i] || ""}
                onFocus={() => onFocusHandler(i)}
                onBlur={onBlurHandler}
                onChange={onChangeHandler}
                onKeyDown={onKeydownHandler}
                onPaste={onPasteHandler}
              />
            </div>
          );
        })}
      </div>
      <FormHint hint={hint} error={error} hideDetails={hideDetails} />
    </div>
  );
}
