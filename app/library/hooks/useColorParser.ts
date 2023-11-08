//Comp.tsx:
// const { theme, setTheme } = useTheme();
// const color = useColorParser("primary");
// <div className={`${theme === "dark" ? "bg-red-500" : "bg-blue-500"}`} /> //change via useTheme hook which itself uses theme context state
// <div className="bg-blue-500 dark:bg-red-500" /> //change via tailwind
// <div style={{backgroundColor: color}} /> //using useColorParser hook
// <div className="bg-primary-main" /> //best option ... always read 'main' variant of 'primary' color , when we change theme we automatically reload colors of new theme too
// <button onClick={() => setTheme((old) => (old === "dark" ? "light" : "dark"))}>click</button>

import { useState, useEffect, useMemo } from "react";
import useTheme from "./useTheme";
import tailwindColors from "tailwindcss/colors";
import config from "../config";
//pass 'transparent','white','red','rgb(255,0,0)','#f00','primary'(same as 'primary-main'),'secondary-lighten2','sky-500'

const {
  themes: { light, dark },
} = config;

const useColorParser = (color: string) => {
  const { theme } = useTheme();
  const [targetColor, setTargetColor] = useState("");
  const allColors = useMemo<Record<string, any>>(() => {
    let themeColors;
    if (theme === "light") themeColors = light;
    else themeColors = dark;
    return {
      ...tailwindColors,
      ...themeColors,
    };
  }, [theme]);
  useEffect(() => {
    const colorSplit = color?.split("-");
    const colorName: string = colorSplit[0];
    const colorVariant: string = colorSplit[1] || "main"; //default variant is 'main' e.g when we pass 'primary' its same as 'primary-main'
    const newColor =
      allColors[colorName]?.[colorVariant] || color || "transparent";
    setTargetColor(newColor);
  }, [color, allColors]);
  return targetColor;
};
export default useColorParser;
