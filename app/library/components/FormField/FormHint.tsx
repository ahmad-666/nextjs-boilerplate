//only used inside FormField.tsx,... component and should not be used standalone

import useColorParser from "../../hooks/useColorParser";

export type FormHintProps = {
  errorColor?: string;
  textColor?: string;
  hideDetails?: boolean;
  error?: string;
  hint?: string;
  className?: string;
};

export default function FormHint({
  errorColor = "error",
  textColor = "text-lighten1",
  hideDetails = false,
  error = "",
  hint = "",
  className = "",
}: FormHintProps) {
  const parsedErrorColor = useColorParser(errorColor);
  const parsedTextColor = useColorParser(textColor);
  if (hideDetails) return null;
  return (
    <div className={`mt-1 min-h-[25px] px-1 text-caption ${className}`}>
      {error && <p style={{ color: parsedErrorColor }}>{error}</p>}
      {hint && !error && <p style={{ color: parsedTextColor }}>{hint}</p>}
    </div>
  );
}
