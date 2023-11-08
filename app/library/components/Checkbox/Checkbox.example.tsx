import { useState } from "react";
import Checkbox from ".";

export default function Example() {
  const [s1, setS1] = useState(true);
  const [s2, setS2] = useState<any[]>([]);
  return (
    <div>
      <h1>#1:</h1>
      <Checkbox value={s1} setValue={(val) => setS1(val)} multiple={false}>
        label
      </Checkbox>

      <h1>#2:</h1>
      <Checkbox
        value={s2}
        setValue={(val) => setS2(val)}
        multiple={true}
        checkboxValue={1}
      >
        label1
      </Checkbox>
      <Checkbox
        value={s2}
        setValue={(val) => setS2(val)}
        multiple={true}
        checkboxValue={2}
      >
        label2
      </Checkbox>
    </div>
  );
}
