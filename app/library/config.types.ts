export type Locale = "en" | "fa";
export type Lang = "en-US" | "fa-IR";
export type Dir = "ltr" | "rtl";
export type LocaleDetails = {
  value: Locale;
  dir: Dir;
  lang: Lang;
  text: string;
};
export type Theme = "light" | "dark";
export type Color = {
  lighten5?: string;
  lighten4?: string;
  lighten3?: string;
  lighten2?: string;
  lighten1?: string;
  main: string;
  darken1?: string;
  darken2?: string;
  darken3?: string;
  darken4?: string;
  darken5?: string;
};
export type Palette = {
  primary: Color;
  secondary: Color;
  accent: Color;
  success: Color;
  info: Color;
  error: Color;
  warning: Color;
  background: Color;
  card: Color;
  title: Color;
  text: Color;
  border: Color;
  divider: Color;
  disable: Color;
};
export type Breakpoint = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};
export type Font = {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  subtitle1: string;
  subtitle2: string;
  body1: string;
  body2: string;
  button: string;
  overline: string;
  caption: string;
};
export type LineHeight = Font;
export type LetterSpacing = Font;
export type FontWeight = {
  extralight: number;
  light: number;
  semilight: number;
  regular: number;
  medium: number;
  semibold: number;
  bold: number;
  extrabold: number;
  black: number;
};
export type FontSize = {
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing: string;
};
export type FontSizes = {
  h1: FontSize;
  h2: FontSize;
  h3: FontSize;
  h4: FontSize;
  h5: FontSize;
  h6: FontSize;
  subtitle1: FontSize;
  subtitle2: FontSize;
  body1: FontSize;
  body2: FontSize;
  button: FontSize;
  overline: FontSize;
  caption: FontSize;
};
export type BorderRadius = {
  none: string;
  xs: string;
  sm: string;
  DEFAULT: string;
  lg: string;
  xl: string;
  xl2: string;
  circle: string;
  full: string;
};
export type Spacing = {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xl2: string;
};
export type ZIndex = {
  n5: number;
  n4: number;
  n3: number;
  n2: number;
  n1: number;
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};
export type BoxShadow = {
  none: string;
  xs: string;
  sm: string;
  DEFAULT: string;
  lg: string;
  xl: string;
  xl2: string;
  full: string;
};

export type Config = {
  locales: LocaleDetails[],
  defaultLocale: Locale;
  themes: {
    defaultTheme: Theme;
    light: Palette;
    dark: Palette;
  };
  breakpoints: Breakpoint;
  fontSize: FontSizes;
  fontWeight: FontWeight;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
  borderRadius: BorderRadius;
  spacing: Spacing;
  zIndex: ZIndex;
  boxShadow: BoxShadow;
};
