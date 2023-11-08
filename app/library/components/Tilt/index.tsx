{
  /* <Tilt className="p-5"> //add padding for add spacing for overflow-hidden
<div className="h-[300px] w-[300px] bg-red-300"></div>
</Tilt> */
}

import { useCallback, useEffect, useRef } from "react";
import HoverTracker from "../HoverTracker";
import useBoundingRect from "../../hooks/useBoundingRect";
import useHover from "../../hooks/useHover";
import "./styles.scss";

export type Dir = "x" | "y" | "both";

export type TiltProps = {
  disabled?: boolean;
  dir?: Dir;
  intensity?: number;
  perspective?: number;
  showTracker?: boolean;
  trackerSize?: number;
  trackerColor?: string;
  trackerTransparencyPercentage?: number;
  children: React.ReactNode;
  className?: string;
};

export default function Tilt({
  disabled = false,
  dir = "both",
  intensity = 0.1, //act act multiplier
  perspective = 750, //less value more 3d effect
  showTracker = true,
  trackerSize = 200,
  trackerColor = "rgba(0,0,0,.2)",
  trackerTransparencyPercentage = 50, //number between [0,100]
  children,
  className = "",
}: TiltProps) {
  const container = useRef<HTMLDivElement>(null!);
  const isHover = useHover(container);
  const { width, height, left, top } = useBoundingRect(container);
  const moveHandler = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const { type } = e;
      let x = 0,
        y = 0;
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
      const finalX = Math.round((x - left - width / 2) * intensity); //use for rotate-y
      const finalY = Math.round((y - top - height / 2) * intensity); //use for rotate-x
      if (dir === "y" || dir === "both") {
        container.current.style.setProperty("--tilt-rotate-x", `${finalY}deg`);
      }
      if (dir === "x" || dir === "both") {
        container.current.style.setProperty("--tilt-rotate-y", `${finalX}deg`);
      }
    },
    [dir, intensity, width, height, left, top]
  );
  useEffect(() => {
    if (!isHover) {
      container.current.style.setProperty("--tilt-rotate-x", "0deg");
      container.current.style.setProperty("--tilt-rotate-y", "0deg");
    }
  }, [isHover]);
  return (
    <div
      ref={container}
      onMouseMove={moveHandler}
      onTouchMove={moveHandler}
      className={`inline-block overflow-hidden ${
        disabled ? "pointer-events-none" : ""
      } ${className}`}
      style={{
        perspective: `${perspective}px`,
      }}
    >
      <div className="tilt-container">
        <HoverTracker
          disabled={!showTracker}
          color={trackerColor}
          size={trackerSize}
          transparencyPercentage={trackerTransparencyPercentage}
        >
          {children}
        </HoverTracker>
      </div>
    </div>
  );
}
