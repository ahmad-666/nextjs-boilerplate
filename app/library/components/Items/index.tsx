import { Children, cloneElement, useEffect, useMemo } from "react";

export type ItemsSingle = {
  value: null | number | string;
  setValue: (val: null | number | string) => void;
  multiple: false;
};
export type ItemsMultiple = {
  value: (number | string)[];
  setValue: (val: (number | string)[]) => void;
  multiple: true;
};
export type NormalProps = {
  mandatory?: boolean;
  children: React.ReactNode;
  activeClass?: string;
  className?: string;
};
export type ItemsProps = (ItemsSingle | ItemsMultiple) & NormalProps;

export default function Items({
  value,
  setValue,
  multiple,
  mandatory = false,
  children,
  activeClass = "",
  className = "",
}: ItemsProps) {
  const firstValue = useMemo(() => {
    return (Children.toArray(children)[0] as React.ReactElement).props.value;
  }, [children]);
  useEffect(() => {
    if (mandatory) {
      if (!multiple && !value) setValue(firstValue);
      else if (multiple && !value.length) setValue([firstValue]);
    }
  }, [value, setValue, multiple, mandatory, firstValue]);
  return (
    <div className={`${className}`}>
      {Children.map(children, (item: any) => {
        const itemValue = item.props.value;
        const isActive = !multiple
          ? value === itemValue
          : value.includes(itemValue);
        return (
          <>
            {cloneElement(item, {
              value: itemValue,
              toggleItem: () => {
                if (!multiple) {
                  if (!isActive) setValue(itemValue);
                  else if (isActive && !mandatory) setValue(null);
                } else {
                  if (!isActive) setValue([...value, itemValue]);
                  else if (
                    isActive &&
                    (!mandatory || (mandatory && value.length > 1))
                  )
                    setValue(value.filter((v) => v !== itemValue));
                }
              },
              children: item.props.children,
              className: `${isActive ? activeClass : ""} ${
                item.props.className
              }`,
            })}
          </>
        );
      })}
    </div>
  );
}
