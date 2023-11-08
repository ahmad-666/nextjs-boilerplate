// const [search, setSearch] = useState("");
// const debounceSearch = useDebounce(search);
// useEffect(() => {
//     if (debounceSearch !== null) {
//         //do something with debounceSearch
//     }
// }, [debounceSearch]);
// <input value={search} onChange={(e) => setSearch(e.target.value)} />

import { useState, useEffect, useRef, useCallback } from "react";

const useDebounce = (value: any, delay: number = 1000) => {
  const [debounceValue, setDebounceValue] = useState<any>(null);
  const timerId = useRef<NodeJS.Timer>();
  const clearTimer = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
  }, []);
  useEffect(() => {
    clearTimer(); //we could omit this line because for each useEffect first we clear timer inside 'return' statement then execute new useEffect
    timerId.current = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimer();
    };
  }, [value, delay, clearTimer]);
  return debounceValue;
};
export default useDebounce;
