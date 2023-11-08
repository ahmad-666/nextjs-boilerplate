//use context-api/provider so globally change dayjs default locale,calendar if needed

"use client";
import { createContext, useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import toArray from "dayjs/plugin/toArray";
import toObject from "dayjs/plugin/toObject";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import customParseFormat from "dayjs/plugin/customParseFormat";
import objectSupport from "dayjs/plugin/objectSupport";
import jalaliday from "jalaliday";
declare module "dayjs" {
  interface FormatObject {
    jalali?: boolean;
  }
}
type Locale = "en" | "fa";
type Calendar = "gregory" | "jalali";
type Context = {
  locale: Locale;
  setLocale: React.Dispatch<React.SetStateAction<Locale>>;
  calendar: Calendar;
  setCalendar: React.Dispatch<React.SetStateAction<Calendar>>;
};
type ProviderProps = {
  children: React.ReactNode;
};
const DEFAULT_LOCALE: Locale = "en";
const DEFAULT_CALENDAR: Calendar = "gregory";
dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(toArray);
dayjs.extend(toObject);
dayjs.extend(localeData);
dayjs.extend(weekday);
dayjs.extend(customParseFormat);
dayjs.extend(objectSupport);
dayjs.extend(jalaliday);
dayjs.locale(DEFAULT_LOCALE);
(dayjs as any).calendar(DEFAULT_CALENDAR);
export const DayjsContext = createContext<Context>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  calendar: DEFAULT_CALENDAR,
  setCalendar: () => {},
});
const DayjsProvider = ({ children }: ProviderProps) => {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [calendar, setCalendar] = useState<Calendar>(DEFAULT_CALENDAR);
  useEffect(() => {
    const newCalendar = locale === "en" ? "gregory" : "jalali";
    setCalendar(newCalendar);
    dayjs.locale(locale);
    (dayjs as any).calendar(newCalendar);
  }, [locale]);
  useEffect(() => {
    const newLocale = calendar === "gregory" ? "en" : "fa";
    setLocale(newLocale);
    dayjs.locale(newLocale);
    (dayjs as any).calendar(calendar);
  }, [calendar]);
  return (
    <DayjsContext.Provider value={{ locale, setLocale, calendar, setCalendar }}>
      {children}
    </DayjsContext.Provider>
  );
};
export default DayjsProvider;
