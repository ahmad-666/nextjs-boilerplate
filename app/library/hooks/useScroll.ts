// 1-pure css smooth scroll:
// html{scroll-behavior: smooth;scroll-padding-top: 4rem;}
// tailwind --> <html className="scroll-pt-16 scroll-smooth">
//2-scrollTo: window.scrollTo({behavior:'smooth',top: 100})
//3-scrollIntoView: elm.scrollIntoView({behavior:'smooth'});
//Example:
// const scroll = useScroll();
// useEffect(() => {scroll("#target");}, [scroll]);
// <div id="target"></div>

import { useCallback } from "react";

type Target = number | string | React.MutableRefObject<HTMLElement>;
//target can be css selector , simple position number or ref element
type Config = {
  offset?: number;
  smooth?: boolean;
};
const useScroll = () => {
  const getScrollPos = useCallback((target: Target, offset: number) => {
    if (typeof target === "number") return target + offset;
    else if (typeof target === "string") {
      const elm = document.querySelector(target);
      if (elm) return window.scrollY + elm.getBoundingClientRect().top + offset;
    } else
      return (
        window.scrollY + target.current.getBoundingClientRect().top + offset
      );
  }, []);
  const scroll = useCallback(
    (
      target: Target,
      { offset = 0, smooth = true }: Config = {
        offset: 0,
        smooth: true,
      }
    ) => {
      const scrollPos = getScrollPos(target, offset);
      window.scrollTo({
        top: scrollPos,
        behavior: smooth ? "smooth" : "instant",
      });
    },
    [getScrollPos]
  );
  return scroll;
};
export default useScroll;
