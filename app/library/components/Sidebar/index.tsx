//don't use any portal because we suppose to use it inside layout
//because we don't use any 'use client' inside this component we should not directly use this component inside layout and we should create another component with 'use client' and use <Sidebar> in there

import { useEffect, useRef, useMemo, useCallback } from "react";
import Overlay from "../Overlay";
import useColorParser from "../../hooks/useColorParser";
import useHover from "../../hooks/useHover";
import useLocaleDetails from "../../hooks/useLocaleDetails";

export type SidebarProps = {
  show?: boolean;
  onChange?: (val: boolean) => void;
  width?: number | string;
  height?: number | string;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  zIndex?: number;
  color?: string;
  absolute?: boolean;
  expandOnHover?: boolean;
  miniWidth?: number | string;
  fullWidth?: boolean;
  hideBodyScrollOnOpen?: boolean;
  pushContent?: boolean;
  hasOverlay?: boolean;
  overlayColor?: string;
  overlayZIndex?: number;
  children: React.ReactNode;
  className?: string;
};

export default function Sidebar({
  show = false, //if set to false we still render it but we move it outside of viewport so user cannot see it
  onChange,
  width = 300,
  height = "100%",
  top = 0,
  bottom = 0,
  right = 0,
  left = 0,
  zIndex = 3,
  color = "card",
  absolute = false,
  expandOnHover = false,
  miniWidth = 60,
  fullWidth = false,
  hideBodyScrollOnOpen = false, //add 'overflow-hidden' class to <body> if we set 'show' prop to true
  pushContent = false, //push content of <main> to right/left if we set 'show' prop to true
  hasOverlay = false, //show overlay for those times we set 'show' prop to true
  overlayColor = "rgba(0,0,0,.75)",
  overlayZIndex = 2,
  children,
  className = "",
}: SidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null!);
  const parsedColor = useColorParser(color);
  const isHover = useHover(sidebarRef);
  const body = useRef<HTMLElement>(null!);
  const main = useRef<HTMLElement>(null!);
  const { dir: localeDir } = useLocaleDetails();
  const finalWidth = useMemo(() => {
    if (fullWidth) return "100%";
    else if (!expandOnHover) {
      if (typeof width === "number") return `${width}px`;
      return width;
    } else {
      if (isHover && typeof width === "number") return `${width}px`;
      else if (isHover && typeof width !== "number") return width;
      else if (!isHover && typeof miniWidth === "number")
        return `${miniWidth}px`;
      else if (!isHover && typeof miniWidth !== "number") return miniWidth;
    }
  }, [width, miniWidth, fullWidth, isHover, expandOnHover]);
  const sidebarStyle = useMemo(() => {
    return {
      width: finalWidth,
      height: typeof height === "number" ? `${height}px` : height,
      top: typeof top === "number" ? `${top}px` : top,
      bottom: typeof bottom === "number" ? `${bottom}px` : bottom,
      left:
        localeDir === "rtl"
          ? undefined
          : typeof left === "number"
          ? `${left}px`
          : left,
      right:
        localeDir === "ltr"
          ? undefined
          : typeof right === "number"
          ? `${right}px`
          : right,
      zIndex,
      backgroundColor: parsedColor,
    };
  }, [
    finalWidth,
    height,
    top,
    bottom,
    left,
    right,
    parsedColor,
    zIndex,
    localeDir,
  ]);
  const onOverlayOutsideClick = useCallback(() => {
    if (onChange) {
      onChange(false);
    }
  }, [onChange]);
  useEffect(() => {
    body.current = document.body!;
    main.current = document.querySelector("main")!;
    if (main.current) {
      main.current.classList.add(
        "transition-all",
        "duration-300",
        "ease-linear"
      ); //exactly same classes for transition that we apply to <aside>
    }
  }, []);
  useEffect(() => {
    if (body.current && hideBodyScrollOnOpen) {
      if (!show) body.current.classList.remove("overflow-hidden");
      else body.current.classList.add("overflow-hidden");
    }
    if (main.current && pushContent) {
      let margin: null | string = null;
      if (!show || fullWidth) margin = "0px";
      else margin = finalWidth || null;
      if (localeDir === "ltr")
        main.current.style.setProperty("margin-left", margin);
      else main.current.style.setProperty("margin-right", margin);
    }
  }, [
    show,
    finalWidth,
    fullWidth,
    localeDir,
    hideBodyScrollOnOpen,
    pushContent,
  ]);
  return (
    <>
      <aside
        ref={sidebarRef}
        className={`overflow-hidden transition-all duration-300 ease-linear ${
          absolute ? "absolute" : "fixed"
        } ${
          show
            ? "translate-x-0"
            : "ltr:translate-x-[-110%] rtl:translate-x-[110%]"
        } ${className}`}
        style={{
          ...sidebarStyle,
        }}
      >
        {children}
      </aside>
      {hasOverlay && (
        <Overlay
          show={show}
          closeOnOutsideClick
          onOutsideClick={onOverlayOutsideClick}
          color={overlayColor}
          zIndex={overlayZIndex}
        ></Overlay>
      )}
    </>
  );
}
