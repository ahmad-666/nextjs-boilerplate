import { usePathname } from "next/navigation";
import Button from "../Button";

export type BreadcrumbItemProps = {
  href: string;
  color?: string;
  disabled?: boolean;
  children: React.ReactNode;
  activeClass?: string;
  className?: string;
};

export default function BreadcrumbItem({
  href,
  color = "primary",
  disabled = false,
  children,
  activeClass = "",
  className = "",
}: BreadcrumbItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Button
      variant="text"
      color={color}
      disabled={disabled}
      href={href}
      className={`overflow-hidden ${isActive ? activeClass : ""} ${className}`}
    >
      {children}
    </Button>
  );
}
