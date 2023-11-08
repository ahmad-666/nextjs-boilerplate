import useColorParser from "../../hooks/useColorParser";
import "./styles.scss";

export type ProgressLinearProps = {
  value?: number;
  color?: string;
  height?: number;
  indeterminate?: boolean;
  className?: string;
};

export default function ProgressLinear({
  value = 0, //[0,100]
  color = "primary",
  height = 4,
  indeterminate = false,
  className = "",
}: ProgressLinearProps) {
  const parsedColor = useColorParser(color);
  return (
    <div className={`${className}`}>
      <div
        style={{ height: `${height}px` }}
        className={`relative overflow-hidden rounded-sm`}
      >
        <div
          className={`h-full w-full opacity-30`}
          style={{ backgroundColor: parsedColor }}
        ></div>
        <div
          className={`absolute ${
            !indeterminate ? "start-0" : "animate-linear-progress"
          } top-0 h-full w-full ltr:origin-left rtl:origin-right`}
          style={{
            backgroundColor: parsedColor,
            transform: !indeterminate ? `scaleX(${value / 100})` : undefined,
          }}
        ></div>
      </div>
    </div>
  );
}
