import HorizontalScroll from ".";

export default function Example() {
  return (
    <div>
      <HorizontalScroll>
        {[...new Array(10)].map((item, i) => (
          <div key={i} className="h-[300px] w-[300px] shrink-0 bg-sky-500" />
        ))}
      </HorizontalScroll>
    </div>
  );
}
