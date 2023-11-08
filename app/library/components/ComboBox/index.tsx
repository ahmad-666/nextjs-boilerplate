import FormField from "../FormField";
import type { ComboBoxProps } from "../FormField/types";
export default function ComboBox({ ...rest }: ComboBoxProps) {
  return <FormField as="combobox" {...rest} />;
}
