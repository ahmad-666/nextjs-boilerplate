import { useCallback, useEffect, useRef, useState } from "react";
type SwipeDirectionArgs = {
  threshold?: number;
};
type Direction = "left" | "right" | "top" | "bottom";
type Coord = {
  x: number;
  y: number;
};
const useSwipeDirection = (
  ref: React.MutableRefObject<HTMLElement>,
  { threshold = 0 }: SwipeDirectionArgs = { threshold: 0 }
) => {
  const [direction, setDirection] = useState<Direction>();
  const startCoords = useRef<Coord>({ x: 0, y: 0 });
  const endCoords = useRef<Coord>({ x: 0, y: 0 });
  const findDirection = useCallback(() => {
    const diffX = endCoords.current.x - startCoords.current.x;
    const diffY = endCoords.current.y - startCoords.current.y;
    if (Math.abs(diffX) >= threshold && Math.abs(diffX) > Math.abs(diffY)) {
      setDirection(diffX >= 0 ? "right" : "left");
    } else if (
      Math.abs(diffY) >= threshold &&
      Math.abs(diffY) > Math.abs(diffX)
    ) {
      setDirection(diffY >= 0 ? "bottom" : "top");
    }
  }, [threshold]);
  const dragStartHandler = useCallback((e: MouseEvent | TouchEvent) => {
    if (e.type === "mousedown") {
      const event = e as MouseEvent;
      const { clientX, clientY } = event;
      startCoords.current.x = clientX;
      startCoords.current.y = clientY;
    } else if (e.type === "touchstart") {
      const event = e as TouchEvent;
      const { clientX, clientY } = event.touches[0];
      startCoords.current.x = clientX;
      startCoords.current.y = clientY;
    }
  }, []);
  const dragEndHandler = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (e.type === "mouseup") {
        const event = e as MouseEvent;
        const { clientX, clientY } = event;
        endCoords.current.x = clientX;
        endCoords.current.y = clientY;
      } else if (e.type === "touchend") {
        const event = e as TouchEvent;
        const { clientX, clientY } = event.touches[0];
        endCoords.current.x = clientX;
        endCoords.current.y = clientY;
      }
      findDirection();
    },
    [findDirection]
  );
  useEffect(() => {
    if (ref.current) {
      const elm = ref.current;
      elm.addEventListener("mousedown", dragStartHandler);
      elm.addEventListener("touchstart", dragStartHandler);
      elm.addEventListener("mouseup", dragEndHandler);
      elm.addEventListener("touchend", dragEndHandler);
      return () => {
        elm.removeEventListener("mousedown", dragStartHandler);
        elm.removeEventListener("touchstart", dragStartHandler);
        elm.removeEventListener("mouseup", dragEndHandler);
        elm.removeEventListener("touchend", dragEndHandler);
      };
    }
  }, [ref, dragStartHandler, dragEndHandler]);
  return direction;
};
export default useSwipeDirection;
