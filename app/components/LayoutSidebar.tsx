"use client";
import { useState } from "react";
import Sidebar from "@/app/library/components/Sidebar";

export default function LayoutSidebar() {
  const [show, setShow] = useState(true);

  return (
    <Sidebar
      show
      color="slate-200"
      pushContent
      className="shadow-[5px_0px_20px_0px_rgba(0,0,0,.6)]"
      height="auto"
    >
      <button onClick={() => setShow(false)}>close</button>
      <h1>content</h1>
    </Sidebar>
  );
}
