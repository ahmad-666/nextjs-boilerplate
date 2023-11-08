import { useState } from "react";
import Switch from ".";

export default function Example() {
  const [isAgree, setIsAgree] = useState(false);

  return (
    <div>
      <Switch
        value={isAgree}
        setValue={(newVal) => setIsAgree(newVal)}
        color="purple-500"
        label="Is Agree"
      ></Switch>
    </div>
  );
}
