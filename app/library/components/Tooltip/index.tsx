import useColorParser from "../../hooks/useColorParser";

export type Pos = "left" | "right" | "top" | "bottom";
export type TooltipProps = {
  children: React.ReactNode;
  pos?: Pos;
  title?: string;
  contentJsx?: React.ReactNode;
  zIndex?: number;
  color?: string;
  singleLine?: boolean;
  tooltipClassName?: string;
  className?: string;
};

export default function Tooltip({
  children, //act as activator
  pos = "bottom",
  title, //text of tooltip content
  contentJsx, //jsx of tooltip content
  zIndex = 5,
  color = "slate-800",
  singleLine = true,
  tooltipClassName = "", //for tooltip itself not activator
  className = "", //for whole wrapper
  ...rest
}: TooltipProps) {
  const parsedColor = useColorParser(color);
  return (
    <div {...rest} className={`relative inline-block ${className}`}>
      <div className="peer">{children}</div>
      <div
        className={`pointer-events-none absolute rounded-xs p-2 text-caption text-white opacity-0 transition-opacity duration-300 ease-linear peer-hover:opacity-100 ${
          pos === "top" ? "bottom-[calc(100%+5px)] start-0" : ""
        } ${pos === "bottom" ? "start-0 top-[calc(100%+5px)]" : ""} ${
          pos === "left" ? "right-[calc(100%+5px)] top-0" : ""
        } ${pos === "right" ? "left-[calc(100%+5px)] top-0" : ""} ${
          singleLine ? "whitespace-nowrap" : ""
        } ${tooltipClassName}`}
        style={{ zIndex, backgroundColor: parsedColor }}
      >
        {contentJsx || title}
      </div>
    </div>
  );
}
