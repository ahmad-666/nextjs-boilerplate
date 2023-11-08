//this file will export entire config file so for reading any part of config we use need to import this file
//we don't set fontFamily in /library/config.ts or tailwind.config.js and for set font-family we use next.js approach(read next.js docs) or simply use old css approach for reading font-family

import localeDetails,{DEFAULT_LOCALE } from "../theme/i18n-config";
import { DEFAULT_THEME, light, dark } from "../theme/colors";
import {
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
} from "../theme/fontStyles";
import breakpoints from "../theme/breakpoints";
import borderRadius from "../theme/borderRadius";
import spacing from "../theme/spacing";
import zIndex from "../theme/zIndex";
import boxShadow from "../theme/shadows";
import type { Config } from "./config.types";

const config: Config = {
  locales:localeDetails,
  defaultLocale: DEFAULT_LOCALE, //we start our app with this locale but user can later change it and we store latest locale to cookie and read from cookie ... each locale has specific direction
  themes: {
    defaultTheme: DEFAULT_THEME, //we start our app with this theme but user can later change it and we store latest theme to cookie and read from cookie
    light: { ...light },
    dark: { ...dark },
  },
  breakpoints: { ...breakpoints },
  fontSize: { ...fontSize },
  fontWeight: { ...fontWeight },
  lineHeight: { ...lineHeight },
  letterSpacing: { ...letterSpacing },
  borderRadius: { ...borderRadius },
  spacing: { ...spacing },
  zIndex: { ...zIndex },
  boxShadow: { ...boxShadow },
};
export default config;
