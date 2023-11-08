import { useMemo } from "react";
import useColorParser from "../../hooks/useColorParser";

export type SkeletonProps = {
  color?: string;
  rounded?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "circle";
  elevation?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  className?: string;
};

export default function Skeleton({
  color = "card",
  rounded = "md",
  elevation = "none",
  animate = true,
  width = "100%",
  minWidth = 0,
  maxWidth,
  height = 150,
  minHeight = 0,
  maxHeight,
  className = "",
}: SkeletonProps) {
  const parsedColor = useColorParser(color);
  const cssClass = useMemo(() => {
    let shadow = "";
    let borderRadius = "";
    //box-shadow ---------------------
    if (elevation === "none") shadow = "shadow-none";
    else if (elevation === "xs") shadow = "shadow-xs";
    else if (elevation === "sm") shadow = "shadow-sm";
    else if (elevation === "md") shadow = "shadow";
    else if (elevation === "lg") shadow = "shadow-lg";
    else if (elevation === "xl") shadow = "shadow-xl";
    //border-radius ---------------------
    if (rounded === "none") borderRadius = "rounded-none";
    else if (rounded === "xs") borderRadius = "rounded-xs";
    else if (rounded === "sm") borderRadius = "rounded-sm";
    else if (rounded === "md") borderRadius = "rounded";
    else if (rounded === "lg") borderRadius = "rounded-lg";
    else if (rounded === "xl") borderRadius = "rounded-xl";
    else if (rounded === "circle") borderRadius = "rounded-circle";
    //result ---------------------
    return `${shadow} ${borderRadius}`;
  }, [elevation, rounded]);
  const sizing = useMemo(() => {
    return {
      width: typeof width === "number" ? `${width}px` : width,
      minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth,
      maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
      height: typeof height === "number" ? `${height}px` : height,
      minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
      maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
    };
  }, [width, minWidth, maxWidth, height, minHeight, maxHeight]);
  return (
    <div
      className={`overflow-hidden ${
        animate ? "animate-pulse" : ""
      } ${cssClass} ${className}`}
      style={{
        backgroundColor: parsedColor,
        ...sizing,
      }}
    ></div>
  );
}
