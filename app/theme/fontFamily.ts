//we don't read fontFamily in /library/config.ts or tailwind.config.js and for set font-family we use next.js approach(read next.js docs) or simply use old css approach for reading font-family

import { Roboto } from "next/font/google";
import localFont from "next/font/local";
export const robotoFont = Roboto({
  subsets: ["latin"],
  style: "normal",
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});
export const yekanFont = localFont({
  src: [
    {
      path: "../../public/fonts/YekanBakhFaNumHeavy.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNumBold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNumMedium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNumRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNumLight.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNumLight.woff2",
      weight: "100",
      style: "normal",
    },
  ],
  display: "swap",
});
