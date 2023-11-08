//this component can be use as Snackbar,Alert,Toast

import { useCallback, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "../Icon";
import useClient from "../../hooks/useClient";
import useColorParser from "../../hooks/useColorParser";

export type Size = "sm" | "md" | "lg";
export type Type = "static" | "absolute" | "fixed";
export type Horizontal = "left" | "center" | "right";
export type Vertical = "top" | "center" | "bottom";
export type SnackbarProps = {
  show: boolean;
  setShow?: (val: boolean) => void;
  type?: Type;
  color?: string;
  anchor?: `${Horizontal}-${Vertical}`;
  density?: Size;
  rounded?: Size;
  zIndex?: number;
  closable?: boolean;
  timeout?: number;
  children: React.ReactNode;
  className?: string;
};

export default function Snackbar({
  show,
  setShow,
  type = "fixed", //type 'static' , 'absolute' for alert , type 'fixed' for snackbar
  color = "primary",
  anchor = "center-bottom",
  density = "md",
  rounded = "md",
  zIndex = 7,
  closable = true,
  timeout = 3000, //0 or negative value for no timer
  children,
  className = "",
}: SnackbarProps) {
  const timerId = useRef<NodeJS.Timer>();
  const parsedColor = useColorParser(color);
  const isClient = useClient();
  const cssClass = useMemo(() => {
    let padding = "";
    let borderRadius = "";
    let position = "";
    let anchorHClasses = "";
    let anchorVClasses = "";
    //padding --------------------
    if (density === "sm") padding = "p-1";
    else if (density === "md") padding = "p-2";
    else if (density === "lg") padding = "p-3";
    //border-radius --------------------
    if (rounded === "sm") borderRadius = "rounded-xs";
    else if (rounded === "md") borderRadius = "rounded-sm";
    else if (rounded === "lg") borderRadius = "rounded";
    //position --------------------
    if (type === "static") position = "static";
    else if (type === "absolute") position = "absolute";
    else if (type === "fixed") position = "fixed";
    //left,right,top,bottom,translate --------------------
    if (type !== "static") {
      //if type is 'static' then we don't need any anchor
      const anchorSplit = anchor.split("-");
      const hAnchor = anchorSplit[0] as Horizontal;
      const vAnchor = anchorSplit[1] as Vertical;
      if (hAnchor === "left") anchorHClasses = "left-[3%]";
      else if (hAnchor === "center")
        anchorHClasses = "left-1/2 -translate-x-1/2";
      else if (hAnchor === "right") anchorHClasses = "right-[3%]";
      if (vAnchor === "top") anchorVClasses = "top-[3%]";
      else if (vAnchor === "center")
        anchorVClasses = "top-1/2 -translate-y-1/2";
      else if (vAnchor === "bottom") anchorVClasses = "bottom-[3%]";
    }
    return `${padding} ${borderRadius} ${position} ${anchorHClasses} ${anchorVClasses}`;
  }, [density, rounded, type, anchor]);
  const closeHandler = useCallback(() => {
    if (setShow) setShow(false);
  }, [setShow]);
  useEffect(() => {
    if (timeout > 0) {
      timerId.current = setTimeout(() => {
        closeHandler();
      }, timeout);
    }
    return () => {
      clearTimeout(timerId.current);
    };
  }, [show, timeout, closeHandler]);
  const renderJsx = useCallback(() => {
    return (
      <div
        className={`inline-flex items-center justify-between ${cssClass} ${className}`}
        style={{ zIndex, backgroundColor: parsedColor }}
      >
        <div className="grow text-body2 text-white">{children}</div>
        {closable && (
          <button
            className="ms-4 mt-1 shrink-0 cursor-pointer border-none bg-transparent outline-none"
            onClick={closeHandler}
          >
            <Icon icon="mdi:close" size="sm" color="white" />
          </button>
        )}
      </div>
    );
  }, [
    parsedColor,
    zIndex,
    cssClass,
    className,
    closable,
    closeHandler,
    children,
  ]);
  if (!show || !isClient) return null;
  return type !== "fixed"
    ? renderJsx()
    : createPortal(renderJsx(), document.querySelector("#portals")!);
}
