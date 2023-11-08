//no need for any dayjs
//we only get total number of seconds as arg e.g for 3minute,2second timer we pass 182 as arg
// const {
//   totalSeconds,result: { minutes = 0, seconds = 0 },isReachEnd,startTimer,stopTimer,resetTimer,
// } = useTimer(2);
{
  /*
  <ClientOnly>
    <h1>{totalSeconds}</h1>
    <h1>{minutes}:{seconds}</h1>
  </ClientOnly>
  <button onClick={() => startTimer()}>start</button>
  <button onClick={() => stopTimer()}>stop</button>
  {isReachEnd && <button onClick={() => resetTimer()}>reset</button>}
  */
}

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import useSecondNormalize from "./useSecondNormalize";

const useTimer = (initSeconds: number) => {
  const [totalSeconds, setTotalSeconds] = useState(initSeconds);
  const timerId = useRef<null | NodeJS.Timer>(null); //for timerId we must use ref , if use state maybe we face infinite loop
  const {
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
  } = useSecondNormalize(totalSeconds);
  const isReachEnd = useMemo(() => {
    return totalSeconds <= 0;
  }, [totalSeconds]);
  const stopTimer = useCallback(() => {
    if (timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
  }, []);
  const startTimer = useCallback(() => {
    stopTimer(); //first clear any old timer
    timerId.current = setInterval(() => {
      if (isReachEnd) stopTimer();
      else setTotalSeconds((old) => old - 1);
    }, 1000);
  }, [isReachEnd, stopTimer]);
  const resetTimer = useCallback(() => {
    setTotalSeconds(initSeconds);
    startTimer();
  }, [initSeconds, startTimer]);
  useEffect(() => {
    startTimer();
    return () => {
      stopTimer();
    };
  }, [startTimer, stopTimer]);
  return {
    totalSeconds,
    result: {
      days,
      hours,
      minutes,
      seconds,
    },
    startTimer,
    stopTimer,
    resetTimer,
    isReachEnd,
  };
};
export default useTimer;
