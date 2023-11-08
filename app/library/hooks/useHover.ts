import { useCallback, useEffect, useState } from "react";
const useHover = (elm: React.MutableRefObject<HTMLElement>) => {
  const [isHover, setIsHover] = useState(false);
  const hoverStart = useCallback(() => {
    setIsHover(true);
  }, []);
  const hoverEnd = useCallback(() => {
    setIsHover(false);
  }, []);
  useEffect(() => {
    const target = elm.current;
    if (target) {
      target.addEventListener("mouseenter", hoverStart);
      target.addEventListener("mouseleave", hoverEnd);
      target.addEventListener("touchstart", hoverStart);
      target.addEventListener("touchend", hoverEnd);
      return () => {
        target.removeEventListener("mouseenter", hoverStart);
        target.removeEventListener("mouseleave", hoverEnd);
        target.removeEventListener("touchstart", hoverStart);
        target.removeEventListener("touchend", hoverEnd);
      };
    }
  }, [hoverStart, hoverEnd, elm]);
  return isHover;
};
export default useHover;
