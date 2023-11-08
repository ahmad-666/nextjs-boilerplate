import FormField from "../FormField";
import type { SelectProps } from "../FormField/types";
export default function Select({ ...rest }: SelectProps) {
  return <FormField as="select" {...rest} />;
}
