import { useState } from "react";
import NumberField from ".";

export default function Example() {
  const [price, setPrice] = useState<any>(null);
  const [age, setAge] = useState<any>(null);
  const [mobile, setMobile] = useState<any>(null);
  return (
    <div>
      <NumberField
        value={price}
        setValue={(newVal) => setPrice(newVal)}
        label="Price"
        min={0}
        max={1000}
        clearable
        separate
        type="number"
      />
      <NumberField
        value={age}
        setValue={(newVal) => setAge(newVal)}
        label="Age"
        min={0}
        max={100}
        showArrow
        separate={false}
        type="number"
      />
      <NumberField
        value={mobile}
        setValue={(newVal) => setMobile(newVal)}
        label="Mobile"
        separate={false}
        type="string"
      />
    </div>
  );
}
