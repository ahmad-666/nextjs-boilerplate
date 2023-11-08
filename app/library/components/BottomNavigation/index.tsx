import { createPortal } from "react-dom";
import useColorParser from "../../hooks/useColorParser";
import useClient from "../../hooks/useClient";

export type BottomNavigationProps = {
  show?: boolean;
  color?: string;
  height?: number | string;
  zIndex?: number;
  spacing?: number;
  children: React.ReactNode;
  className?: string;
};

export default function BottomNavigation({
  show = true,
  color = "card",
  height = "auto",
  zIndex = 1,
  spacing = 8,
  children,
  className = "",
}: BottomNavigationProps) {
  const isClient = useClient();
  const parsedColor = useColorParser(color);
  return isClient
    ? createPortal(
        <div
          className={`fixed bottom-0 start-0 flex w-full items-center justify-center overflow-hidden p-0 transition-transform duration-300 ease-linear ${
            show ? "translate-y-0" : "translate-y-[110%]"
          } ${className}`}
          style={{
            backgroundColor: parsedColor,
            height: typeof height === "number" ? `${height}px` : height,
            zIndex,
            gap: `${spacing * 4}px`,
          }}
        >
          {children}
        </div>,
        document.querySelector("#portals")!
      )
    : null;
}
