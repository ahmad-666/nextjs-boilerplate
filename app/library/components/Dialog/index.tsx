import { useMemo } from "react";
import Overlay from "../Overlay";

export type DialogProps = {
  show: boolean;
  setShow?: (val: boolean) => void;
  children: React.ReactNode;
  hasOverlay?: boolean;
  overlayColor?: string;
  fullscreen?: boolean;
  scrollable?: boolean;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  zIndex?: number;
  closeOnContentClick?: boolean;
  closeOnOutsideClick?: boolean;
  contentClass?: string;
  className?: string;
};
export type Size = {
  w?: number | string;
  minW?: number | string;
  maxW?: number | string;
  h?: number | string;
  minH?: number | string;
  maxH?: number | string;
};

export default function Dialog({
  show,
  setShow,
  children,
  hasOverlay = true,
  overlayColor = "rgba(0,0,0,.75)",
  fullscreen = false,
  scrollable = true,
  width = "750",
  minWidth = 0,
  maxWidth = "90%",
  height = "auto",
  minHeight = 0,
  maxHeight = "90%",
  zIndex = 6,
  closeOnContentClick = false,
  closeOnOutsideClick = true,
  contentClass = "",
  className = "",
}: DialogProps) {
  const size = useMemo(() => {
    const result: Size = {
      w: undefined,
      minW: undefined,
      maxW: undefined,
      h: undefined,
      minH: undefined,
      maxH: undefined,
    };
    if (fullscreen) {
      result.w = "100%";
      result.h = "100%";
    } else {
      result.w = typeof width === "number" ? `${width}px` : width;
      result.minW = typeof minWidth === "number" ? `${minWidth}px` : minWidth;
      result.maxW = typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
      result.h = typeof height === "number" ? `${height}px` : height;
      result.minH =
        typeof minHeight === "number" ? `${minHeight}px` : minHeight;
      result.maxH =
        typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
    }
    return result;
  }, [fullscreen, width, minWidth, maxWidth, height, minHeight, maxHeight]);
  return (
    <Overlay
      show={show}
      setShow={setShow}
      closeOnContentClick={closeOnContentClick}
      closeOnOutsideClick={closeOnOutsideClick}
      absolute={false}
      zIndex={zIndex}
      color={hasOverlay ? overlayColor : "transparent"}
      className={className}
      contentClass={`${
        scrollable ? "overflow-auto" : "overflow-hidden"
      } ${contentClass}`}
      contentStyle={{
        width: size.w,
        minWidth: size.minW,
        maxWidth: size.maxW,
        height: size.h,
        minHeight: size.minH,
        maxHeight: size.maxH,
      }}
    >
      {children}
    </Overlay>
  );
}
