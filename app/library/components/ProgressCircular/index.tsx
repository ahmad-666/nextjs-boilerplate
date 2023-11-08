import { useMemo } from "react";
import useColorParser from "../../hooks/useColorParser";
import "./styles.scss";

export type ProgressCircularProps = {
  value?: number;
  size?: number;
  color?: string;
  width?: number;
  rotate?: number;
  indeterminate?: boolean;
  children?: React.ReactNode;
  className?: string;
};
//we can always use & React.ComponentProps<"div"> and '...rest' and use <div {...rest}>
//with stroke-dasharray:1 we say border of svg shape should consist of multiple dashes with 1px width(so many dashes)
//with 2*PI*r we say stroke of svg circle should consist of 1 dash
//stroke-dashoffset specify starting position of drawing dashes on stroke of svg shape
export default function ProgressCircular({
  value = 0, //[0,100]
  size = 40,
  color = "primary",
  width = 2,
  rotate = -90,
  indeterminate = false,
  children,
  className = "",
}: ProgressCircularProps) {
  const parsedColor = useColorParser(color);
  const radius = useMemo(() => {
    return size / 2;
  }, [size]);
  const strokeDashArray = useMemo(() => {
    return 2 * Math.PI * radius;
  }, [radius]);
  const strokeDashOffset = useMemo(() => {
    return strokeDashArray * ((100 - value) / 100);
  }, [strokeDashArray, value]);
  return (
    <div className={`${className}`}>
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${size + width} ${size + width}`}
          className={`absolute h-full w-full ${
            indeterminate ? "animate-circular-progress-rotate" : ""
          }`}
          style={{
            transform: !indeterminate ? `rotate(${rotate}deg)` : undefined,
          }}
        >
          <circle
            className={`absolute start-0 top-0 z-1 opacity-30`}
            cx="50%"
            cy="50%"
            r={radius}
            stroke={parsedColor}
            fill="transparent"
            strokeWidth={width}
          ></circle>
          <circle
            className={`absolute start-0 top-0 z-2 ${
              indeterminate ? "animate-circular-progress-offset" : ""
            }`}
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            strokeWidth={width}
            stroke={parsedColor}
            strokeDasharray={strokeDashArray}
            strokeDashoffset={strokeDashOffset}
          ></circle>
        </svg>
        {children}
      </div>
    </div>
  );
}
