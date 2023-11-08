import { Children, cloneElement } from "react";

export type ExpansionPanelProps = {
  value: number | string | (number | string)[];
  open?: boolean;
  toggleOpen?: () => void;
  children: React.ReactNode;
  className?: string;
};

export default function ExpansionPanel({
  value,
  open = false,
  toggleOpen,
  children,
  className = "",
}: ExpansionPanelProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      {Children.map(children, (comp: any, i) => {
        if (i === 0) {
          //<ExpansionPanelHeader>
          const panelHeader = comp;
          return cloneElement(panelHeader, {
            open,
            toggleOpen,
            children: panelHeader.props.children,
            hideAction: panelHeader.props.hideAction,
            actionJsx: panelHeader.props.actionJsx,
            className: panelHeader.props.className,
          });
        } else {
          //<ExpansionPanelContent>
          const panelContent = comp;
          return (
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-linear ${
                !open ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
              }`}
            >
              {cloneElement(panelContent, {
                children: panelContent.props.children,
                className: panelContent.props.className,
              })}
            </div>
          );
        }
      })}
    </div>
  );
}
