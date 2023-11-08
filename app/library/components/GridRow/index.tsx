//1-GridRow is simple 'flex flex-wrap' and we use it if flex-items has fix size for each breakpoint
//2-if we want flex-items to have dynamic width(as much as their content) we can use:
// <div className="flex"> <div></div> //width as much as content </div>
//*** flex-items,inline-block,inline-flex,inline-grid items have width as much as their content
//3-sometimes instead of flexbox we should use grid --> display:grid,grid-template-columns,grid-template-rows,grid-column(shorthand for grid-column-start,grid-column-end),grid-row(shorthand for grid-row-start,grid-row-end)
/* <div className="grid-row-6 grid h-[300px] w-1/2 grid-cols-12 gap-4"> //set width,height of grid 
  <div className="col-span-6 col-start-6 row-span-3 row-start-3 bg-sky-500"></div>
  OR 
  <div className="col-start-6 col-end-12 row-start-3 row-end-6 bg-blue-500"></div>
</div> */

import { useMemo } from "react";

export type JustifyContent =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "between"
  | "around"
  | "evenly";
export type AlignItems = "start" | "center" | "end" | "stretch";
export type AlignContent =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "between"
  | "around"
  | "evenly";
export type GridRowProps = {
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  alignContent?: AlignContent;
  children: React.ReactNode;
  className?: string;
};

export default function GridRow({
  justifyContent = "start",
  alignItems = "start",
  alignContent = "start",
  children,
  className = "",
}: GridRowProps) {
  const flexBoxClasses = useMemo(() => {
    let justifyContentClass = "";
    let alignItemsClass = "";
    let alignContentClass = "";
    switch (justifyContent) {
      case "start":
        justifyContentClass = "justify-start";
        break;
      case "center":
        justifyContentClass = "justify-center";
        break;
      case "end":
        justifyContentClass = "justify-end";
        break;
      case "stretch":
        justifyContentClass = "justify-stretch";
        break;
      case "between":
        justifyContentClass = "justify-between";
        break;
      case "around":
        justifyContentClass = "justify-around";
        break;
      case "evenly":
        justifyContentClass = "justify-evenly";
        break;
      default:
        justifyContentClass = "justify-start";
    }
    switch (alignItems) {
      case "start":
        alignItemsClass = "items-start";
        break;
      case "center":
        alignItemsClass = "items-center";
        break;
      case "end":
        alignItemsClass = "items-end";
        break;
      case "stretch":
        alignItemsClass = "items-stretch";
        break;
      default:
        alignItemsClass = "items-start";
    }
    switch (alignContent) {
      case "start":
        alignContentClass = "content-start";
        break;
      case "center":
        alignContentClass = "content-center";
        break;
      case "end":
        alignContentClass = "content-end";
        break;
      case "stretch":
        alignContentClass = "content-stretch";
        break;
      case "between":
        alignContentClass = "content-between";
        break;
      case "around":
        alignContentClass = "content-around";
        break;
      case "evenly":
        alignContentClass = "content-evenly";
        break;
      default:
        alignContentClass = "content-start";
    }
    return `${justifyContentClass} ${alignItemsClass} ${alignContentClass}`;
  }, [alignContent, alignItems, justifyContent]);
  return (
    <div className={`flex flex-wrap ${flexBoxClasses} ${className}`}>
      {children}
    </div>
  );
}
