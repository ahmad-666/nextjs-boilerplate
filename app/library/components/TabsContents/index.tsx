//for animating active tab we should use this component
import { Children, cloneElement } from "react";

export type TabsContentsProps = {
  tab: number | string;
  children: React.ReactNode;
  className?: string;
};

export default function TabsContents({
  tab,
  children,
  className = "",
}: TabsContentsProps) {
  return (
    <div className={`${className}`}>
      {Children.map(children, (tabContent: any) => {
        return (
          tab === tabContent.props.value && (
            <div key={tabContent.props.value}>
              {cloneElement(tabContent, {
                value: tabContent.props.value,
                className: tabContent.props.className,
              })}
            </div>
          )
        );
      })}
    </div>
  );
}
