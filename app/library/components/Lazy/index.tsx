import { useMemo, useRef } from "react";
import useIntersection from "../../hooks/useIntersection";

export type LazyProps = {
  height?: number | string;
  children: React.ReactNode;
  threshold?: number;
  once?: boolean;
  className?: string;
};

export default function Lazy({
  height = 300, //fill space for times that we don't still intersect it
  children,
  threshold = 0,
  once = true,
  className = "",
}: LazyProps) {
  const container = useRef(null!);
  const isIntersecting = useIntersection(container, { threshold, once });
  const containerHeight = useMemo(() => {
    if (isIntersecting) return "auto";
    return typeof height === "number" ? `${height}px` : height;
  }, [height, isIntersecting]);
  return (
    <div
      ref={container}
      className={`${className}`}
      style={{
        height: containerHeight,
      }}
    >
      {isIntersecting && children}
    </div>
  );
}
