//E.g if we want 2days,5hours,10minutes,45seconds we should pass (2*24*60*60)+(5*60*60)+(10*60)+(45) as arg
//use this hook if we want to know value in seconds units consist of how many days,hours,minutes,seconds
//we don't return any month,year because each month can have different number of days
//const {minutes,seconds} = useSecondNormalizer(182) //minute is 3 and seconds is 2
//timer using this hook:
// const timerId = useRef<NodeJS.Timer>();
// const [totalSeconds, setTotalSeconds] = useState(180); //3minutes
// const {minutes = 0,seconds = 0,} = useSecondNormalize(totalSeconds);
// const isReachEnd = useMemo(() => {return totalSeconds <= 0;}, [totalSeconds]);
// useEffect(() => {
//   clearInterval(timerId.current) //clear old timer
//   timerId.current = setInterval(() => {
//     if (isReachEnd) clearInterval(timerId.current);
//     else setTotalSeconds((old) => old - 1);
//   }, 1000);
//   return () => {clearInterval(timerId.current);};
// }, [isReachEnd]);
// <h1>{minutes}:{seconds}</h1>

import { useState, useEffect, useCallback } from "react";

type Time = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};
export const DAY_SECONDS = 24 * 60 * 60; //1day has this many seconds
export const HOUR_SECONDS = 60 * 60; //1hour has this many seconds
export const MINUTE_SECONDS = 60; //1minute has this many seconds\
const useSecondNormalize = (val: number) => {
  const [time, setTime] = useState<Time>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const calcResult = useCallback(() => {
    let days = 0,
      hours = 0,
      minutes = 0,
      seconds = 0;
    days = Math.floor(val / DAY_SECONDS);
    hours = Math.floor((val % DAY_SECONDS) / HOUR_SECONDS);
    minutes = Math.floor(((val % DAY_SECONDS) % HOUR_SECONDS) / MINUTE_SECONDS);
    seconds = ((val % DAY_SECONDS) % HOUR_SECONDS) % MINUTE_SECONDS;
    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }, [val]);
  useEffect(() => {
    const { days, hours, minutes, seconds } = calcResult();
    setTime({
      days,
      hours,
      minutes,
      seconds,
    });
  }, [calcResult]);

  return time;
};
export default useSecondNormalize;
