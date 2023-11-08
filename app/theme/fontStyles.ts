import type {
  FontSizes,
  FontWeight,
  LineHeight,
  LetterSpacing,
} from "../library/config.types";

export const root = "16px"; //inside global.scss we should have -->
//:root {font-size: 16px !important;} body {font-size: 1rem !important;}
export const fontWeight: FontWeight = {
  extralight: 100,
  light: 200,
  semilight: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};
export const lineHeight: LineHeight = {
  h1: "6rem",
  h2: "4.5rem",
  h3: "4em",
  h4: "3.5rem",
  h5: "2.75rem",
  h6: "2.25rem",
  subtitle1: "1.35rem",
  subtitle2: "1.25rem",
  body1: "1.25rem",
  body2: "1rem",
  caption: "1.2rem",
  button: "1.2rem",
  overline: "1rem",
};
export const letterSpacing: LetterSpacing = {
  h1: ".25rem",
  h2: ".2rem",
  h3: ".17rem",
  h4: ".1rem",
  h5: ".08rem",
  h6: ".05rem",
  subtitle1: ".02rem",
  subtitle2: ".01rem",
  body1: ".01rem",
  body2: ".01rem",
  caption: ".015rem",
  button: ".075rem",
  overline: ".03rem",
};
export const fontSize: FontSizes = {
  h1: {
    fontSize: "5rem",
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.h1,
    letterSpacing: letterSpacing.h1,
  },
  h2: {
    fontSize: "4rem",
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.h2,
    letterSpacing: letterSpacing.h2,
  },
  h3: {
    fontSize: "3.5rem",
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.h3,
    letterSpacing: letterSpacing.h3,
  },
  h4: {
    fontSize: "3rem",
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.h4,
    letterSpacing: letterSpacing.h4,
  },
  h5: {
    fontSize: "2.5rem",
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.h5,
    letterSpacing: letterSpacing.h5,
  },
  h6: {
    fontSize: "2rem",
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.h6,
    letterSpacing: letterSpacing.h6,
  },
  subtitle1: {
    fontSize: "1.25rem",
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.subtitle1,
    letterSpacing: letterSpacing.subtitle1,
  },
  subtitle2: {
    fontSize: "1.15rem",
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.subtitle2,
    letterSpacing: letterSpacing.subtitle2,
  },
  body1: {
    fontSize: "1rem",
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.body1,
    letterSpacing: letterSpacing.body1,
  },
  body2: {
    fontSize: ".8rem",
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.body2,
    letterSpacing: letterSpacing.body2,
  },
  caption: {
    fontSize: ".7rem",
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.caption,
    letterSpacing: letterSpacing.caption,
  },
  button: {
    fontSize: ".9rem",
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.button,
    letterSpacing: letterSpacing.button,
  },
  overline: {
    fontSize: ".8rem",
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.overline,
    letterSpacing: letterSpacing.overline,
  },
};
