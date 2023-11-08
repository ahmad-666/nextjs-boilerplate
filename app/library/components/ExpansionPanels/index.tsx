import { Children, cloneElement } from "react";

export type SingleExpansionPanel = {
  value: null | number | string;
  setValue: (val: null | number | string) => void;
  multiple: false;
};
export type MultipleExpansionPanel = {
  value: (number | string)[];
  setValue: (val: (number | string)[]) => void;
  multiple: true;
};
export type NormalProps = {
  children: React.ReactNode;
  activeClass?: string;
  className?: string;
};
export type ExpansionPanelsProps = (
  | SingleExpansionPanel
  | MultipleExpansionPanel
) &
  NormalProps;

export default function ExpansionPanels({
  value,
  setValue,
  multiple,
  children,
  activeClass = "",
  className = "",
}: ExpansionPanelsProps) {
  return (
    <div className={`${className}`}>
      {Children.map(children, (panel: any) => {
        const isOpen = !multiple
          ? value === panel.props.value
          : value.includes(panel.props.value);
        return (
          <>
            {cloneElement(panel, {
              open: isOpen,
              toggleOpen: () => {
                if (!multiple) {
                  if (!isOpen) setValue(panel.props.value);
                  else setValue(null);
                } else {
                  if (!isOpen) setValue([...value, panel.props.value]);
                  else setValue(value.filter((v) => v !== panel.props.value));
                }
              }, //this if function reference
              value: panel.props.value,
              children: panel.props.children,
              className: `${isOpen ? activeClass : ""} ${
                panel.props.className
              }`,
            })}
          </>
        );
      })}
    </div>
  );
}
