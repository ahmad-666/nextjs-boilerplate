//here we use position:absolute approach , we could also we use clip-path approach too

import { useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import useColorParser from "../../hooks/useColorParser";
import useBoundingRect from "../../hooks/useBoundingRect";
import useLocaleDetails from "../../hooks/useLocaleDetails";

export type ImageComparisonProps = {
  originalImg: string;
  compareImg: string;
  resizeWidth?: number;
  resizeHeight?: number;
  dividerSize?: number;
  dividerColor?: string;
  imgClass?: string;
  className?: string;
};

export default function ImageComparison({
  originalImg,
  compareImg,
  resizeWidth = 1000,
  resizeHeight = 1000,
  dividerSize = 8,
  dividerColor = "primary",
  imgClass = "",
  className = "",
}: ImageComparisonProps) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const compareImgRef = useRef<HTMLDivElement>(null!);
  const dividerRef = useRef<HTMLDivElement>(null!);
  const { width: containerWidth, left: containerLeft } =
    useBoundingRect(containerRef);
  const { dir: localeDir } = useLocaleDetails();
  const moveHandler = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      const { type } = e;
      let value: number;
      if (type === "mousemove") {
        const { clientX } = e as React.MouseEvent<HTMLDivElement>;
        value = clientX;
      } else {
        const { touches } = e as React.TouchEvent<HTMLDivElement>;
        value = touches[0].clientX;
      }
      const percentage = ((value - containerLeft) / containerWidth) * 100;
      const finalPercentage =
        localeDir === "ltr" ? percentage : 100 - percentage;
      compareImgRef.current.style.setProperty("width", `${finalPercentage}%`);
      dividerRef.current.style.setProperty(
        "inset-inline-start",
        `${finalPercentage}%`
      ); //for left in ltr,right in rtl
    },
    [containerLeft, containerWidth, localeDir]
  );
  const dividerParsedColor = useColorParser(dividerColor);
  return (
    <div
      ref={containerRef}
      onMouseMove={moveHandler}
      onTouchMove={moveHandler}
      className={`relative cursor-ew-resize overflow-hidden ${className}`}
    >
      <Image
        src={originalImg}
        alt={originalImg}
        width={resizeWidth}
        height={resizeHeight}
        quality={100}
        className={`h-full w-full max-w-none ${imgClass}`}
      />
      <div
        ref={compareImgRef}
        className="absolute start-0 top-0 z-1 h-full overflow-hidden"
      >
        <Image
          src={compareImg}
          alt={compareImg}
          width={resizeWidth}
          height={resizeHeight}
          quality={100}
          className={`absolute start-0 top-0 h-full max-w-none ${imgClass}`}
          style={{
            width: `${containerWidth}px`,
          }}
        />
      </div>
      <div
        ref={dividerRef}
        className="absolute top-0 z-2 h-full rounded ltr:-translate-x-1/2 rtl:translate-x-1/2"
        style={{
          width: `${dividerSize}px`,
          backgroundColor: dividerParsedColor,
        }}
      ></div>
    </div>
  );
}
