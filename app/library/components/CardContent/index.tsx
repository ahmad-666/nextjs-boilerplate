import { useMemo } from "react";

export type CardContentProps = {
  density?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
};

export default function CardContent({
  density = "md",
  children,
  className = "",
}: CardContentProps) {
  const cssClass = useMemo(() => {
    let padding = "";
    if (density === "none") padding = "p-0";
    else if (density === "sm") padding = "p-2";
    else if (density === "md") padding = "p-4";
    else if (density === "lg") padding = "p-6";
    return `${padding}`;
  }, [density]);
  return <div className={`${cssClass} ${className}`}>{children}</div>;
}
