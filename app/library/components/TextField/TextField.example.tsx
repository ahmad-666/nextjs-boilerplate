import { useState } from "react";
import TextField from ".";

export default function Example() {
  const [name, setName] = useState("");
  return (
    <div>
      <TextField
        value={name}
        setValue={(newVal) => setName(newVal)}
        label="Name"
        variant="filled"
      ></TextField>
    </div>
  );
}
