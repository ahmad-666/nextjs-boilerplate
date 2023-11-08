import { useCallback, useMemo } from "react";
import useColorParser from "../../hooks/useColorParser";

export type SwitchProps = {
  value: boolean;
  setValue?: (val: boolean) => void;
  type?: "inline" | "outline";
  color?: string;
  disableColor?: string;
  changeColor?: boolean;
  size?: "sm" | "md" | "lg";
  direction?: "horizontal" | "vertical";
  label?: string;
  labelJsx?: (val: boolean) => React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export default function Switch({
  value,
  setValue,
  type = "inline",
  color = "primary",
  disableColor = "slate-300",
  changeColor = true, //if true when value is false we have grey color and if value is true we have specified color ... if false when we change value color will remain same
  size = "md",
  direction = "horizontal",
  label,
  labelJsx,
  disabled = false,
  className = "",
}: SwitchProps) {
  const parsedColor = useColorParser(color);
  const parsedDisableColor = useColorParser(disableColor);
  const colors = useMemo(() => {
    let thumbColor = "";
    let trackColor = "";
    if (!changeColor || (changeColor && value)) {
      thumbColor = parsedColor;
      trackColor = `${parsedColor}77`;
    } else {
      thumbColor = parsedDisableColor;
      trackColor = `${parsedDisableColor}77`;
    }
    return {
      thumbColor,
      trackColor,
    };
  }, [parsedColor, parsedDisableColor, changeColor, value]);
  const sizes = useMemo(() => {
    let trackWidth = 0;
    let trackHeight = 0;
    if (size === "sm") {
      trackWidth = direction === "horizontal" ? 40 : 15;
      trackHeight = direction === "horizontal" ? 15 : 40;
    } else if (size === "md") {
      trackWidth = direction === "horizontal" ? 50 : 20;
      trackHeight = direction === "horizontal" ? 20 : 50;
    } else if (size === "lg") {
      trackWidth = direction === "horizontal" ? 60 : 25;
      trackHeight = direction === "horizontal" ? 25 : 60;
    }
    return {
      trackWidth,
      trackHeight,
      thumbSize: direction === "horizontal" ? trackHeight : trackWidth,
    };
  }, [size, direction]);
  const thumbPos = useMemo(() => {
    let top;
    let insetInlineStart;
    if (direction === "horizontal") {
      if (!value) insetInlineStart = "0%";
      else insetInlineStart = `calc(100% - ${sizes.thumbSize}px)`;
    } else {
      if (!value) top = "0%";
      else top = `calc(100% - ${sizes.thumbSize}px)`;
    }
    return {
      insetInlineStart,
      top,
    };
  }, [direction, value, sizes.thumbSize]);
  const toggleValue = useCallback(() => {
    if (setValue) setValue(!value);
  }, [setValue, value]);
  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`${
          disabled ? "pointer-events-none" : "cursor-pointer"
        } flex items-center`}
        onClick={toggleValue}
      >
        <div
          className="relative rounded"
          style={{
            width: `${sizes.trackWidth}px`,
            height: `${sizes.trackHeight}px`,
            backgroundColor: colors.trackColor,
          }}
        >
          <div
            className={`absolute rounded-circle transition-all duration-300 ease-in-out ${
              type === "inline" ? "scale-75" : "scale-125"
            } ${
              direction === "horizontal"
                ? "top-1/2 -translate-y-1/2"
                : "left-1/2 -translate-x-1/2"
            }`}
            style={{
              width: `${sizes.thumbSize}px`,
              height: `${sizes.thumbSize}px`,
              backgroundColor: colors.thumbColor,
              ...thumbPos,
            }}
          ></div>
        </div>
        <div className="ms-4 text-text-main">
          {labelJsx ? labelJsx(value) : label}
        </div>
      </div>
    </div>
  );
}
