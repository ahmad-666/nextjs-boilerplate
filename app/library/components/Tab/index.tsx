import { useCallback } from "react";
import Button from "../Button";

export type TabProps = {
  value: number | string;
  setValue?: (val: number | string) => void;
  color?: string;
  disabled?: boolean;
  children: React.ReactNode;
  href?: string;
  replace?: boolean;
  className?: string;
};

export default function Tab({
  value,
  setValue,
  color = "primary",
  disabled = false,
  children,
  href,
  replace = false,
  className = "",
}: TabProps) {
  const tabClicked = useCallback(() => {
    if (setValue) setValue(value);
  }, [value, setValue]);
  return (
    <div className={`${className}`}>
      <Button
        variant="text"
        color={color}
        disabled={disabled}
        width="100%"
        height="100%"
        href={href}
        replace={replace}
        onClick={tabClicked}
      >
        {children}
      </Button>
    </div>
  );
}
