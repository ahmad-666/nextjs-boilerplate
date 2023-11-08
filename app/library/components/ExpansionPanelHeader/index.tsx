import { useCallback } from "react";
import Icon from "../Icon";

export type ExpansionHeaderProps = {
  open?: boolean;
  toggleOpen?: () => void;
  children: React.ReactNode;
  hideAction?: boolean;
  actionJsx?: (isOpen: boolean) => React.ReactNode;
  contentClass?: string;
  className?: string;
};

export default function ExpansionPanelHeader({
  open = false,
  toggleOpen,
  children,
  hideAction = false,
  actionJsx,
  contentClass = "",
  className = "",
}: ExpansionHeaderProps) {
  const clickHandler = useCallback(() => {
    if (toggleOpen) toggleOpen();
  }, [toggleOpen]);
  return (
    <div className={`p-4 ${className}`}>
      <button
        onClick={clickHandler}
        className="flex w-full cursor-pointer items-center justify-between border-none bg-transparent outline-none"
      >
        <div className={`grow text-start ${contentClass}`}>{children}</div>
        <div className="shrink-0">
          {!hideAction &&
            (!actionJsx ? (
              <Icon
                icon="mdi:chevron-down"
                size="md"
                color="text"
                className={`me-2 !transition-transform !duration-200 !ease-linear ${
                  !open ? "rotate-0" : "rotate-180"
                }`}
              />
            ) : (
              actionJsx(open)
            ))}
        </div>
      </button>
    </div>
  );
}
