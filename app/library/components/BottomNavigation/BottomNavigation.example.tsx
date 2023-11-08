import { useState } from "react";
import BottomNavigation from ".";
import Items from "../Items";
import Item from "../Item";
import Icon from "../Icon";

type Item = { text: string; value: number; icon: string };
const items: Item[] = [
  { text: "User", value: 1, icon: "mdi:account" },
  { text: "Home", value: 2, icon: "mdi:home" },
];
export default function Example() {
  const [show, setShow] = useState(true);
  const [active, setActive] = useState<number | null>(null);
  return (
    <div>
      <button onClick={() => setShow((old) => !old)}>click</button>
      <BottomNavigation show={show} color="slate-200">
        <Items
          mandatory
          multiple={false}
          value={active}
          setValue={(newVal: any) => setActive(newVal)}
          className="flex items-center justify-center gap-5"
        >
          {items.map((item) => {
            const isActive = active === item.value;
            return (
              <Item
                key={item.value}
                value={item.value}
                className={`flex flex-col items-center px-4 py-2 ${
                  isActive ? "bg-sky-200" : ""
                }`}
              >
                <Icon
                  icon={item.icon}
                  size="md"
                  color={isActive ? "sky-600" : "slate-500"}
                />
                <p
                  className={`mt-1 text-body1 ${
                    isActive ? "text-sky-600" : "text-slate-500"
                  }`}
                >
                  {item.text}
                </p>
              </Item>
            );
          })}
        </Items>
      </BottomNavigation>
    </div>
  );
}
