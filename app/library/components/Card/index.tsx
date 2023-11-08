import { useMemo, useRef } from "react";
import Link from "next/link";
import Ripple from "../Ripple";
import ProgressLinear from "../ProgressLinear";
import useColorParser from "../../hooks/useColorParser";

export type CardProps = {
  color?: string;
  rippleColor?: string;
  loadingColor?: string;
  density?: "none" | "sm" | "md" | "lg";
  elevation?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xl2";
  rounded?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xl2";
  flat?: boolean;
  loading?: boolean;
  ripple?: boolean;
  disabled?: boolean;
  href?: string;
  replace?: boolean;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  children: React.ReactNode;
  className?: string;
};

export default function Card({
  color = "card",
  loadingColor = "primary",
  rippleColor = "card-darken2",
  density = "none", //add padding for whole card
  elevation = "md", //add box-shadow
  rounded = "sm", //add border-radius
  flat = false, //remove any box-shadow
  disabled = false,
  loading = false,
  ripple = false,
  href = "",
  replace = false,
  width,
  minWidth = 0,
  maxWidth,
  height = "auto",
  minHeight = 0,
  maxHeight,
  children,
  className = "",
}: CardProps) {
  const cardContainer = useRef(null!);
  const parsedColor = useColorParser(color);
  const isLink = useMemo(() => {
    return href;
  }, [href]);
  const Component = useMemo(() => {
    if (isLink) return Link;
    return "div";
  }, [isLink]);
  const cssClass = useMemo(() => {
    let padding = "";
    let borderRadius = "";
    let boxShadow = "";
    //padding---------------------
    if (density === "none") padding = "p-0";
    else if (density === "sm") padding = "p-2";
    else if (density === "md") padding = "p-4";
    else if (density === "lg") padding = "p-6";
    //borderRadius----------------
    if (rounded === "none") borderRadius = "rounded-none";
    else if (rounded === "xs") borderRadius = "rounded-xs";
    else if (rounded === "sm") borderRadius = "rounded-sm";
    else if (rounded === "md") borderRadius = "rounded";
    else if (rounded === "lg") borderRadius = "rounded-lg";
    else if (rounded === "xl") borderRadius = "rounded-xl";
    else if (rounded === "xl2") borderRadius = "rounded-xl2";
    //boxShadow-------------------
    if (flat || elevation === "none") boxShadow = "shadow-none";
    else if (elevation === "xs") boxShadow = "shadow-xs";
    else if (elevation === "sm") boxShadow = "shadow-sm";
    else if (elevation === "md") boxShadow = "shadow";
    else if (elevation === "lg") boxShadow = "shadow-lg";
    else if (elevation === "xl") boxShadow = "shadow-xl";
    else if (elevation === "xl2") boxShadow = "shadow-xl2";
    //result----------------------
    return `${padding} ${borderRadius} ${boxShadow}`;
  }, [density, rounded, elevation, flat]);
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
    <Component
      ref={cardContainer}
      className={`relative overflow-hidden ${
        disabled ? "pointer-events-none opacity-40" : ""
      } ${cssClass} ${className}`}
      style={{ backgroundColor: parsedColor, ...sizing }}
      href={href}
      replace={isLink ? replace : undefined}
    >
      {loading && (
        <ProgressLinear
          color={loadingColor}
          indeterminate
          height={4}
          className="absolute start-0 top-0 w-full"
        />
      )}
      <div>{children}</div>
      {ripple && <Ripple color={rippleColor} refElm={cardContainer} />}
    </Component>
  );
}
