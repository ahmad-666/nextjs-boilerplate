import { useCallback } from "react";
import { createPortal } from "react-dom";
import useClient from "../../hooks/useClient";

export type OverlayProps = {
  show: boolean;
  setShow?: (val: boolean) => void;
  color?: string;
  zIndex?: number;
  absolute?: boolean;
  children?: React.ReactNode;
  closeOnOutsideClick?: boolean;
  closeOnContentClick?: boolean;
  onOutsideClick?: () => void;
  contentClass?: String;
  contentStyle?: React.CSSProperties;
  className?: string;
};

export default function Overlay({
  show,
  setShow,
  color = "rgba(0,0,0,.75)",
  zIndex = 8,
  absolute = false,
  children = null,
  closeOnOutsideClick = true,
  closeOnContentClick = false,
  onOutsideClick,
  contentClass = "",
  contentStyle = {},
  className = "", //for whole wrapper
}: OverlayProps) {
  const isClient = useClient();
  const overlayClick = useCallback(() => {
    if (closeOnOutsideClick) {
      if (setShow) setShow(false);
      if (onOutsideClick) onOutsideClick();
    }
  }, [closeOnOutsideClick, setShow, onOutsideClick]);
  const contentClick = useCallback(() => {
    if (closeOnContentClick && setShow) setShow(false);
  }, [closeOnContentClick, setShow]);
  const renderJsx = useCallback(() => {
    return (
      <div
        className={`start-0 top-0 flex h-full w-full items-center justify-center ${
          absolute ? "absolute" : "fixed"
        } ${className}`}
        style={{
          zIndex,
        }}
      >
        <div
          className="absolute start-0 top-0 z-1 h-full w-full"
          style={{ backgroundColor: color }}
          onClick={overlayClick}
        ></div>
        <div
          className={`relative z-2 ${contentClass}`}
          style={{ ...contentStyle }}
          onClick={contentClick}
        >
          {children}
        </div>
      </div>
    );
  }, [
    color,
    absolute,
    zIndex,
    contentStyle,
    contentClass,
    className,
    overlayClick,
    contentClick,
    children,
  ]);

  if (!show || !isClient) return null;
  return !absolute
    ? createPortal(renderJsx(), document.querySelector("#portals")!)
    : renderJsx();
}
