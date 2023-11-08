import { useState } from "react";
import Navbar from ".";

export default function Example() {
  const [isScroll, setIsScroll] = useState(false);

  return (
    <div>
      <Navbar
        onScroll={(val) => setIsScroll(val)}
        fixed
        color={!isScroll ? "slate-400" : "slate-800"}
        className={`${
          isScroll ? "shadow-[0px_5px_15px_0px_rgba(0,0,0,.6)]" : ""
        }`}
      >
        <div
          className={`flex items-center justify-between ${
            isScroll ? "text-white" : "text-slate-800"
          }`}
        >
          <h3>text</h3>
          <h3>text</h3>
        </div>
      </Navbar>
    </div>
  );
}
