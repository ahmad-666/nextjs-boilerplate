//its not equal to resize event on window and its resize event on element itself and for any resize on element it will recalculate all values automatically
//base on condition we should decide between:
// 1-getBoundingClientRect() + 'resize' event on window
// 2-resizeObserver on element itself
//resize observer contentRect will return  {width,height,top,right,bottom,left,x,y}
//width,height are only width,height of content of element means padding,border-width excluded from them
//top is distance from top of content of element to top of element itself , bottom is distance from bottom of content of element to top of element itself
//left is distance from left of content of element to left of element itself , right is distance from right of content of element to left of element itself

import { useState, useEffect } from "react";

const useResize = (
  ref: React.MutableRefObject<HTMLElement>,
  cb?: (newSizes: DOMRectReadOnly) => void //will execute on anytime resize observer execute
) => {
  const [resize, setResize] = useState<
    Record<string, number> | DOMRectReadOnly
  >({});
  useEffect(() => {
    const elm = ref.current;
    if (elm) {
      const observer = new ResizeObserver((entries, observer) => {
        const target = entries[0];
        if (target) {
          const newSizes = target.contentRect;
          setResize(newSizes);
          if (cb) cb(newSizes);
        } else {
          setResize({});
          observer.disconnect();
        }
      });
      observer.observe(elm);
      return () => {
        observer.disconnect();
      };
    }
  }, [ref, cb]);
  return resize;
};
export default useResize;
