import { useRef, useCallback, useEffect } from "react";
import useLocaleDetails from "../../hooks/useLocaleDetails";

export type HorizontalScrollProps = {
  spacing?: number;
  children: React.ReactNode;
  className?: string;
};

export default function HorizontalScroll({
  spacing = 4,
  children,
  className = "",
}: HorizontalScrollProps) {
  const { dir } = useLocaleDetails();
  const container = useRef<HTMLDivElement>(null!);
  const wheelHandler = useCallback(
    (e: WheelEvent) => {
      e.preventDefault(); //default behavior is page scrolling
      e.stopPropagation();
      if (dir === "ltr") container.current.scrollLeft += e.deltaY;
      else container.current.scrollLeft -= e.deltaY;
    },
    [dir]
  );
  useEffect(() => {
    const elm = container.current;
    if (elm) {
      elm.addEventListener("wheel", wheelHandler);
      return () => {
        elm.removeEventListener("wheel", wheelHandler);
      };
    }
  }, [wheelHandler]);
  return (
    <div
      ref={container}
      className={`flex overflow-hidden ${className}`}
      style={{
        gap: `${spacing * 4}px`,
      }}
    >
      {children}
    </div>
  );
}
