import Image from ".";
import ProgressCircular from "../ProgressCircular";

export default function Example() {
  return (
    <div>
      <Image
        src=""
        lazy={false}
        className="rounded"
        width={500}
        maxWidth="50%"
        maxHeight={200}
      />
      <Image src="" lazy={true} />
      <Image src="" lazy={true} lazySrc="" />
      <Image src="" className="bg-slate-300" fill="contain" />
      <Image src="" className="aspect-[10/2]" />
      <Image src="" overlay overlayClass="bg-black/50" />
      <Image
        src=""
        overlay
        overlayClass="bg-gradient-to-br from-pink-500/50 to-blue-500/50"
        overlayJsx={({ isIntersected, isLoaded }) => (
          <ProgressCircular indeterminate size={50} width={6} />
        )}
      />
    </div>
  );
}
