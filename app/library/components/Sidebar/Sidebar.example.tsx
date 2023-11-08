import { useState } from "react";
import Sidebar from ".";

export default function Example() {
  const [show, setShow] = useState(true);

  return (
    <div>
      <h1>1-sidebar with overlay :</h1>
      <Sidebar
        show={show}
        onChange={(val) => setShow(val)}
        color="slate-200"
        hasOverlay
        hideBodyScrollOnOpen
        className="shadow-[5px_0px_20px_0px_rgba(0,0,0,.6)] "
      >
        <div className="max-h-full overflow-auto">
          <button onClick={() => setShow(false)}>close</button>
          <h1>content</h1>
        </div>
      </Sidebar>

      <h1>2-off-canvas sidebar that will push content :</h1>
      <Sidebar
        show={show}
        pushContent
        className="shadow-[5px_0px_20px_0px_rgba(0,0,0,.2)]"
      >
        <button onClick={() => setShow(false)}>close</button>
        <h1>content</h1>
      </Sidebar>

      <h1>3-absolute menu + expandOnHover :</h1>
      {/* layout.tsx: <main className="ps-10">{children}</main>
        add pl to <main> because we use 'left' prop on sidebar */}
      <Sidebar
        show
        miniWidth={60}
        expandOnHover
        pushContent
        absolute
        top={20}
        bottom={20}
        left={20}
        height="auto"
        className="shadow-[0px_0px_20px_0px_rgba(0,0,0,.2)]"
      >
        <p>some content</p>
      </Sidebar>
    </div>
  );
}
