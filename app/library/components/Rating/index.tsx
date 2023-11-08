import { useCallback, useMemo, useRef, useState } from "react";
import Icon from "../Icon";
import useBoundingRect from "../../hooks/useBoundingRect";
import useLocaleDetails from "../../hooks/useLocaleDetails";

export type RatingProps = {
  value: number;
  setValue?: (val: number) => void;
  readonly?: boolean;
  nonActiveColor?: string;
  activeColor?: string;
  size?: number;
  length?: number;
  spacing?: number;
  hover?: boolean;
  halfIncrement?: boolean;
  className?: string;
};

export default function Rating({
  value,
  setValue,
  readonly = false,
  nonActiveColor = "card",
  activeColor = "yellow-400",
  size = 25,
  length = 5,
  spacing = 2,
  hover = true,
  halfIncrement = false,
  className = "",
}: RatingProps) {
  const container = useRef<HTMLUListElement>(null!);
  const { left = 0, width = 0 } = useBoundingRect(container);
  const [hoverStar, setHoverStar] = useState(0);
  const { dir: localeDir } = useLocaleDetails();
  const precision = useMemo(() => {
    return !halfIncrement ? 1 : 0.5;
  }, [halfIncrement]);
  const calcRating = useCallback(
    (e: React.MouseEvent) => {
      const val = ((e.clientX - left) / width) * 100;
      const percent = localeDir === "ltr" ? val : 100 - val;
      const starOccupiedPercent = 100 / length;
      const stars = +(percent / starOccupiedPercent).toFixed(1);
      const activeStars =
        Math.round((stars + precision / 2) / precision) * precision;
      return activeStars;
    },
    [left, localeDir, width, length, precision]
  );
  const mouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!readonly && hover) setHoverStar(calcRating(e));
    },
    [readonly, hover, calcRating]
  );
  const mouseLeave = useCallback(() => {
    if (!readonly && hover) setHoverStar(0);
  }, [readonly, hover]);
  const selectStar = useCallback(
    (e: React.MouseEvent) => {
      if (setValue) setValue(calcRating(e));
    },
    [setValue, calcRating]
  );
  const clearStar = useCallback(() => {
    if (setValue) setValue(0);
    setHoverStar(0);
  }, [setValue]);
  return (
    <ul
      ref={container}
      className={`inline-flex items-center ${
        !readonly ? "cursor-pointer" : "pointer-events-none"
      } ${className}`}
      style={{
        columnGap: `${spacing * 4}px`,
      }}
      onMouseMove={mouseMove}
      onMouseLeave={mouseLeave}
      onClick={selectStar}
      onDoubleClick={() => clearStar()}
    >
      {[...new Array(length)].map((star, index) => {
        const starValue = index + 1;
        const normalizeValue = hoverStar || value;
        const isEmptyStar = starValue > Math.ceil(normalizeValue);
        const isHalfStar =
          starValue !== normalizeValue &&
          starValue === Math.ceil(normalizeValue);
        const isFullStar = !isEmptyStar && !isHalfStar;
        const starSize = `${size}px`;
        return (
          <li
            key={index}
            className="relative overflow-hidden"
            style={{
              width: starSize,
              height: starSize,
            }}
          >
            <Icon
              icon="mdi:star-outline"
              size={size}
              color={nonActiveColor}
              className={`absolute start-0 top-0 z-1 ${
                !isEmptyStar ? "opacity-0" : "opacity-100"
              }`}
            />
            <Icon
              icon="mdi:star-half"
              size={size}
              color={activeColor}
              className={`absolute start-0 top-0 z-2 ${
                !isHalfStar ? "opacity-0" : "opacity-100"
              }`}
              style={{
                transform: localeDir === "rtl" ? "rotateY(180deg)" : undefined,
              }}
            />
            <Icon
              icon="mdi:star"
              size={size}
              color={activeColor}
              className={`absolute start-0 top-0 z-3 ${
                !isFullStar ? "opacity-0" : "opacity-100"
              }`}
            />
          </li>
        );
      })}
    </ul>
  );
}
