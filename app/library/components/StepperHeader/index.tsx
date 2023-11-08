//for example check StepperHeaders folder

import { useMemo } from "react";
import Icon from "../Icon";
import useColorParser from "../../hooks/useColorParser";
import type { HeaderProps } from "../StepperHeaders";

export type StepperHeaderProps = HeaderProps & {
  step: number;
  title?: string;
  complete?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export default function StepperHeader({
  step, //not state of stepper and step of current specific header
  title,
  complete = false,
  completeColor = "success",
  disableColor = "disable-lighten1",
  completeIcon = "mdi:check",
  disableIcon = "mdi:close",
  size = "md",
  children, //for custom jsx of header
  className = "",
}: StepperHeaderProps) {
  const parsedCompleteColor = useColorParser(completeColor);
  const parsedDisabledColor = useColorParser(disableColor);
  const cssClass = useMemo(() => {
    let widthHeight = "";
    if (size === "sm") widthHeight = `w-[30px] h-[30px]`;
    else if (size === "md") widthHeight = `w-[40px] h-[40px]`;
    else if (size === "lg") widthHeight = `w-[50px] h-[50px]`;
    return `${widthHeight}`;
  }, [size]);
  return (
    <div className={`${className}`}>
      {children || (
        <div className="flex flex-col items-center">
          <div
            className={`flex items-center justify-center overflow-hidden rounded-circle ${cssClass}`}
            style={{
              backgroundColor: complete
                ? parsedCompleteColor
                : parsedDisabledColor,
            }}
          >
            <Icon
              icon={complete ? completeIcon : disableIcon}
              size={size}
              color={complete ? "white" : "disable"}
            />
          </div>
          <p
            className={`mt-2 max-w-[120px] text-center text-body1 ${
              complete ? "font-bold text-text-main" : "text-disable-main"
            }`}
          >
            {title}
          </p>
        </div>
      )}
    </div>
  );
}
