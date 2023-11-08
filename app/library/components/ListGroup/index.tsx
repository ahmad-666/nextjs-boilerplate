import { useCallback } from "react";
import Icon from "../Icon";

export type ListGroupProps = {
  open: boolean;
  toggleOpen: () => void;
  activatorJsx: (open: boolean) => React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  itemsClass?: string;
  className?: string;
};

export default function ListGroup({
  open = false,
  toggleOpen,
  activatorJsx,
  children, //content
  disabled = false,
  itemsClass = "",
  className = "",
}: ListGroupProps) {
  const clickHandler = useCallback(() => {
    toggleOpen();
  }, [toggleOpen]);
  return (
    <div
      className={`${
        disabled ? "pointer-events-none opacity-40" : ""
      } ${className}`}
    >
      <div
        onClick={clickHandler}
        className="flex cursor-pointer items-center justify-between"
      >
        <div className="grow">{activatorJsx(open)}</div>
        <Icon
          icon="mdi:chevron-down"
          size="md"
          color="slate-400"
          className={`shrink-0 !transition-transform !duration-200 !ease-linear ${
            !open ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>

      <div
        className={`grid transition-[grid-template-rows]  duration-200 ease-linear ${
          !open ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        }`}
      >
        <div className="overflow-hidden p-0">
          <div className={`${itemsClass}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
