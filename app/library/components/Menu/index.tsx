import { useCallback, useRef, useState, forwardRef, useEffect } from "react";
import { createPortal } from "react-dom";
import useClickOutside from "../../hooks/useClickOutside";
import useClient from "../../hooks/useClient";
import useBoundingRect from "../../hooks/useBoundingRect";
import useResize from "../../hooks/useResize";
import useHover from "../../hooks/useHover";
import useTheme from "../../hooks/useTheme";

export type Horizontal = "left" | "right";
export type Vertical = "top" | "bottom";
export type MenuProps = {
  activatorRef: React.MutableRefObject<HTMLElement>;
  open: boolean;
  setOpen?: (val: boolean) => void;
  children: React.ReactNode;
  position?: `${Horizontal}-${Vertical}`;
  offsetX?: number;
  offsetY?: number;
  fullWidth?: boolean;
  width?: number | string;
  maxWidth?: number | string;
  minWidth?: number | string;
  height?: number | string;
  maxHeight?: number | string;
  minHeight?: number | string;
  openOnHover?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnContentClick?: boolean;
  onOutsideClick?: () => void;
  onContentClick?: () => void;
  zIndex?: number;
  className?: string;
};
export type MenuDetail = {
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  left?: string;
  right?: string;
  top?: string;
};

const Menu = (
  {
    activatorRef,
    open,
    setOpen,
    children,
    position = "left-bottom",
    offsetX = 0, //for small movement
    offsetY = 0, //for small movement
    fullWidth = true, //take full width of activator , if we want custom width we must set it to false
    width,
    maxWidth = "100%",
    minWidth = 0,
    height = "auto",
    maxHeight = 300,
    minHeight = 0,
    openOnHover = false,
    closeOnOutsideClick = true,
    closeOnContentClick = false,
    onOutsideClick,
    onContentClick,
    zIndex = 5,
    className = "", //we can change bg-color via adding className too
  }: MenuProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const { theme } = useTheme();
  const isClient = useClient();
  const containerRef = useRef<HTMLDivElement>(null!);
  const [menuDetails, setMenuDetails] = useState<MenuDetail>({});
  //only for openOnHover functionality ---------------------------
  const isActivatorHover = useHover(activatorRef);
  const [isContainerHover, setIsContainerHover] = useState(false); //we don't use useHover because container has conditional rendering
  const openHoverTimer = useRef<NodeJS.Timeout>();
  const closeHoverTimer = useRef<NodeJS.Timeout>();
  //---------------------------------------------------------------
  const {
    left: activatorLeft = 0,
    right: activatorRight = 0,
    top: activatorTop = 0,
    width: activatorWidth = 0,
    height: activatorHeight = 0,
  } = useBoundingRect(activatorRef);
  useClickOutside(containerRef, (e: MouseEvent) => {
    if (
      closeOnOutsideClick &&
      setOpen &&
      !activatorRef.current.contains(e.target as HTMLElement)
    ) {
      //we want to close on click outside and if click outside of menu is not outside of activator
      setOpen(false);
      if (onOutsideClick) onOutsideClick();
    }
  });
  const contentClick = useCallback(() => {
    if (closeOnContentClick && setOpen) {
      setOpen(false);
      if (onContentClick) onContentClick();
    }
  }, [closeOnContentClick, setOpen, onContentClick]);
  const calcSizePos = useCallback(() => {
    const elm = activatorRef.current;
    if (elm) {
      const horizontal = position.split("-")[0];
      const vertical = position.split("-")[1];
      const leftCoord = activatorLeft + offsetX;
      const rightCoord = window.innerWidth - activatorRight + offsetX;
      const topCoord =
        vertical === "top"
          ? activatorTop + offsetY
          : activatorTop + offsetY + activatorHeight;
      setMenuDetails({
        width: fullWidth
          ? `${activatorWidth}px`
          : typeof width === "number"
          ? `${width}px`
          : width,
        maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
        minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth,
        height: typeof height === "number" ? `${height}px` : height,
        maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
        minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
        left:
          horizontal === "left" ? `${leftCoord + window.scrollX}px` : undefined,
        right:
          horizontal === "right"
            ? `${rightCoord - window.scrollX}px`
            : undefined,
        top: `${topCoord + window.scrollY}px`,
      });
    }
  }, [
    activatorRef,
    activatorWidth,
    activatorHeight,
    activatorLeft,
    activatorRight,
    activatorTop,
    position,
    offsetX,
    offsetY,
    fullWidth,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
  ]);
  useResize(activatorRef, calcSizePos);
  useEffect(() => {
    if (openOnHover && setOpen) {
      //we use timer because activator,container are 2 totally different elements and not inside same wrapper so we should use their hover state separately and wait for time time
      if (isActivatorHover) {
        openHoverTimer.current = setTimeout(() => {
          if (isActivatorHover) setOpen(true);
          else clearTimeout(openHoverTimer.current);
        }, 50);
      } else if (!isActivatorHover && !isContainerHover) {
        closeHoverTimer.current = setTimeout(() => {
          if (!isActivatorHover && !isContainerHover) setOpen(false);
          else clearTimeout(closeHoverTimer.current);
        }, 50);
      }
    }
    return () => {
      clearTimeout(openHoverTimer.current);
      clearTimeout(closeHoverTimer.current);
    };
  }, [openOnHover, setOpen, isActivatorHover, isContainerHover]);
  if (!open) return null;
  return isClient
    ? createPortal(
        <div
          ref={(elm) => {
            if (elm) {
              containerRef.current = elm;
              if (ref) {
                (ref as React.MutableRefObject<HTMLDivElement>).current = elm;
              }
            }
          }}
          className={`absolute overflow-y-auto overflow-x-hidden rounded p-4 shadow-full ${
            theme === "light" ? "bg-white" : "bg-slate-800"
          } ${className}`}
          style={{
            ...menuDetails,
            zIndex,
          }}
          onMouseEnter={() => setIsContainerHover(true)}
          onMouseLeave={() => setIsContainerHover(false)}
          onTouchStart={() => setIsContainerHover(true)}
          onTouchEnd={() => setIsContainerHover(false)}
        >
          <div onClick={contentClick}>{children}</div>
        </div>,
        document.querySelector("#portals")!
      )
    : null;
};

export default forwardRef(Menu);
