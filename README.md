# This library is written in next.js(app-router)

#### -here because we have multi-language site we have /app/[locale]/layout.tsx , /app/[layout]/page.tsx and all other layout,page,not-found,loading,error should be written inside /app/[locale] and we don't have any /app/layout.tsx , /app/page.tsx

#### -different way of change theme and use different colors:

    const { theme, setTheme } = useTheme();
    const color = useColorParser("primary");
    <div className={`${theme === "dark" ? "bg-red-500" : "bg-blue-500"}`} /> //change via useTheme hook which itself uses theme context state
    <div className="bg-blue-500 dark:bg-red-500" /> //change via tailwind
    <div style={{backgroundColor: color}} /> //using useColorParser hook
    <div className="bg-primary-main" /> //best option ... always read 'main' variant of 'primary' color , when we change theme we automatically reload colors of new theme too
    <button onClick={() => setTheme((old) => (old === "dark" ? "light" : "dark"))}>click</button>

#### -different way of change locale,dir,translation:

    import { useParams, useSearchParams } from "next/navigation";
    import { useRouter, usePathname } from "next-intl/client";
    import { useTranslations, useLocale } from "next-intl";
    import Link from "next-intl/link";
    const locale = useLocale()
    const {text,value,dir,lang} = useLocaleDetails()
    <div className={`${locale==='fa'?'bg-red-500':'bg-blue-500'}`} /> //useLocale()
    its not good to work with locale because we can have multiple ltr locales like 'en','fr' and multiple rtl locales like 'fa','ar' and its better that we work with direction like ltr,rtl ... each locale has one direction
    <div className={`${dir==='rtl'?'bg-red-500':'bg-blue-500'}`} /> //useLocaleDetails()
    <div className="ltr:bg-blue-500 rtl:bg-red-500"></div> //using tailwind
    <div className="bg-blue-500 rtl:bg-red-500"></div> //using tailwind
    <div className="ltr:bg-blue-500 bg-red-500"></div> //using tailwind
    <div className={`start-0 ps-0 ms-0 ${something?'ltr:origin-left rtl:origin-right':''}`}></div> //using tailwind
    styles.scss:
    html[dir="ltr"] {.some-class{left:0}}
    html[dir="rtl"] {.some-class{right:0}}
    *we should use ps,pe,ms,me tailwind classes instead of pl,pr,ml,mr
    *should use 'start','end' tailwind classes instead of 'left','right'
    *search for css 'translate'(only translateX and translateY don't need to change) and fix them on both ltr,rtl directions
    *left-0 in both ltr,rtl means stick to left side and right-0 in both rtl,ltr means stick to right side so something like 'absolute w-full h-full top-0 left-0' will work for both ltr,rtl but we could use 'start-0' instead of 'left-0' too
    *'left-1/2 -translate-x-1/2' and 'right-1/2 translate-x-1/2' will both center horizontally on both ltr,rtl
    *this will work for both ltr,rtl:
        const { left, top } = useBoundingRect(container);
        const finalX = Math.round(x - left);

#### -for config library we use library/config.ts and for config tailwind we use /tailwind.config.js ... we can config color palette,theme,locale,dir,breakpoints,spacing,borderRadius,boxShadow,fontStyles,...

#### -/library/config.ts will export entire config file so anytime we need to access config we just need to import that file

#### -it uses some modules like 'next/image','next/link','next/navigation',...

#### -we should have 'swiper, rc-slider, js-cookie, dayjs, jalaliday, tinymce, @tinymce/tinymce-react, leaflet, react-leaflet, next-intl' library installed as dependency(npm i)

#### -we should have '@iconify/react, @types/js-cookie, tw-colors, @types/leaflet' library installed as dev-dependency(npm i --D)

#### -we used 'tw-colors' plugin for tailwind:

    export default light = {
        primary: {lighten2,lighten1,main,darken1,darken2},
        ...
    }

#### -inside tailwind config we should have border-radius utility classes like:

    rounded-none, rounded-xs, rounded-sm, rounded, rounded-lg, rounded-xl, rounded-xl2, rounded-circle, rounded-full

#### -inside tailwind config we should have box-shadow utility classes like:

    shadow-none, shadow-xs, shadow-sm, shadow, shadow-lg, shadow-xl, shadow-xl2, shadow-full

#### -inside tailwind config we should have z-index utility classes like:

    z-1, z-2, z-3

#### -inside layout.tsx we should add navbar,sidebar,footer (for navbar,sidebar components we should add middle component that has 'use client' inside it and use this middle component inside layout and that middle component has 'Navbar','Sidebar')

#### -main content inside layout file must be placed inside 'main' tag because its possible that we add 'margin-top' to main from Navbar or add 'margin-left'/'margin-right' to 'main' via 'Sidebar' ... because of this never add any margin manually to 'main' and for more spacing add 'padding' to it.

#### -inside layout we must create

    <div id="portals"></div>
