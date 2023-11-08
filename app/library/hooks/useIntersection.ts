// const config = {threshold: 0.2,once: false,};
// const section1 = useRef(null!);
// const section2 = useRef(null!);
// const isSection1Intersected = useIntersection(section1, config);
// const isSection2Intersected = useIntersection(section2, config);
// <div ref={section1}
//     className={`h-[75vh] w-full bg-slate-300 transition-all duration-500 ease-in-out ${ isSection1Intersected? "opacity-1 translate-y-0": "translate-y-10 opacity-0"}`}
// ></div>
// <div className="h-[125vh]"></div>
// <div ref={section2}
//     className={`h-[75vh] w-full bg-slate-300 transition-all duration-500 ease-in-out ${ isSection2Intersected? "opacity-1 translate-y-0": "translate-y-10 opacity-0"}`}
// ></div>
import { useState, useEffect } from "react";

type IntersectionArgs = {
  root?: HTMLElement;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
};
const useIntersection = (
  ref: React.MutableRefObject<any>,
  { root, rootMargin, threshold = 0, once = true }: IntersectionArgs = {
    threshold: 0,
    once: true,
  }
) => {
  const [isIntersection, setIsIntersection] = useState(false);
  useEffect(() => {
    if (ref.current) {
      const elm = ref.current;
      const io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsIntersection(true);
              if (once) observer.disconnect();
            } else {
              setIsIntersection(false);
            }
          });
        },
        { root, rootMargin, threshold }
      );
      io.observe(elm);
      return () => {
        io.disconnect();
      };
    }
  }, [once, threshold, root, rootMargin, ref]);
  return isIntersection;
};
export default useIntersection;
