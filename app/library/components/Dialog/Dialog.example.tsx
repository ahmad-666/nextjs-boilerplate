import { useState } from "react";
import Dialog from ".";

export default function Example() {
  const [dialog, setDialog] = useState(false);

  return (
    <div>
      <button onClick={() => setDialog(true)}>open dialog</button>
      <Dialog
        show={dialog}
        setShow={(newVal) => setDialog(newVal)}
        overlayColor="rgba(0,0,0,.8)"
        width={750}
        maxWidth="90vw"
      >
        <div className="bg-white p-4">
          <h1>some text</h1>
        </div>
      </Dialog>
    </div>
  );
}
