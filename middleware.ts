import { NextRequest, NextResponse } from "next/server";
import createNextIntlMiddleware from "next-intl/middleware";
import libraryConfig from "./app/library/config";

const { defaultLocale: configDefaultLocale, locales } = libraryConfig;

export default async function middleware(req: NextRequest) {
  const defaultLocale =
    req.headers.get("x-default-locale") || configDefaultLocale;
  const handleI18nRouting = createNextIntlMiddleware({
    locales: locales.map((l) => l.value), //something like ['en','fa']
    defaultLocale,
    localeDetection: true, //detect user preferred locale
    localePrefix: "as-needed",
    //'as-needed'(default) --> only add locale prefix for non-default locales and default locale will not be added to url as prefix
    //'always' --> even for default locale we add locale as prefix of url
    //'never' --> we still have localization but we never add any locale to url as prefix
    // pathnames: {
    //   //if different locale use different pathnames for seo or ...
    //   "/": "/",
    //   "/blog": "/blog",
    //   "/about": {
    //     en: "/about",
    //     fa: "/درباره ما",
    //   },
    //   "/products/[productId]": {
    //     en: "/products/[productId]",
    //     fa: "/محصولات/[productId]",
    //   },
    //   "/categories/[...slug]": {
    //     en: "/categories/[...slug]",
    //     fa: "/دسته بندی ها/[...slug]",
    //   },
    // },
  });
  const response = handleI18nRouting(req);
  response.headers.set("x-default-locale", defaultLocale);
  //------------------------------------------
  //------------------------------------------
  //for our own middleware logic:
  //for example of using next-intl middleware + nextAuth.js we can check https://next-intl-docs.vercel.app/docs/routing/middleware#example-auth-js
  // const url = req.nextUrl; //has many useful properties
  // const { pathname, search, searchParams, hash } = url;
  // const localeCookie = req.cookies.get("NEXT_LOCALE");
  // if (pathname === "/dashboard") {
  //   //simple example for redirect
  //   return NextResponse.redirect(new URL("/about", req.url)); //redirect request
  // }
  //------------------------------------------
  //------------------------------------------
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], //to run only on requests to our app pages
};
