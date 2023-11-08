//if instead of context we use simple hook for it then whenever we use it we have separate theme state but now that we used context we have one theme for entire app
//for using inside layout file of next.js --> first we should use it inside another file that has 'use client':
// /app/context/Theme:
//     "use client";
//     export { default } from "@/app/library/context/Theme"; //current file
// /app/layout:
//     import ThemeProvider from "@/app/context/Theme";
//     <html>
//        <body className='bg-background-main'>
//          <ThemeProvider  ThemeProvider> <main>{children}</main> </ThemeProvider>
//        </body>
//     </html>
//Comp.tsx:
// const { theme, setTheme } = useTheme();
// <div className={`${theme === "dark" ? "bg-red-500" : "bg-blue-500"}`} /> //change via useTheme hook which itself used theme context state
// <button onClick={() => setTheme((old) => (old === "dark" ? "light" : "dark"))}>click</button>

import React, { useState, useEffect, createContext } from "react";
import useCookie from "../hooks/useCookie";
import useMediaQuery from "../hooks/useMediaQuery";
import config from "../config";
import type { Theme } from "../config.types";

const {
  themes: { defaultTheme },
} = config;

type Context = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};
type Provider = {
  children: React.ReactNode;
};

export const ThemeContext = createContext<Context>({
  theme: defaultTheme,
  setTheme: () => {},
});
const ThemeProvider = ({ children }: Provider) => {
  const { cookie, updateCookie } = useCookie("theme", defaultTheme);
  const preferDark = useMediaQuery("(prefers-color-schema: dark)");
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  useEffect(() => {
    //read from cookie , ... and set theme
    //cookie has highest priority then user prefer system theme and at last we use DEFAULT_THEME
    let newTheme: Theme;
    if (cookie === "light" || cookie === "dark") newTheme = cookie;
    else if (preferDark) newTheme = "dark";
    else newTheme = defaultTheme;
    setTheme(newTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    //whenever we update theme change css class + update cookie
    const lightCssClass = ["light", "theme-light"];
    const darkCssClass = ["dark", "theme-dark"];
    const addClass = theme === "light" ? lightCssClass : darkCssClass;
    const removeClass = theme === "light" ? darkCssClass : lightCssClass;
    updateCookie(theme, {
      path: "/",
      expires: 365,
    });
    document.documentElement.classList.add(...addClass);
    document.documentElement.classList.remove(...removeClass);
  }, [theme, updateCookie]);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeProvider;
