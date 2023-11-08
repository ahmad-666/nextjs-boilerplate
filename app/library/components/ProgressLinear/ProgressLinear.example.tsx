import ProgressLinear from ".";

export default function Example() {
  return (
    <div>
      <ProgressLinear
        indeterminate
        color="secondary"
        height={5}
        className="w-1/2"
      />
    </div>
  );
}
