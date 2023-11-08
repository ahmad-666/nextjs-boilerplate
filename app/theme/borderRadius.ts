import type { BorderRadius } from "../library/config.types";

const borderRadius: BorderRadius = {
  none: "0",
  xs: ".25rem",
  sm: ".5rem",
  DEFAULT: "1rem", //use Default for tailwind e.g instead of 'rounded-md' we use 'rounded'
  lg: "1.5rem",
  xl: "3rem",
  xl2: "5rem",
  circle: "50%",
  full: "9999px",
};
export default borderRadius;
