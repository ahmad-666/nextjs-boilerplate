import { Children, cloneElement, Fragment } from "react";
import Icon from "../Icon";

export type DividerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type BreadcrumbProps = {
  divider?: string;
  dividerSize?: DividerSize;
  dividerColor?: string;
  color?: string;
  dense?: boolean;
  children: React.ReactNode;
  activeClass?: string;
  className?: string;
};

export default function Breadcrumb({
  divider = "mdi:chevron-right",
  dividerSize = "sm",
  dividerColor = "divider",
  color = "primary",
  dense = false,
  children,
  activeClass = "",
  className = "",
}: BreadcrumbProps) {
  return (
    <ul
      className={`inline-flex flex-wrap items-center ${
        dense ? "gap-0" : "gap-1"
      } ${className}`}
    >
      {Children.map(children, (itemComponent: any, index) => {
        return (
          <Fragment key={itemComponent.props.href}>
            <li>
              {cloneElement(itemComponent, {
                href: itemComponent.props.href,
                color,
                activeClass,
                children: itemComponent.props.children,
                className: itemComponent.props.className,
              })}
            </li>
            {index < (children as any).length - 1 && (
              <li className="flex">
                <Icon icon={divider} size={dividerSize} color={dividerColor} />
              </li>
            )}
          </Fragment>
        );
      })}
    </ul>
  );
}
