import { useMemo } from "react";
import Link from "next/link";

export type ListItemProps = {
  children: React.ReactNode;
  href?: string;
  replace?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function ListItem({
  children,
  href = "",
  replace = false,
  onClick,
  disabled = false,
  className = "",
}: ListItemProps) {
  const isLink = useMemo(() => {
    if (href) return true;
    return false;
  }, [href]);
  const Component = useMemo(() => {
    if (isLink) return Link;
    return "div";
  }, [isLink]);
  return (
    <Component
      href={href}
      replace={isLink ? replace : undefined}
      onClick={onClick}
      className={`${
        disabled ? "pointer-events-none opacity-40" : "cursor-pointer"
      } ${className}`}
    >
      {children}
    </Component>
  );
}
