import { useState } from "react";
import Radio from ".";

export default function Example() {
  const [radio, setRadio] = useState<null | number>(1);
  return (
    <div>
      <div className="flex flex-col gap-4">
        <Radio
          value={radio}
          name="radio"
          setValue={(r: any) => setRadio(r)}
          radioValue={1}
        >
          label-1
        </Radio>
        <Radio
          value={radio}
          name="radio"
          setValue={(r: any) => setRadio(r)}
          radioValue={2}
        >
          label-2
        </Radio>
        <Radio
          value={radio}
          name="radio"
          setValue={(r: any) => setRadio(r)}
          radioValue={3}
        >
          label-3
        </Radio>
      </div>
    </div>
  );
}
