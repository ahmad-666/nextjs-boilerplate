//with useCookie we only get client-side cookie
// Example:
// const { cookie, updateCookie, deleteCookie } = useCookie("my-cookie", "init-value");
// for only get cookie use useCookie("my-cookie")
// const { cookie:anotherCookie, updateCookie:updateAnotherCookie, deleteCookie:DeleteAnotherCookie } = useCookie("another-cookie", "another-init-value");
// <button onClick={() => {updateCookie("new-value")}}>update</button>
// <button onClick={() => {deleteCookie()}}>delete</button>
// with this cookie value will persist on window refresh

import { useState, useCallback } from "react";
import Cookie from "js-cookie";
import type { CookieAttributes } from "js-cookie";
const DEFAULT_OPTIONS = {
  expires: 365,
  path: "/",
};
const useCookie = (
  name: string,
  initVal?: string,
  options: CookieAttributes = DEFAULT_OPTIONS
) => {
  const [cookie, setCookie] = useState(() => {
    const currCookie = Cookie.get(name);
    if (currCookie) {
      return currCookie; //if we already have value we don't care about initVal at all(we want cookie to persist)
    } else if (initVal) {
      Cookie.set(name, initVal, options);
      return initVal;
    }
  });
  const updateCookie = useCallback(
    (newValue: string, newOptions: CookieAttributes = DEFAULT_OPTIONS) => {
      Cookie.set(name, newValue, newOptions);
      setCookie(newValue);
    },
    [name]
  );
  const deleteCookie = useCallback(() => {
    Cookie.remove(name);
    setCookie("");
  }, [name]);
  return {
    cookie,
    updateCookie,
    deleteCookie,
  };
};
export default useCookie;
