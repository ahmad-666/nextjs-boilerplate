import { useMemo, useRef } from "react";
import Link from "next/link";
import ProgressCircular from "../ProgressCircular";
import Ripple from "../Ripple";
import useColorParser from "../../hooks/useColorParser";
import useHover from "../../hooks/useHover";

export type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  color?: string;
  disabled?: boolean;
  variant?: "filled" | "outlined" | "text";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  flat?: boolean;
  rounded?: boolean;
  loading?: boolean;
  ripple?: boolean;
  hover?: boolean;
  href?: string | { pathname: string; hash?: string; query?: any };
  replace?: boolean;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  className?: string;
  contentClass?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
};

export default function Button({
  children,
  type = "button",
  color = "primary", //bg-color for variant:primary , text color for variant:text, text/border color for variant:outlined
  disabled = false,
  variant = "filled",
  size = "md",
  flat = true,
  rounded = false,
  loading = false,
  ripple = true,
  hover = true, //if true when we hover or button we see lighten version of color
  href, //if we set this it means we have link
  replace = false,
  width,
  minWidth = 0,
  maxWidth,
  height = "auto",
  minHeight = 0,
  maxHeight,
  className = "",
  contentClass = "",
  style = {},
  onClick,
  onDoubleClick,
}: ButtonProps) {
  const btn = useRef<any>(null!);
  const isHover = useHover(btn);
  const parsedColor = useColorParser(color);
  const isLink = useMemo(() => {
    return href;
  }, [href]);
  const Component = useMemo(() => {
    if (isLink) return Link;
    return "button";
  }, [isLink]);
  const cssClass = useMemo(() => {
    let padding = "";
    let fontSize = "";
    let boxShadow = "";
    let borderRadius = "";
    //font-size,padding
    if (size === "xs") {
      padding = "py-1 px-1.5";
      fontSize = "text-body2";
    } else if (size === "sm") {
      padding = "py-2 px-2.5";
      fontSize = "text-button";
    } else if (size === "md") {
      padding = "py-2.5 px-4";
      fontSize = "text-button";
    } else if (size === "lg") {
      padding = "py-3.5 px-5";
      fontSize = "text-button";
    } else if (size === "xl") {
      padding = "py-4 px-6";
      fontSize = "text-body1";
    }
    //borderRadius
    if (!rounded) borderRadius = "rounded-sm";
    else borderRadius = "rounded";
    //box-shadow
    if (flat) boxShadow = "shadow-none";
    else boxShadow = "shadow";
    return `${padding} ${fontSize} ${borderRadius} ${boxShadow}`;
  }, [flat, rounded, size]);
  const sizes = useMemo(() => {
    return {
      width: typeof width === "number" ? `${width}px` : width,
      minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth,
      maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
      height: typeof height === "number" ? `${height}px` : height,
      minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
      maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
    };
  }, [width, minWidth, maxWidth, height, minHeight, maxHeight]);
  const colors = useMemo(() => {
    let backgroundColor = "";
    let color = "";
    let border = "";
    if (variant === "filled") {
      backgroundColor = hover && isHover ? `${parsedColor}cc` : parsedColor;
      color = "#fff";
      border = "none";
    } else if (variant === "outlined") {
      backgroundColor = hover && isHover ? `${parsedColor}33` : "transparent";
      color = parsedColor;
      border = `1px solid ${parsedColor}`;
    } else if (variant === "text") {
      backgroundColor = hover && isHover ? `${parsedColor}33` : "transparent";
      color = parsedColor;
      border = "none";
    }
    return {
      backgroundColor,
      color,
      border,
    };
  }, [variant, parsedColor, hover, isHover]);
  return (
    <Component
      type={!isLink ? type : undefined}
      className={`relative inline-flex items-center justify-center overflow-hidden no-underline transition-colors duration-100 ease-linear ${cssClass} ${
        disabled ? "opacity-40" : ""
      } ${
        loading || disabled ? "pointer-events-none" : "cursor-pointer"
      } ${className}`}
      style={{
        ...sizes,
        ...colors,
        ...style,
      }}
      disabled={disabled}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      href={href!}
      replace={isLink ? replace : undefined}
      ref={btn}
    >
      <span className={`flex items-center justify-center ${contentClass}`}>
        {!loading ? (
          children
        ) : (
          <ProgressCircular
            indeterminate
            size={20}
            width={2}
            color={variant === "filled" ? "white" : color}
          />
        )}
      </span>
      {ripple && <Ripple refElm={btn} />}
    </Component>
  );
}
