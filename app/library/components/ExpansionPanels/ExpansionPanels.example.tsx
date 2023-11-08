import { useState } from "react";
import ExpansionPanels from ".";
import ExpansionPanel from "../ExpansionPanel";
import ExpansionPanelHeader from "../ExpansionPanelHeader";
import ExpansionPanelContent from "../ExpansionPanelContent";

const panels = [
  { value: 1, header: "header#1", content: "content#1" },
  { value: 2, header: "header#2", content: "content#2" },
];
export default function Example() {
  const [panel, setPanel] = useState<null | number>(1);
  return (
    <div>
      <ExpansionPanels
        multiple={false}
        value={panel}
        setValue={(v: any) => setPanel(v)}
      >
        {panels.map((p) => (
          <ExpansionPanel
            className="my-4 rounded-sm"
            key={p.value}
            value={p.value}
          >
            <ExpansionPanelHeader
              className="bg-slate-100 p-4"
              contentClass="text-h6 text-slate-900"
              actionJsx={(isOpen) => (isOpen ? "open" : "close")}
            >
              {p.header}
            </ExpansionPanelHeader>
            <ExpansionPanelContent className="bg-slate-200 p-6 text-subtitle1 text-slate-700">
              {p.content}
            </ExpansionPanelContent>
          </ExpansionPanel>
        ))}
      </ExpansionPanels>
    </div>
  );
}
