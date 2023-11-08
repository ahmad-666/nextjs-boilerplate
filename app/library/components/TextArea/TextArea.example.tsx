import { useState } from "react";
import TextArea from ".";

export default function Example() {
  const [desc, setDesc] = useState("");
  return (
    <div>
      <TextArea
        value={desc}
        setValue={(newVal) => setDesc(newVal)}
        label="Desc"
        autoGrow
      ></TextArea>
    </div>
  );
}
