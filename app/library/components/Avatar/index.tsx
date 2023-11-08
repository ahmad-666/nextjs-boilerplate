import useColorParser from "../../hooks/useColorParser";

export type AvatarProps = {
  size?: number;
  color?: string;
  children: React.ReactNode;
  outlineWidth?: number;
  outlineColor?: string;
  className?: string;
};

export default function Avatar({
  size = 40,
  color = "primary",
  children,
  outlineWidth = 0,
  outlineColor = "primary-lighten2",
  className = "",
}: AvatarProps) {
  const parsedColor = useColorParser(color);
  const parsedOutlineColor = useColorParser(outlineColor);
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: parsedColor,
        outline: `${outlineWidth}px solid ${parsedOutlineColor}`,
      }}
      className={`inline-block overflow-hidden rounded-circle ${className}`}
    >
      <div className="flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
