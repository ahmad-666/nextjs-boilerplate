import { useCallback, useEffect, useRef } from "react";
import useHover from "../../hooks/useHover";
import useBoundingRect from "../../hooks/useBoundingRect";
import "./styles.scss";

export type HoverTrackerProps = {
  disabled?: boolean;
  size?: number;
  color?: string;
  transparencyPercentage?: number;
  children: React.ReactNode;
  className?: string;
};

export default function HoverTracker({
  disabled = false,
  size = 400,
  color = "rgba(0,0,0,.3)",
  transparencyPercentage = 50, //[0,100]
  children,
  className = "",
}: HoverTrackerProps) {
  const container = useRef<HTMLDivElement>(null!);
  const isHover = useHover(container);
  const { left, top } = useBoundingRect(container);
  const moveHandler = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const { type } = e;
      let x = 0;
      let y = 0;
      if (type === "mousemove") {
        const { clientX, clientY } = e as React.MouseEvent;
        x = clientX;
        y = clientY;
      } else {
        const { touches } = e as React.TouchEvent;
        const { clientX, clientY } = touches[0];
        x = clientX;
        y = clientY;
      }
      const finalX = Math.round(x - left);
      const finalY = Math.round(y - top);
      container.current.style.setProperty("--hover-tracker-x", `${finalX}px`);
      container.current.style.setProperty("--hover-tracker-y", `${finalY}px`);
    },
    [left, top]
  );
  useEffect(() => {
    container.current.style.setProperty("--hover-tracker-size", `${size}px`);
    container.current.style.setProperty("--hover-tracker-color", `${color}`);
    container.current.style.setProperty(
      "--hover-tracker-transparency-percentage",
      `${transparencyPercentage}%`
    );
  }, [color, size, transparencyPercentage]);
  return (
    <div
      ref={container}
      onMouseMove={moveHandler}
      onTouchMove={moveHandler}
      className={`hover-tracker-container relative inline-block overflow-hidden ${
        disabled ? "pointer-events-none" : ""
      } ${className}`}
    >
      {isHover && (
        <div className="hover-tracker pointer-events-none absolute start-0 top-0 h-full w-full"></div>
      )}
      <div>{children}</div>
    </div>
  );
}
