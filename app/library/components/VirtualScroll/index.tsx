//3 main way of handling large data:
// 1-pagination: via client-side or server-side ... we show pagination component and user can select page,pageSize ... instead of loading entire array of items we only load
//client-side pagination means in one array we store maybe 1000 items but we have another state that store part of this array maybe from 50,100(page=2,pageSize=50) --> array.slice((page-1)*pageSize,(page-1)*pageSiz+pageSize)
//server-side pagination means server has 1000 items in database but only send us 50 items each time and we only store those 50 items
// 2-infinite scroll: same as pagination but only we increase page when we reach end of page ...
//     when we are on page 3 we should already load all items of page 1,2 previously ... in this approach we don't store page,pageSize in url query and on each page    reload we start from page:1
// 3-virtual scroll: no pagination , load all items at once but only render those ones that are inside viewport

//we find height of entire container(including all children's height) and apply it ... because we want to have all the scrollbar space that we needed because its possible that user jump scroll to middle or end of page and we need to load related data
//only after we intersect container we load items(but even before it we already apply container height including all item's height)
//before any item gets inside viewport for each item we load <div style={{ height: `${itemHeight}px` }}> to fill space ... we don't load any content yet but after item get inside viewport we load its content too

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import useIntersection from "../../hooks/useIntersection";

export type VirtualScrollProps = {
  itemHeight: number;
  itemsLength: number;
  cols?: number;
  gap?: number;
  offset?: number;
  itemRender: (index: number) => React.ReactNode;
  className?: string;
};

export default function VirtualScroll({
  itemHeight,
  itemsLength, //how many items we have
  cols = 1, //gridTemplateColumns , we use grid here to have all flexibility needed
  gap = 10, //space between elements
  offset = 200, //how many px in top,bottom direction load prior to reach it
  itemRender,
  className = "",
}: VirtualScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const containerIntersected = useIntersection(containerRef, {
    threshold: 0,
    once: true,
  });
  const itemsRef = useRef<HTMLDivElement[]>([]); //array of refs are all items
  const [itemsInViewport, setItemsInViewport] = useState<boolean[]>([]); //[true,true,false,false] means we have total of 4 items and first two is inside viewport and we should render them
  const contentHeight = useMemo(() => {
    //total height of container when we have all items loaded
    const itemsHeight = Math.ceil(itemsLength / cols) * itemHeight;
    const gapsHeight = (Math.ceil(itemsLength / cols) - 1) * gap;
    return itemsHeight + gapsHeight;
  }, [cols, itemsLength, itemHeight, gap]);
  const isItemInViewport = useCallback(
    (index: number) => {
      //check if specific item is visible in viewport ... work via item index
      const itemElm = itemsRef.current[index];
      if (itemElm) {
        const { top, height } = itemElm.getBoundingClientRect();
        const topInsideViewport = top - offset <= window.innerHeight;
        const bottomInsideViewport = top + height + offset >= 0;
        return topInsideViewport && bottomInsideViewport;
      }
      return false;
    },
    [offset]
  );
  const scrollHandler = useCallback(() => {
    if (containerIntersected) {
      const newItemsInViewport = itemsRef.current.map((itemElm, i) => {
        return isItemInViewport(i);
      });
      setItemsInViewport(newItemsInViewport);
    }
  }, [containerIntersected, isItemInViewport]);
  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [scrollHandler]);
  return (
    <div className={`${className}`} ref={containerRef}>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`,
          gap: `${gap}px`,
          height: `${contentHeight}px`,
        }}
      >
        {containerIntersected &&
          [...new Array(itemsLength)].map((item, itemIndex) => (
            <div
              key={`virtual-item-${itemIndex}`}
              ref={(elm) => (itemsRef.current[itemIndex] = elm!)}
              style={{ height: `${itemHeight}px` }}
            >
              {itemsInViewport[itemIndex] && itemRender(itemIndex)}
            </div>
          ))}
      </div>
    </div>
  );
}
