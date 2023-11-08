// const { theme, setTheme } = useTheme();
// const color = useColorParser("primary");
// <div className={`${theme === "dark" ? "bg-red-500" : "bg-blue-500"}`} /> //change via useTheme hook which itself uses theme context state
// <div className="bg-blue-500 dark:bg-red-500" /> //change via tailwind
// <div style={{backgroundColor: color}} /> //using useColorParser hook
// <div className="bg-primary-main" /> //best option ... always read 'main' variant of 'primary' color , when we change theme we automatically reload colors of new theme too
// <button onClick={() => setTheme((old) => (old === "dark" ? "light" : "dark"))}>click</button>

const colors = require("tailwindcss/colors");
import type { Theme, Palette } from "../library/config.types";

export const DEFAULT_THEME: Theme = "light";
export const light: Palette = {
  primary: {
    lighten2: colors.sky[300],
    lighten1: colors.sky[500],
    main: colors.sky[600],
    darken1: colors.sky[700],
    darken2: colors.sky[900],
  },
  secondary: {
    lighten2: colors.pink[300],
    lighten1: colors.pink[500],
    main: colors.pink[600],
    darken1: colors.pink[700],
    darken2: colors.pink[900],
  },
  accent: {
    lighten2: colors.amber[300],
    lighten1: colors.amber[500],
    main: colors.amber[600],
    darken1: colors.amber[700],
    darken2: colors.amber[900],
  },
  success: {
    lighten2: colors.teal[300],
    lighten1: colors.teal[400],
    main: colors.teal[500],
    darken1: colors.teal[600],
    darken2: colors.teal[700],
  },
  info: {
    lighten2: colors.sky[300],
    lighten1: colors.sky[400],
    main: colors.sky[500],
    darken1: colors.sky[600],
    darken2: colors.sky[700],
  },
  error: {
    lighten2: colors.red[400],
    lighten1: colors.red[500],
    main: colors.red[600],
    darken1: colors.red[700],
    darken2: colors.red[800],
  },
  warning: {
    lighten2: colors.pink[400],
    lighten1: colors.pink[500],
    main: colors.pink[600],
    darken1: colors.pink[700],
    darken2: colors.pink[800],
  },
  background: {
    lighten2: colors.white,
    lighten1: colors.white,
    main: colors.white,
    darken1: colors.slate[200],
    darken2: colors.slate[300],
  },
  card: {
    lighten2: colors.slate[50],
    lighten1: colors.slate[100],
    main: colors.slate[200],
    darken1: colors.slate[300],
    darken2: colors.slate[400],
  },
  title: {
    lighten2: colors.slate[600],
    lighten1: colors.slate[700],
    main: colors.slate[800],
    darken1: colors.slate[900],
    darken2: colors.slate[950],
  },
  text: {
    lighten2: colors.slate[500],
    lighten1: colors.slate[600],
    main: colors.slate[700],
    darken1: colors.slate[800],
    darken2: colors.slate[900],
  },
  border: {
    lighten2: colors.slate[200],
    lighten1: colors.slate[300],
    main: colors.slate[400],
    darken1: colors.slate[500],
    darken2: colors.slate[600],
  },
  divider: {
    lighten2: colors.slate[100],
    lighten1: colors.slate[200],
    main: colors.slate[300],
    darken1: colors.slate[400],
    darken2: colors.slate[500],
  },
  disable: {
    lighten2: colors.slate[100],
    lighten1: colors.slate[200],
    main: colors.slate[300],
    darken1: colors.slate[400],
    darken2: colors.slate[500],
  },
};
export const dark: Palette = {
  primary: {
    lighten2: colors.sky[300],
    lighten1: colors.sky[500],
    main: colors.sky[600],
    darken1: colors.sky[700],
    darken2: colors.sky[900],
  },
  secondary: {
    lighten2: colors.pink[300],
    lighten1: colors.pink[500],
    main: colors.pink[600],
    darken1: colors.pink[700],
    darken2: colors.pink[900],
  },
  accent: {
    lighten2: colors.amber[300],
    lighten1: colors.amber[500],
    main: colors.amber[600],
    darken1: colors.amber[700],
    darken2: colors.amber[900],
  },
  success: {
    lighten2: colors.teal[300],
    lighten1: colors.teal[400],
    main: colors.teal[500],
    darken1: colors.teal[600],
    darken2: colors.teal[700],
  },
  info: {
    lighten2: colors.sky[300],
    lighten1: colors.sky[400],
    main: colors.sky[500],
    darken1: colors.sky[600],
    darken2: colors.sky[700],
  },
  error: {
    lighten2: colors.red[400],
    lighten1: colors.red[500],
    main: colors.red[600],
    darken1: colors.red[700],
    darken2: colors.red[800],
  },
  warning: {
    lighten2: colors.pink[400],
    lighten1: colors.pink[500],
    main: colors.pink[600],
    darken1: colors.pink[700],
    darken2: colors.pink[800],
  },
  background: {
    lighten2: colors.slate[500],
    lighten1: colors.slate[600],
    main: colors.slate[700],
    darken1: colors.slate[800],
    darken2: colors.slate[900],
  },
  card: {
    lighten2: colors.slate[50],
    lighten1: colors.slate[500],
    main: colors.slate[600],
    darken1: colors.slate[700],
    darken2: colors.slate[800],
  },
  title: {
    lighten2: colors.slate[50],
    lighten1: colors.slate[100],
    main: colors.slate[200],
    darken1: colors.slate[300],
    darken2: colors.slate[400],
  },
  text: {
    lighten2: colors.slate[50],
    lighten1: colors.slate[100],
    main: colors.slate[200],
    darken1: colors.slate[300],
    darken2: colors.slate[400],
  },
  border: {
    lighten2: colors.slate[200],
    lighten1: colors.slate[300],
    main: colors.slate[400],
    darken1: colors.slate[500],
    darken2: colors.slate[600],
  },
  divider: {
    lighten2: colors.slate[300],
    lighten1: colors.slate[400],
    main: colors.slate[500],
    darken1: colors.slate[600],
    darken2: colors.slate[700],
  },
  disable: {
    lighten2: colors.slate[300],
    lighten1: colors.slate[400],
    main: colors.slate[500],
    darken1: colors.slate[600],
    darken2: colors.slate[700],
  },
};
