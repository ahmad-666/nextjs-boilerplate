import { useState } from "react";
import OtpInput from ".";

export default function Example() {
  const [code, setCode] = useState("");
  return (
    <div>
      <OtpInput
        value={code}
        setValue={(newVal) => setCode(newVal)}
        type="text"
        length={5}
      ></OtpInput>
    </div>
  );
}
