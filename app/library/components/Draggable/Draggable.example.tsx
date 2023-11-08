import Draggable from ".";

export default function Example() {
  return (
    <div>
      <Draggable containerClassName="w-full gap-5">
        {[...new Array(10)].map((item, i) => (
          <div
            key={i}
            className="flex h-[300px] w-[300px] shrink-0 items-center justify-center bg-blue-600 text-h4 text-white"
          >
            {i}
          </div>
        ))}
      </Draggable>
      <Draggable dir="vertical" containerClassName="gap-5 h-[800px]">
        {[...new Array(10)].map((item, i) => (
          <div
            key={i}
            className="flex h-[300px] w-[300px] shrink-0 items-center justify-center bg-blue-600 text-h4 text-white"
          >
            {i}
          </div>
        ))}
      </Draggable>
    </div>
  );
}
