import HoverTracker from ".";

export default function Example() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-5 bg-slate-700 p-5">
        {[...new Array(8)].map((item, i) => (
          <HoverTracker key={i} size={400} color="rgba(255,255,255,.05)">
            <div className="h-[200px] overflow-hidden rounded-sm bg-slate-800" />
          </HoverTracker>
        ))}
      </div>
    </div>
  );
}
