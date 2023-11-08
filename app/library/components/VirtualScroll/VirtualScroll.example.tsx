import { useEffect, useState } from "react";
import useBreakpoints from "../../hooks/useBreakpoints";
import VirtualScroll from ".";
import Image from "next/image";

export default function Example() {
  const { smAndDown, mdAndDown } = useBreakpoints();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const newItems = [];
    for (let i = 0; i < 10000; i++) {
      newItems.push({
        id: i,
        title: `title-${i}`,
        desc: "desc",
        imgSrc: "...",
      });
    }
    setItems(newItems);
  }, []);
  return (
    <div>
      <VirtualScroll
        className="mt-16"
        itemHeight={155}
        itemsLength={items.length}
        cols={smAndDown ? 1 : mdAndDown ? 2 : 3}
        gap={smAndDown ? 10 : 20}
        offset={200}
        itemRender={(index) => {
          const item = items[index];
          const { id, title, desc, imgSrc } = item;
          return (
            <div className="rounded-sm border border-solid border-slate-300 p-4">
              <div className="flex gap-2">
                <Image
                  width={150}
                  height={150}
                  className="h-[120px] w-[120px] rounded-sm"
                  src={imgSrc}
                  alt={imgSrc}
                />
                <div>
                  <p className="text-body1 font-bold text-slate-700">{title}</p>
                  <p className="mt-4 line-clamp-3 text-body2 text-slate-400">
                    {desc}
                  </p>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
