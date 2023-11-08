// const isMobile = useMediaQuery("(max-width:600px)"); //@media (max-width: 600px)
// const isMobile = useMediaQuery("(width<600px)"); //@media (width<600px)
// const isTablet = useMediaQuery("(min-width:600px) and (max-width:1000px)"); //@media (min-width: 600px) and (max-width: 1000px)
// const isTablet = useMediaQuery("(600px<width<1000px)"); //@media (600px<width<1000px)

import { useCallback, useEffect, useState } from "react";

const useMediaQuery = (mediaQuery: string) => {
  const [isMatch, setIsMatch] = useState(false);
  const mediaQueryChangeHandler = useCallback((e: MediaQueryListEvent) => {
    setIsMatch(e.matches);
  }, []);
  useEffect(() => {
    const list = window.matchMedia(mediaQuery);
    setIsMatch(list.matches);
    list.addEventListener("change", mediaQueryChangeHandler);
    return () => {
      list.removeEventListener("change", mediaQueryChangeHandler);
    };
  }, [mediaQuery, mediaQueryChangeHandler]);
  return isMatch;
};
export default useMediaQuery;
