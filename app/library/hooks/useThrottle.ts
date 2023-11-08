// const [pos, setPos] = useState(0);
// const throttlePos = useThrottle(pos, 50);
// useEffect(() => {
//   window.addEventListener("mousemove", (e) => {setPos(e.x);});
// }, []);
// <h1>{throttlePos}</h1>

import { useCallback, useEffect, useRef, useState } from "react";

const useThrottle = (value: any, delay: number = 100) => {
  const [throttleValue, setThrottleValue] = useState<any>(null);
  const timerId = useRef<NodeJS.Timer>();
  const lastTime = useRef(Date.now());
  const clearTimer = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
  }, []);
  useEffect(() => {
    //not use setInterval because each time any dependency changes we execute it
    if (Date.now() > lastTime.current + delay) {
      //if enough time passed since last timer(this condition make we update throttle value in 'delay' interval or for the first time after long pause)
      lastTime.current = Date.now();
      setThrottleValue(value);
    } else {
      timerId.current = setTimeout(() => {
        lastTime.current = Date.now();
        setThrottleValue(value);
      }, delay);
      return () => {
        //this useEffect will be executed any time any dependency changes so we need to clearTimer each time
        clearTimer();
      };
    }
  }, [clearTimer, delay, value]);
  return throttleValue;
};
export default useThrottle;
