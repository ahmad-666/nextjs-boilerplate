import { useMemo } from "react";
import useColorParser from "../../hooks/useColorParser";

export type Horizontal = "left" | "right";
export type Vertical = "top" | "bottom";
export type BadgeProps = {
  children?: React.ReactNode;
  size?: number;
  color?: string;
  zIndex?: number;
  offsetX?: number;
  offsetY?: number;
  position?: `${Horizontal}-${Vertical}`;
  animate?: boolean;
  className?: string;
};

export default function Badge({
  children,
  size = 20,
  color = "primary",
  zIndex = 1,
  offsetX = 0,
  offsetY = 0,
  position = "left-top",
  animate = false,
  className = "",
}: BadgeProps) {
  const colorParsed = useColorParser(color);
  const coords = useMemo(() => {
    const positionSplit = position.split("-");
    const horizontal = positionSplit[0];
    const vertical = positionSplit[1];
    let left = null;
    let top = null;
    let right = null;
    let bottom = null;
    if (horizontal === "left") left = 0;
    else right = 0;
    if (vertical === "top") top = 0;
    else bottom = 0;
    return {
      left: left !== null ? `calc(${left}% + ${offsetX}px)` : undefined,
      right: right !== null ? `calc(${right}% + ${offsetX}px)` : undefined,
      top: top !== null ? `calc(${top}% + ${offsetY}px)` : undefined,
      bottom: bottom !== null ? `calc(${bottom}% + ${offsetY}px)` : undefined,
    };
  }, [offsetX, offsetY, position]);
  return (
    <span
      className={`absolute rounded-circle ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: colorParsed,
        zIndex,
        ...coords,
      }}
    >
      <span className="flex h-full w-full items-center justify-center overflow-hidden">
        {children}
      </span>
      {animate && (
        <span
          className="pointer-events-none absolute start-0 top-0 h-full w-full animate-ping rounded-circle border border-solid"
          style={{ borderColor: colorParsed }}
        ></span>
      )}
    </span>
  );
}
