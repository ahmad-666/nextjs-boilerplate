//getBoundingClientRect will not re-execute on window resize automatically and we manually need to add 'resize' event on window
//base on condition we should decide between:
// 1-getBoundingClientRect() + 'resize' event on window(resizeObserver)
// 2-resizeObserver on element itself
//getBoundingClientRect will return {width,height,top,right,bottom,left,x,y}
//width,height are total width,height of element including padding,border-width
//top is distance from top of element to top of viewport , bottom is distance from bottom of element to top of viewport
//left is distance from left of element to left of viewport , right is distance from right of element to left of viewport

import { useState, useCallback, useEffect } from "react";
import useResize from "./useResize";

const useBoundingRect = (ref: React.MutableRefObject<HTMLElement>) => {
  const [bouncingRect, setBoundingRect] = useState<
    Record<string, number> | DOMRect
  >({});
  const calcBoundingRect = useCallback(() => {
    if (ref.current) setBoundingRect(ref.current.getBoundingClientRect());
  }, [ref]);
  useResize(ref, calcBoundingRect);
  useEffect(() => {
    const elm = ref.current;
    if (elm) {
      calcBoundingRect();
      window.addEventListener("resize", calcBoundingRect);
      return () => {
        window.removeEventListener("resize", calcBoundingRect);
      };
    }
  }, [ref, calcBoundingRect]);
  return bouncingRect;
};
export default useBoundingRect;
