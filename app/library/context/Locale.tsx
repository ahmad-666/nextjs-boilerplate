//create this context only for add new 'dir','lang','class' attribute to <html> whenever we change locale + return 'activeLocaleDetails' for times that we need it
//all other things will be handle via 'next-intl'(useLocale(),useTranslation(),... all are inside 'next-intl')
//in layout,page components we get locale from 'params' prop --> export default async function Page({ params: { locale } }: PageProps){...}
//inside server components we can use import { createTranslator } from "next-intl" to get translation
//inside client components:
// import { useParams, useSearchParams } from "next/navigation";
// import { useRouter, usePathname } from "next-intl/client";
// import { useTranslations, useLocale } from "next-intl";
// import Link from "next-intl/link";
// const locale = useLocale()
// const {text,value,dir,lang} = useLocaleDetails()
// <div className={`${locale==='fa'?'bg-red-500':'bg-blue-500'}`} /> //useLocale()
// its not good to work with locale because we can have multiple ltr locales like 'en','fr' and multiple rtl locales like 'fa','ar' and its better that we work with direction like ltr,rtl ... each locale has one direction
// <div className={`${dir==='rtl'?'bg-red-500':'bg-blue-500'}`} /> //useLocaleDetails()
// <div className="ltr:bg-blue-500 rtl:bg-red-500"></div> //using tailwind
// <div className="bg-blue-500 rtl:bg-red-500"></div> //using tailwind
// <div className="ltr:bg-blue-500 bg-red-500"></div> //using tailwind
// <div className={`start-0 ps-0 ms-0 ${something?'ltr:origin-left rtl:origin-right':''}`}></div> //using tailwind
// styles.scss:
// html[dir="ltr"] {.some-class{left:0}}
// html[dir="rtl"] {.some-class{right:0}}
// we should use ps,pe,ms,me tailwind classes instead of pl,pr,ml,mr
// should use 'start','end' tailwind classes instead of 'left','right'
// left-0 in both ltr,rtl means stick to left side and right-0 in both rtl,ltr means stick to right side so something like 'absolute w-full h-full top-0 left-0' will work for both ltr,rtl but we could use 'start-0' instead of 'left-0' too
// search for css 'translate'(only translateX and translateY don't need to change) and fix them on both ltr,rtl directions
// 'left-1/2 -translate-x-1/2' and 'right-1/2 translate-x-1/2' will both center horizontally on both ltr,rtl
// this will work for both ltr,rtl:
// const { left, top } = useBoundingRect(container);
// const finalX = Math.round(x - left);

import { useEffect, useMemo, createContext } from "react";
import { useLocale } from "next-intl";
import config from "../config";
import type { LocaleDetails } from "../config.types";

type Context = {
  activeLocaleDetails: LocaleDetails;
};
type LocaleProviderProps = {
  children: React.ReactNode;
};

const { defaultLocale, locales } = config;
const defaultLocaleDetails = locales.find((l) => l.value === defaultLocale)!;

export const LocaleContext = createContext<Context>({
  activeLocaleDetails: defaultLocaleDetails,
});
const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const locale = useLocale();
  const activeLocaleDetails = useMemo<LocaleDetails>(() => {
    return locales.find((l) => l.value === locale)!;
  }, [locale]);
  useEffect(() => {
    //whenever we change locale we should change lang,dir attribute on <html> , change css className
    //next-intl will update cookie for us
    //we don't change route here and whenever we change locale we change route there
    const { lang, dir } = activeLocaleDetails;
    const html = document.documentElement;
    const addCssClass = dir === "ltr" ? "dir-ltr" : "dir-rtl";
    const removeCssClass = dir === "ltr" ? "dir-rtl" : "dir-ltr";
    html.lang = lang; //add 'lang' attribute on <html>
    html.dir = dir; //add 'dir' attribute on <html>
    html.classList.add(addCssClass); //add new dir css class to <html>
    html.classList.remove(removeCssClass); //remove old dir css class from <html>
  }, [activeLocaleDetails]);
  return (
    <LocaleContext.Provider
      value={{
        activeLocaleDetails,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};
export default LocaleProvider;
