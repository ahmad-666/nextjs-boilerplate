import type { Locale, LocaleDetails } from "../library/config.types";

export const DEFAULT_LOCALE: Locale = "en";
export const locales: Locale[] = ["en", "fa"];
const localeDetails: LocaleDetails[] = [
  {
    value: "en",
    dir: "ltr",
    lang: "en-US",
    text: "English",
  },
  {
    value: "fa",
    dir: "rtl",
    lang: "fa-IR",
    text: "فارسی",
  },
];

export default localeDetails;
