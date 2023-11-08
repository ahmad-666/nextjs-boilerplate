import { useState } from "react";
import AutoComplete from ".";
import type { Item } from "../FormField/types";

const items: Item[] = [
  {
    text: "html",
    value: "HTML",
  },
  {
    text: "css",
    value: "CSS",
    disabled: true,
  },
  {
    text: "js",
    value: "JS",
  },
];
export default function Example() {
  const [job, setJob] = useState("");
  return (
    <div>
      <AutoComplete
        value={job}
        setValue={(newVal) => setJob(newVal)}
        items={items}
        label="Job"
        itemJsx={({ text, value }) => {
          return (
            <h3>
              {text}-{value}
            </h3>
          );
        }}
      ></AutoComplete>
    </div>
  );
}
