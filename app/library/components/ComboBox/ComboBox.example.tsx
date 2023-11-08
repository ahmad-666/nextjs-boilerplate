import { useState } from "react";
import ComboBox from ".";
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
      <ComboBox
        value={job}
        setValue={(newVal) => setJob(newVal)}
        items={items}
        label="Job"
        dense
        itemJsx={({ text, value }) => {
          return (
            <h3>
              {text}-{value}
            </h3>
          );
        }}
      ></ComboBox>
    </div>
  );
}
