import FormField from "../FormField";
import type { AutoCompleteProps } from "../FormField/types";

export default function AutoComplete({ ...rest }: AutoCompleteProps) {
  return <FormField as="autocomplete" {...rest} />;
}
