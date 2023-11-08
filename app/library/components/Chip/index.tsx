import { useCallback, useMemo, useRef } from "react";
import useColorParser from "../../hooks/useColorParser";
import Link from "next/link";
import Button from "../Button";
import Ripple from "../Ripple";
import Icon from "../Icon";

export type ChipProps = {
  children: React.ReactNode;
  color?: string;
  variant?: "outlined" | "filled";
  size?: "small" | "medium" | "large";
  rounded?: "none" | "small" | "medium" | "large";
  ripple?: boolean;
  href?: string;
  replace?: boolean;
  closable?: boolean;
  closeJsx?: React.ReactNode;
  onClose?: () => void;
  onClick?: () => void;
  className?: string;
};

export default function Chip({
  children,
  color = "primary",
  variant = "filled",
  size = "medium",
  rounded = "medium",
  ripple = true,
  href,
  replace = false,
  closable = false,
  closeJsx,
  onClose,
  onClick,
  className = "",
}: ChipProps) {
  const container = useRef<any>(null!);
  const parsedColor = useColorParser(color);
  const isLink = useMemo(() => {
    if (href) return true;
    return false;
  }, [href]);
  const Component = useMemo(() => {
    if (isLink) return Link;
    return "span";
  }, [isLink]);
  const cssClass = useMemo(() => {
    let padding = "";
    let borderRadius = "";
    if (size === "small") padding = "p-2";
    else if (size === "medium") padding = "p-3";
    else if (size === "large") padding = "p-5";
    if (rounded === "none") borderRadius = "rounded-none";
    else if (rounded === "small") borderRadius = "rounded-xs";
    else if (rounded === "medium") borderRadius = "rounded";
    else if (rounded === "large") borderRadius = "rounded-lg";
    return `${padding} ${borderRadius}`;
  }, [size, rounded]);
  const closeClicked = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onClose) onClose();
    },
    [onClose]
  );
  return (
    <Component
      onClick={onClick}
      ref={container}
      className={`relative inline-block overflow-hidden ${cssClass} ${className}`}
      style={{
        backgroundColor: variant === "filled" ? parsedColor : "transparent",
        border: variant === "outlined" ? `1px solid ${parsedColor}` : "none",
      }}
      href={href!}
      replace={isLink ? replace : undefined}
    >
      <span className="flex items-center justify-center">
        {children}
        {closable && (
          <Button
            className="ms-4 !p-0"
            variant="text"
            ripple={false}
            onClick={closeClicked}
          >
            {closeJsx || (
              <Icon
                icon="mdi:close"
                color={variant === "filled" ? "white" : color}
                size="sm"
              />
            )}
          </Button>
        )}
      </span>
      {ripple && <Ripple refElm={container} />}
    </Component>
  );
}
