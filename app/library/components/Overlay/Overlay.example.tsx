import { useState } from "react";
import Overlay from ".";

export default function Example() {
  const [overlay, setOverlay] = useState(false);
  return (
    <div>
      <button onClick={() => setOverlay((old) => !old)}>toggle overlay</button>
      <Overlay
        show={overlay}
        setShow={(newVal) => setOverlay(newVal)}
        closeOnOutsideClick
        closeOnContentClick={false}
        color="rgba(0,0,0,.8)"
      >
        <div className="bg-white p-4">
          <h1>text</h1>
        </div>
      </Overlay>
    </div>
  );
}
