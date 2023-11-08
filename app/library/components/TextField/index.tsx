import FormField from "../FormField";
import type { TextFieldProps } from "../FormField/types";
export default function TextField({ ...rest }: TextFieldProps) {
  return <FormField as="textfield" {...rest} />;
}
