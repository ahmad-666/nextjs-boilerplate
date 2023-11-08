import { useRef, useState } from "react";
import Menu from ".";

export default function Example() {
  const [menu, setMenu] = useState(false);
  const activator = useRef<HTMLButtonElement>(null!);
  return (
    <div>
      <button ref={activator} onClick={() => setMenu((old) => !old)}>
        open menu
      </button>
      <Menu
        open={menu}
        setOpen={(newVal) => setMenu(newVal)}
        activatorRef={activator}
        position="left-bottom"
        fullWidth
        className="!bg-slate-200"
      >
        <ul>
          <li>1</li>
          <li>2</li>
        </ul>
      </Menu>
    </div>
  );
}
