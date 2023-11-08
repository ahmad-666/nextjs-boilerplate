import Tooltip from ".";

export default function Example() {
  return (
    <div>
      <Tooltip pos="bottom" singleLine title="some tooltip">
        <button>hello</button>
      </Tooltip>
    </div>
  );
}
