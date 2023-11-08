import { useState } from "react";
import Items from ".";
import Item from "../Item";

const items = [
  { value: 1, text: "text#1", disabled: false },
  { value: 2, text: "text#2", disabled: true },
  { value: 3, text: "text#3", disabled: false },
];
export default function Example() {
  const [item, setItem] = useState<null | number>(1);
  return (
    <div>
      <Items
        className="flex gap-5"
        value={item}
        setValue={(newVal: any) => setItem(newVal)}
        multiple={false}
        activeClass="!bg-red-500"
      >
        {items.map((i) => (
          <Item
            disabled={i.disabled}
            value={i.value}
            key={i.value}
            className="flex items-center justify-center bg-blue-500 text-h3 text-white"
          >
            {i.text}
          </Item>
        ))}
      </Items>
    </div>
  );
}
