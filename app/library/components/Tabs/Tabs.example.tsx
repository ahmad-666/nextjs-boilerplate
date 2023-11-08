import { useState } from "react";
import Tabs from ".";
import Tab from "../Tab";
import TabContent from "../TabContent";
import TabsContents from "../TabsContents";

const items = [
  { value: 1, text: "1" },
  { value: 2, text: "2" },
];
export default function Example() {
  const [tab, setTab] = useState(1);
  return (
    <div>
      <Tabs tab={tab} setTab={(t: any) => setTab(t)}>
        {items.map((t) => (
          <Tab key={t.value} value={t.value}>
            {t.text}
          </Tab>
        ))}
      </Tabs>
      <TabsContents tab={tab}>
        {items.map((t) => (
          <TabContent key={t.value} value={t.value}>
            {t.text}
          </TabContent>
        ))}
      </TabsContents>
    </div>
  );
}
