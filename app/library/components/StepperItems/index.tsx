//for example check StepperHeaders folder

import { Children, cloneElement, useMemo } from "react";
import useLocaleDetails from "../../hooks/useLocaleDetails";

export type StepperItemsProps = {
  value: number;
  children: React.ReactNode;
  duration?: number;
  className?: string;
};

export default function StepperItems({
  value, //state of entire stepper
  children,
  duration = 300,
  className = "",
}: StepperItemsProps) {
  const { dir: localeDir } = useLocaleDetails();
  const movement = useMemo(() => {
    return (value - 1) * (localeDir === "ltr" ? -100 : 100);
  }, [value, localeDir]);
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex flex-nowrap transition-transform ease-linear"
        style={{
          transform: `translateX(${movement}%)`,
          transitionDuration: `${duration}ms`,
        }}
      >
        {Children.map(children, (step: any) => {
          return (
            <div className="min-w-full shrink-0">
              {cloneElement(step, {
                step: step.props.step,
                children: step.props.children,
                className: `${step.props.className}`,
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
