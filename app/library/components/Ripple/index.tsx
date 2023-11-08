import { useState, useEffect, useCallback } from "react";
import useColorParser from "../../hooks/useColorParser";
import useBoundingRect from "../../hooks/useBoundingRect";
import "./styles.scss";

export type RippleProps = {
  refElm: React.MutableRefObject<HTMLElement>;
  debounce?: number;
  color?: string;
};
export type Ripple = {
  width: number;
  height: number;
  left: number;
  top: number;
};

//refElm element must have position:relative,overflow:hidden
export default function Ripple({
  refElm,
  debounce = 1000,
  color = "primary",
}: RippleProps) {
  const parsedColor = useColorParser(color);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const { width = 0, height = 0, left = 0, top = 0 } = useBoundingRect(refElm);
  const addRipple = useCallback(
    (e: MouseEvent) => {
      const x = Math.round(e.clientX - left);
      const y = Math.round(e.clientY - top);
      const size = Math.round(Math.max(width, height));
      setRipples((old) => [
        ...old,
        {
          width: size,
          height: size,
          left: x - size / 2,
          top: y - size / 2,
        },
      ]);
    },
    [width, height, left, top]
  );
  useEffect(() => {
    const elm = refElm.current;
    if (elm) {
      elm.addEventListener("click", (e) => addRipple(e));
      return () => {
        elm.removeEventListener("click", (e) => addRipple(e));
      };
    }
  }, [addRipple, refElm]);
  useEffect(() => {
    const timerId = setTimeout(() => {
      setRipples([]);
    }, debounce);
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [debounce, ripples.length]);
  return (
    <>
      {ripples.map((ripple, i) => (
        <span
          className="animate-ripple pointer-events-none absolute scale-0 rounded-circle opacity-0"
          key={i}
          style={{ backgroundColor: parsedColor, ...ripple }}
        ></span>
      ))}
    </>
  );
}
