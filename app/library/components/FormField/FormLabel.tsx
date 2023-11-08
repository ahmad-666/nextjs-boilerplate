import Icon from "../Icon";
import type { FormLabelProps } from "./types";

export default function FormLabel({
  as,
  children,
  labelPos,
  asterisk = false,
  isActive = false,
  id,
  color,
  className,
}: FormLabelProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center ${
        labelPos === "inside"
          ? "pointer-events-none absolute ltr:left-0 ltr:origin-left rtl:right-0 rtl:origin-right"
          : "font-bold"
      } ${!isActive ? "scale-100" : "scale-75"} ${
        labelPos === "inside" && !isActive && as !== "textarea"
          ? "top-1/2 -translate-y-1/2"
          : ""
      } ${
        labelPos === "inside" && !isActive && as === "textarea"
          ? "top-0 translate-y-0"
          : ""
      } ${
        labelPos === "inside" && isActive ? "top-0 translate-y-[-40%]" : ""
      } ${className}`}
      style={{
        color,
      }}
    >
      {asterisk && (
        <Icon
          icon="mdi:asterisk"
          size={8}
          color="error-lighten1"
          className="me-1 shrink-0"
        />
      )}
      <span className="line-clamp-1 grow">{children}</span>
    </label>
  );
}
