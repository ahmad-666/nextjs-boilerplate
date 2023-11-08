import { useState } from "react";
import Snackbar from ".";

export default function Example() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow((old) => !old)}>toggle snackbar</button>
      <Snackbar
        show={show}
        setShow={(val) => setShow(val)}
        closable
        timeout={3000}
        color="success"
      >
        <p>some text here</p>
      </Snackbar>
    </div>
  );
}
