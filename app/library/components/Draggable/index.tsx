//we can create draggable section via 'scrollLeft','scrollTop' or via translate(x,y)
//anytime we want draggable we can use swiper

import { useState, useRef, useMemo, useCallback, forwardRef } from "react";
import useBoundingRect from "../../hooks/useBoundingRect";
import useLocaleDetails from "../../hooks/useLocaleDetails";

export type Dir = "horizontal" | "vertical";
export type DraggableProps = {
  dir?: Dir;
  disabled?: boolean;
  speed?: number;
  children: React.ReactNode;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  className?: string;
};

const Draggable = (
  {
    dir = "horizontal",
    disabled = false,
    speed = 1,
    children,
    containerClassName = "",
    containerStyle,
    className = "",
  }: DraggableProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const { dir: localeDir } = useLocaleDetails();
  const container = useRef<HTMLDivElement>(null!);
  const [dragging, setDragging] = useState(false);
  const [isBeforeStart, setIsBeforeStart] = useState(false); //for reset drag pos to starting point
  const [isAfterEnd, setIsAfterEnd] = useState(false); //for reset drag pos to ending point
  const dragStartPos = useRef(0); //position of where we start dragging action
  const draggingPos = useRef(0); //final position of drag
  const latestPos = useRef(0); //for prevent jump effect
  const { left, top, width, height } = useBoundingRect(container);
  const localeMultiplier = useMemo(() => {
    return localeDir === "ltr" ? 1 : -1;
  }, [localeDir]);
  const dragContainer = useCallback(() => {
    container.current.style.setProperty(
      "transform",
      `translate(${
        dir === "horizontal" ? localeMultiplier * draggingPos.current : 0
      }px,${dir === "vertical" ? draggingPos.current : 0}px)`
    );
  }, [dir, localeMultiplier]);
  const dragStartHandler = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      let start = 0;
      setDragging(true);
      if (e.type === "mousedown") {
        const event = e as React.MouseEvent<HTMLDivElement>;
        event.preventDefault();
        const { clientX, clientY } = event;
        start = dir === "horizontal" ? clientX : clientY;
      } else if (e.type === "touchstart") {
        const event = e as React.TouchEvent<HTMLDivElement>;
        const { touches } = event;
        start = dir === "horizontal" ? touches[0].clientX : touches[0].clientY;
      }
      dragStartPos.current = start - (dir === "horizontal" ? left : top);
      const transform = container.current.style.getPropertyValue("transform"); //something like translate(10px, 10px)
      const normalizeTransform = transform.replace(/[translate(,)px]/g, ""); //something like '10 10'
      const splitTransform = normalizeTransform.split(" ");
      const translateX = +splitTransform[0] || 0;
      const translateY = +splitTransform[1] || 0;
      latestPos.current =
        dir === "horizontal" ? localeMultiplier * translateX : translateY;
    },
    [dir, left, top, localeMultiplier]
  );
  const draggingHandler = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      if (dragging) {
        let latest = 0;
        if (e.type === "mousemove") {
          const event = e as React.MouseEvent<HTMLDivElement>;
          event.preventDefault();
          const { clientX, clientY } = event;
          latest = dir === "horizontal" ? clientX : clientY;
        } else if (e.type === "touchmove") {
          const event = e as React.TouchEvent<HTMLDivElement>;
          const { changedTouches } = event;
          latest =
            dir === "horizontal"
              ? changedTouches[0].clientX
              : changedTouches[0].clientY;
        }
        const movement =
          latestPos.current +
          (latest -
            (dir === "horizontal" ? left : top) -
            dragStartPos.current) *
            speed;
        const startingPoint = 0;
        const endingPoint =
          -1 *
          (dir === "horizontal"
            ? container.current.scrollWidth - width
            : container.current.scrollHeight - height);
        setIsBeforeStart(movement > startingPoint);
        setIsAfterEnd(movement < endingPoint);
        draggingPos.current = movement;
        dragContainer();
      }
    },
    [dragging, dir, left, top, speed, width, height, dragContainer]
  );
  const dragEndHandler = useCallback(() => {
    setDragging(false);
    if (isBeforeStart || isAfterEnd) {
      if (isBeforeStart) draggingPos.current = 0;
      else {
        draggingPos.current =
          -1 *
          (dir === "horizontal"
            ? container.current.scrollWidth - width
            : container.current.scrollHeight - height);
      }
      dragContainer();
      setTimeout(() => {
        setIsBeforeStart(false);
        setIsAfterEnd(false);
      }, 200);
    }
  }, [dir, dragContainer, height, isAfterEnd, isBeforeStart, width]);
  return (
    <div
      onMouseDown={dragStartHandler}
      onMouseMove={draggingHandler}
      onMouseUp={dragEndHandler}
      onMouseLeave={dragEndHandler}
      onTouchStart={dragStartHandler}
      onTouchMove={draggingHandler}
      onTouchEnd={dragEndHandler}
      className={`overflow-hidden ${disabled ? "pointer-events-none" : ""} ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
    >
      <div
        ref={(elm) => {
          if (elm) {
            container.current = elm;
            if (ref)
              (ref as React.MutableRefObject<HTMLDivElement>).current = elm;
          }
        }}
        className={`flex ${dir === "horizontal" ? "flex-row" : "flex-col"} ${
          isBeforeStart || isAfterEnd
            ? "transition-transform duration-200 ease-linear"
            : ""
        } ${containerClassName}`}
        style={{
          ...containerStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};
export default forwardRef(Draggable);
