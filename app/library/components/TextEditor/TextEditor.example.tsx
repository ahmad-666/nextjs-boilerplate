import { useState } from "react";
import TextEditor from ".";

export default function Example() {
  const [content, setContent] = useState("");
  return (
    <div>
      <TextEditor value={content} onChange={(newVal) => setContent(newVal)} />
    </div>
  );
}
