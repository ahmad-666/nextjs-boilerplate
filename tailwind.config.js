/** @type {import('tailwindcss').Config} */
import { createThemes } from "tw-colors";
import libraryConfig from "./app/library/config.ts";
const {
  breakpoints,
  themes,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  borderRadius,
  spacing,
  zIndex,
  boxShadow,
} = libraryConfig;

const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: `${breakpoints.sm}px`, //@media (min-width: 600px) ...
      md: `${breakpoints.md}px`,
      lg: `${breakpoints.lg}px`,
      xl: `${breakpoints.xl}px`,
      mobile: `${breakpoints.sm}px`,
      tablet: `${breakpoints.md}px`,
      laptop: `${breakpoints.lg}px`,
      desktop: `${breakpoints.xl}px`,
      //text-red-500 sm:text-sky-500 md:text-purple-500 lg:text-amber-500 xl:text-slate-500
      //text-red-500 mobile:text-sky-500 tablet:text-purple-500 laptop:text-amber-500 desktop:text-slate-500
    },
    fontSize: {
      h1: [fontSize.h1.fontSize, { ...fontSize.h1 }], //text-h1  , contains fontSize,lineHeight,letterSpacing},],
      h2: [fontSize.h2.fontSize, { ...fontSize.h2 }],
      h3: [fontSize.h3.fontSize, { ...fontSize.h3 }],
      h4: [fontSize.h4.fontSize, { ...fontSize.h4 }],
      h5: [fontSize.h5.fontSize, { ...fontSize.h5 }],
      h6: [fontSize.h6.fontSize, { ...fontSize.h6 }],
      subtitle1: [fontSize.subtitle1.fontSize, { ...fontSize.subtitle1 }],
      subtitle2: [fontSize.subtitle2.fontSize, { ...fontSize.subtitle2 }],
      body1: [fontSize.body1.fontSize, { ...fontSize.body1 }],
      body2: [fontSize.body2.fontSize, { ...fontSize.body2 }],
      caption: [fontSize.caption.fontSize, { ...fontSize.caption }],
      button: [fontSize.button.fontSize, { ...fontSize.button }],
      overline: [fontSize.overline.fontSize, { ...fontSize.overline }],
    },
    fontWeight: { ...fontWeight }, //font-bold,font-medium,...
    lineHeight: { ...lineHeight }, //leading-h1,leading-subtitle1,...
    letterSpacing: { ...letterSpacing }, //tracking-h1,tracking-subtitle1,...
    borderRadius: { ...borderRadius },
    boxShadow: { ...boxShadow }, //.shadow-none,shadow,shadow-lg,...
    zIndex: { ...zIndex }, // z-n1 , z-0 , z-1
    extend: {
      // colors: { //we use tw-colors plugin for enable dark,light theme
      //   ...light, //bg-primary-main,text-secondary-lighten2
      // },
      spacing: { ...spacing }, //.p-none,pt-none,px-none,ps-none,.m-none,mt-none,mx-none,ms-none
      //inherited by the padding,margin,width,height,maxHeight,gap
      //0,.5,1,1.5,2,2.5,3,3.5,4,5,...,16,20,24,28,...96 --> p-0 , p-0.5 , p-1 , p-4 , ...
      //1 means 4px or .25rem(if font-size of root is 16px)
      animation: {
        fadeIn: "fadeIn .3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
    },
  },
  darkMode: "class", //<html class="dark"> we have dark theme
  plugins: [
    createThemes({
      light: { ...themes.light }, //enable via adding 'theme-light' to any wrapper element(custom <div> or <html> for whole site)
      dark: { ...themes.dark }, //enable via adding 'theme-dark' to any wrapper element(custom <div> or <html> for whole site)
      // newTheme: { ... }, //enable via adding 'theme-newTheme' to any wrapper element(custom <div> or <html> for whole site)
      //e.g if we have
      // light:{
      //   primary:{
      //     main:'blue'
      //   }
      // }
      // we use bg-primary-main, text-primary-main, border-primary-main and when we add 'theme-light' css class to wrapper element we automatically get proper color
    }),
  ],
  corePlugins: {
    preflight: false,
  },
};
export default config;
