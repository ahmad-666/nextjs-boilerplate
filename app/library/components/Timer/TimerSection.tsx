import { useMemo } from "react";
import TimerCell from "./TimerCell";
import useColorParser from "../../hooks/useColorParser";
import type { TimerSectionProps } from "./types";

export default function TimerSection({
  title,
  val1,
  val2,
  size,
  topColor,
  bottomColor,
  textColor = "primary",
  className = "",
}: TimerSectionProps) {
  const colorParsed = useColorParser(textColor);
  const titleSize = useMemo(() => {
    if (size === "sm") return "text-body1";
    else if (size === "md") return "text-subtitle1";
    else if (size === "lg") return "text-h6";
  }, [size]);
  return (
    <div className={`${className}`}>
      <div className="flex flex-col items-center">
        <p
          className={`font-bold ${titleSize}`}
          style={{
            color: colorParsed,
          }}
        >
          {title}
        </p>
        <div className="dir-ltr mt-2 flex items-stretch gap-2">
          <TimerCell
            value={val1}
            topColor={topColor}
            bottomColor={bottomColor}
            textColor={textColor}
            size={size}
          />
          <TimerCell
            value={val2}
            topColor={topColor}
            bottomColor={bottomColor}
            textColor={textColor}
            size={size}
          />
        </div>
      </div>
    </div>
  );
}
