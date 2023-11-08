//whenever we have <img loading="eager" src="..." /> network will be consumed as much as size of src
//for lazy loading:
// 1-<img loading="lazy" src="realSrc" /> (img should have explicit width,height and none should be 'auto')
// 2-<img src="lazySrc" /> + intersectionObserver and after we intersect image we replace lazySrc with realSrc(no animation or any transition)
// 3-use <div> wrapper with backgroundImage: url(lazySrc) + <img src="lazySrc" className="opacity-0" /> + intersectionObserver and only after we intersect <img /> replace its src with 'realSrc' and add 'onload' event to it and only after load 'realSrc' we add 'opacity-100' class to it
//lazySrc can be totally default placeholder or same image but with very small width,height so we have blur effect
//each <img /> has onLoad(),onError(),.complete
//onLoad event will only fire even if img.complete===false and if image is already loaded it won't fire

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { default as NextImage } from "next/image";
import useIntersection from "../../hooks/useIntersection";

export type Fill = "cover" | "contain" | "fill";
export type ImageProps = {
  src: string;
  lazy?: boolean;
  lazySrc?: string;
  lazyThreshold?: number;
  alt?: string;
  fill?: Fill;
  overlay?: boolean;
  overlayJsx?: ({
    isIntersected,
    isLoaded,
  }: {
    isIntersected: boolean;
    isLoaded: boolean;
  }) => React.ReactNode;
  quality?: number;
  resizeWidth?: number;
  resizeHeight?: number;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  imgClass?: string;
  overlayClass?: string;
  className?: string;
};

export default function Image({
  src,
  lazy = true,
  lazySrc, //only for lazy:true , not required , possible that we want lazy loading but we don't have any lazySrc
  //in this case we have <img loading="lazy" src="realSrc" /> --> we must always have some 'src' on img + if we are far away from image then it won't load until we get near it
  lazyThreshold = 0, //threshold of intersectionObserver
  alt,
  fill = "cover", //there are 3 cases --> object-cover,object-contain,object-fill
  overlay = false,
  overlayJsx,
  quality = 75, //for quality prop of next/image
  resizeWidth = 750, //for width prop of next/image
  resizeHeight = 750, //for height prop of next/image
  width,
  minWidth = 0,
  maxWidth = "100%",
  height = "auto",
  minHeight = 0,
  maxHeight,
  imgClass = "",
  overlayClass = "",
  className = "",
}: ImageProps) {
  const containerElm = useRef<HTMLDivElement>(null!);
  const imgElm = useRef<HTMLImageElement>(null!);
  const isIntersected = useIntersection(containerElm, {
    once: true,
    threshold: lazyThreshold,
  });
  const [isLoaded, setIsLoaded] = useState(!lazy);
  const finalSrc = useMemo(() => {
    if (lazy && lazySrc && !isIntersected) return lazySrc;
    return src;
  }, [lazy, lazySrc, src, isIntersected]);
  const sizing = useMemo(() => {
    return {
      width: typeof width === "number" ? `${width}px` : width,
      minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth,
      maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
      height: typeof height === "number" ? `${height}px` : height,
      minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
      maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
    };
  }, [width, minWidth, maxWidth, height, minHeight, maxHeight]);
  const loadHandler = useCallback(() => {
    setIsLoaded(true);
  }, []);
  useEffect(() => {
    if (lazy && finalSrc === src) {
      const img = imgElm.current;
      if (img.complete) loadHandler(); //if image load very fast
      else {
        img.addEventListener("load", loadHandler);
        return () => {
          img.removeEventListener("load", loadHandler);
        };
      }
    }
  }, [src, finalSrc, lazy, loadHandler]);
  return (
    <div
      ref={containerElm}
      className={`relative inline-block overflow-hidden ${
        lazySrc ? "bg-cover bg-center bg-no-repeat" : ""
      } ${className}`}
      style={{
        backgroundImage: lazySrc ? `url(${lazySrc})` : undefined,
        ...sizing,
      }}
    >
      <NextImage
        ref={imgElm}
        src={finalSrc}
        alt={alt || src}
        width={resizeWidth}
        height={resizeHeight}
        quality={quality}
        loading={lazy ? "lazy" : "eager"}
        className={`block h-full w-full max-w-full ${
          fill === "cover"
            ? "object-cover"
            : fill === "contain"
            ? "object-contain"
            : "object-fill"
        } ${lazySrc ? "transition-opacity duration-500 ease-linear" : ""} ${
          lazySrc && !isLoaded ? "opacity-0" : "opacity-100"
        } ${imgClass}
        `}
        style={{
          maxHeight: sizing.maxHeight,
        }}
      />
      {overlay && (
        <div
          className={`pointer-events-none absolute start-0 top-0 z-1 flex h-full w-full items-center justify-center ${overlayClass}`}
        >
          {!!overlayJsx && overlayJsx({ isIntersected, isLoaded })}
        </div>
      )}
    </div>
  );
}
