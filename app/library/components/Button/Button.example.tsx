import Button from ".";
import Icon from "../Icon";

export default function Example() {
  return (
    <div>
      <Button variant="filled" color="primary">
        <Icon icon="mdi:close" size="sm" color="white" />
        Some text
      </Button>
    </div>
  );
}
