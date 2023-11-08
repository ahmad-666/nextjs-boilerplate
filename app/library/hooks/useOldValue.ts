//for store and retrieve old value of state we can use useRef
// const [count, setCount] = useState(1);
// const oldCount = useOldValue(count);
// <h1>count:{count}</h1>
// <h1>oldCount:{oldCount.current}</h1>
// <button onClick={() => setCount((old) => old + 1)}>add</button>
//anytime count state changes we have re-render but because with each oldCount change we don't have any re-render we always get its old value

import { useEffect, useRef } from "react";

const useOldValue = (state: any) => {
  const oldValue = useRef<any>(state);
  useEffect(() => {
    oldValue.current = state; //whenever state updates we pass new value to ref , when ref changes we don't have any re-render , so we see old value of ref while we have new value in ref
  }, [state]);
  return oldValue;
};
export default useOldValue;
