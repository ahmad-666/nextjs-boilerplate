import { useEffect, useCallback } from "react";

const useClickOutside = (
  elRef: React.MutableRefObject<HTMLElement>,
  cb: (e: MouseEvent) => void
) => {
  //we pass ref to this hook , not ref.current
  //we should not use state for isOutside and use callback because we don't to return any value at init and we only want to do something after we clicked outside of elm
  const clickHandler = useCallback(
    (e: MouseEvent) => {
      const clickedElm = e.target as HTMLElement;
      if (elRef?.current && !elRef.current.contains(clickedElm)) cb(e);
    },
    [elRef, cb]
  );
  useEffect(() => {
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [clickHandler]);
};
export default useClickOutside;
