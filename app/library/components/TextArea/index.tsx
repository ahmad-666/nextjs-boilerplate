import FormField from "../FormField";
import type { TextAreaProps } from "../FormField/types";
export default function TextArea({ ...rest }: TextAreaProps) {
  return <FormField as="textarea" {...rest} />;
}
