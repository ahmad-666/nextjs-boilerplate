import { Children, cloneElement } from "react";
import useColorParser from "../../hooks/useColorParser";

export type HeaderProps = {
  completeColor?: string;
  disableColor?: string;
  completeIcon?: string;
  disableIcon?: string;
  size?: "sm" | "md" | "lg";
};
export type StepperHeadersProps = HeaderProps & {
  children: React.ReactNode;
  spacing?: number;
  dividerClassName?: string;
  className?: string;
};

export default function StepperHeaders({
  completeColor = "success",
  disableColor = "disable-lighten1",
  completeIcon = "mdi:check",
  disableIcon = "mdi:close",
  size = "md",
  children,
  spacing = 4,
  dividerClassName = "",
  className = "",
}: StepperHeadersProps) {
  const parsedCompleteColor = useColorParser(completeColor);
  const parsedDisabledColor = useColorParser(disableColor);
  return (
    <div className={`${className}`}>
      <div
        className="flex items-center justify-center"
        style={{ columnGap: `${spacing * 4}px` }}
      >
        {Children.map(children, (header: any, i: number) => {
          return (
            <>
              {Array.isArray(children) && i !== 0 ? (
                <div
                  className={`h-[2px] grow ${dividerClassName}`}
                  style={{
                    backgroundColor: header.props.complete
                      ? parsedCompleteColor
                      : parsedDisabledColor,
                  }}
                ></div>
              ) : null}
              {cloneElement(header, {
                step: header.props.step,
                complete: header.props.complete,
                title: header.props.title,
                completeColor: header.props.completeColor || completeColor,
                disableColor: header.props.disableColor || disableColor,
                completeIcon: header.props.completeIcon || completeIcon,
                disableIcon: header.props.disableIcon || disableIcon,
                size: header.props.size || size,
                children: header.props.children,
                className: `shrink-0 ${header.props.className}`,
              })}
            </>
          );
        })}
      </div>
    </div>
  );
}
