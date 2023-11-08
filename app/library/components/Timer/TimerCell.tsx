import { useMemo } from "react";
import useColorParser from "../../hooks/useColorParser";
import type { TimerCellProps } from "./types";

export default function TimerCell({
  value,
  size = "md",
  topColor = "card-darken1",
  bottomColor = "card-lighten1",
  textColor = "primary",
  className = "",
}: TimerCellProps) {
  const topColorParsed = useColorParser(topColor);
  const bottomColorParsed = useColorParser(bottomColor);
  const textColorParsed = useColorParser(textColor);
  const sectionSize = useMemo(() => {
    let width, height;
    if (size === "sm") {
      width = 45;
      height = 45;
    } else if (size === "md") {
      width = 70;
      height = 70;
    } else if (size === "lg") {
      width = 100;
      height = 100;
    }
    return {
      width: `${width}px`,
      height: `${height}px`,
    };
  }, [size]);
  const fontSize = useMemo(() => {
    if (size === "sm") return "text-subtitle1";
    else if (size === "md") return "text-h6";
    else if (size === "lg") return "text-h4";
  }, [size]);
  return (
    <div className={`${className}`}>
      <div
        className={`relative rounded-sm font-bold shadow-[0px_10px_15px_-5px_rgba(0,0,0,.3)] ${fontSize}`}
        style={{
          ...sectionSize,
          color: textColorParsed,
          perspective: "400px",
        }}
      >
        <div
          className="top-section absolute start-0 top-0 z-1 h-1/2 w-full overflow-hidden rounded-t-sm"
          style={{
            backgroundColor: topColorParsed,
          }}
        >
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            {value}
          </span>
        </div>
        <div
          className="bottom-section absolute bottom-0 start-0 z-1 h-1/2 w-full overflow-hidden rounded-b-sm"
          style={{
            backgroundColor: bottomColorParsed,
          }}
        >
          <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}
