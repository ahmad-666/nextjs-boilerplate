// const { smAndDown } = useBreakpoints();
// <div className="bg-primary-main sm:bg-secondary-main" /> //using tailwind
// <div className={`${smAndDown ? "bg-primary-main" : "bg-secondary-main"}` /} //using useBreakpoints()

import { useCallback, useEffect, useMemo, useState } from "react";
import config from '../config'
const {breakpoints:{sm: SM,md:MD,lg:LG,xl:XL}} = config

export type Breakpoint =
  | "xs"
  | "xsAndDown"
  | "xsAndUp"
  | "sm"
  | "smAndDown"
  | "smAndUp"
  | "md"
  | "mdAndDown"
  | "mdAndUp"
  | "lg"
  | "lgAndDown"
  | "lgAndUp"
  | "xl"
  | "xlAndDown"
  | "xlAndUp"
  | "mobile"
  | "tablet"
  | "laptop"
  | "desktop";

// const thresholds = {
//   //[...,500] count as XS
//   SM, //[500,750] count as SM
//   MD, //[750,1000] count as MD
//   LG, //[1000,1200] count as LG
//   XL, //[1200,...] count as XL
// };
const useBreakpoints = () => {
  const [xs, setXs] = useState(false); //xs only ... <= SM
  const [xsAndDown, setXsAndDown] = useState(false); //<= SM
  const [xsAndUp, setXsAndUp] = useState(false); //> SM
  const [sm, setSm] = useState(false); //sm only ... > SM && <= MD
  const [smAndDown, setSmAndDown] = useState(false); //<= SM
  const [smAndUp, setSmAndUp] = useState(false); //> SM
  const [md, setMd] = useState(false); //md only ... > MD && <= LG
  const [mdAndDown, setMdAndDown] = useState(false); //<= MD
  const [mdAndUp, setMdAndUp] = useState(false); //> MD
  const [lg, setLg] = useState(false); //lg only ... > LG && <= XL
  const [lgAndDown, setLgAndDown] = useState(false); //<= LG
  const [lgAndUp, setLgAndUp] = useState(false); //> LG
  const [xl, setXl] = useState(false); //xl only ... > XL
  const [xlAndDown, setXlAndDown] = useState(false); //<= XL
  const [xlAndUp, setXlAndUp] = useState(false); //> XL
  const [mobile, setMobile] = useState(false); //alias for xs|sm
  const [tablet, setTablet] = useState(false); //alias for md
  const [laptop, setLaptop] = useState(false); //alias for lg
  const [desktop, setDesktop] = useState(false); //alias for xl
  const breakpoints = useMemo(() => {
    return {
      xs,
      xsAndDown,
      xsAndUp,
      sm,
      smAndDown,
      smAndUp,
      md,
      mdAndDown,
      mdAndUp,
      lg,
      lgAndDown,
      lgAndUp,
      xl,
      xlAndDown,
      xlAndUp,
      mobile,
      tablet,
      laptop,
      desktop,
    };
  }, [
    xs,
    xsAndDown,
    xsAndUp,
    sm,
    smAndDown,
    smAndUp,
    md,
    mdAndDown,
    mdAndUp,
    lg,
    lgAndDown,
    lgAndUp,
    xl,
    xlAndDown,
    xlAndUp,
    mobile,
    tablet,
    laptop,
    desktop,
  ]);
  const calcBreakpoints = useCallback(() => {
    const width = window.innerWidth;
    let xs = false;
    let xsAndDown = false;
    let xsAndUp = false;
    let sm = false;
    let smAndDown = false;
    let smAndUp = false;
    let md = false;
    let mdAndDown = false;
    let mdAndUp = false;
    let lg = false;
    let lgAndDown = false;
    let lgAndUp = false;
    let xl = false;
    let xlAndDown = false;
    let xlAndUp = false;
    let mobile = false;
    let tablet = false;
    let laptop = false;
    let desktop = false;
    if (width <= SM) {
      xs = true;
      xsAndDown = true;
      smAndDown = true;
      mdAndDown = true;
      lgAndDown = true;
      xlAndDown = true;
      mobile = true;
    } else if (width > SM && width <= MD) {
      xsAndUp = true;
      sm = true;
      smAndUp = true;
      mdAndDown = true;
      lgAndDown = true;
      xlAndDown = true;
      mobile = true;
    } else if (width > MD && width <= LG) {
      xsAndUp = true;
      smAndUp = true;
      md = true;
      mdAndUp = true;
      lgAndDown = true;
      xlAndDown = true;
      tablet = true;
    } else if (width > LG && width <= XL) {
      xsAndUp = true;
      smAndUp = true;
      mdAndUp = true;
      lg = true;
      lgAndUp = true;
      xlAndDown = true;
      laptop = true;
    } else if (width > XL) {
      xsAndUp = true;
      smAndUp = true;
      mdAndUp = true;
      lgAndUp = true;
      xl = true;
      xlAndUp = true;
      desktop = true;
    }
    setXs(xs);
    setXsAndDown(xsAndDown);
    setXsAndUp(xsAndUp);
    setSm(sm);
    setSmAndDown(smAndDown);
    setSmAndUp(smAndUp);
    setMd(md);
    setMdAndDown(mdAndDown);
    setMdAndUp(mdAndUp);
    setLg(lg);
    setLgAndDown(lgAndDown);
    setLgAndUp(lgAndUp);
    setXl(xl);
    setXlAndDown(xlAndDown);
    setXlAndUp(xlAndUp);
    setMobile(mobile);
    setTablet(tablet);
    setLaptop(laptop);
    setDesktop(desktop);
  }, []);
  useEffect(() => {
    calcBreakpoints();
    window.addEventListener("resize", calcBreakpoints);
    return () => {
      window.removeEventListener("resize", calcBreakpoints);
    };
  }, [calcBreakpoints]);
  return breakpoints;
};
export default useBreakpoints;
