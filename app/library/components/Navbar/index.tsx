//don't use any portal because we use it inside layout
//we don't use any 'use client' here so for using it inside layout we need to create another component and use Navbar inside that and that component has 'use client'
// /app/layout.tsx:
// import LayoutNavbar from "./components/LayoutNavbar";
// <html>
//     <body>
//         <LayoutNavbar></LayoutNavbar>
//         <main>{children}</main>
//         <div id="portals"></div>
//     </body>
// </html>
// /components/LayoutNavbar.tsx: <Navbar>...</Navbar>

import { useCallback, useEffect, useRef, useState } from "react";
import useColorParser from "../../hooks/useColorParser";
import useBoundingRect from "../../hooks/useBoundingRect";

export type NavbarProps = {
  color?: string;
  onScroll?: (val: boolean) => void;
  height?: number | string;
  zIndex?: number;
  fixed?: boolean;
  dense?: boolean;
  scrollThreshold?: number;
  children: React.ReactNode;
  className?: string;
};

export default function Navbar({
  color = "transparent",
  onScroll, //when we reach scroll threshold we call this
  height = "auto",
  zIndex = 1,
  fixed = false,
  dense = false,
  scrollThreshold = 50,
  children,
  className = "",
}: NavbarProps) {
  const container = useRef<HTMLElement>(null!);
  const main = useRef<HTMLElement>(null!);
  const parsedColor = useColorParser(color);
  const { height: boundingHeight } = useBoundingRect(container);
  const [reachScrollThreshold, setReachScrollThreshold] = useState(false);
  const checkScroll = useCallback(() => {
    let isScroll: boolean = false;
    if (window.scrollY < scrollThreshold) isScroll = false;
    else isScroll = true;
    setReachScrollThreshold(isScroll);
    if (onScroll) onScroll(isScroll);
  }, [scrollThreshold, onScroll]);
  useEffect(() => {
    checkScroll();
    window.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, [checkScroll]);
  useEffect(() => {
    main.current = document.querySelector("main")!;
    if (main.current && fixed) {
      main.current.style.setProperty("margin-top", `${boundingHeight}px`);
    }
  }, [fixed, boundingHeight]);
  return (
    <>
      <nav
        ref={container}
        className={`start-0 top-0 flex w-full items-center transition-all duration-300 ease-linear ${
          fixed ? "fixed" : ""
        } ${dense ? "p-2" : "p-5"} ${
          reachScrollThreshold ? `reach-scroll-threshold` : ""
        } ${className}`}
        style={{
          backgroundColor: parsedColor,
          height: typeof height === "number" ? `${height}px` : height,
          zIndex,
        }}
      >
        <div className="w-full">{children}</div>
      </nav>
    </>
  );
}
