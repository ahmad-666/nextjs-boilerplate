import useColorParser from "../../hooks/useColorParser";

export type DividerProps = {
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
};

export default function Divider({
  width = "100%",
  height = 1.5,
  color = "divider",
  className = "",
}: DividerProps) {
  const parsedColor = useColorParser(color);
  return (
    <div
      className={`rounded-sm ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        backgroundColor: parsedColor,
      }}
    ></div>
  );
}
