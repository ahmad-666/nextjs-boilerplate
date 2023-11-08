import Tilt from ".";
import Image from "next/image";

export default function Example() {
  return (
    <div>
      <Tilt
        className="h-[300px] w-[300px] p-5"
        trackerColor="rgba(255,255,255,.3)"
      >
        <Image
          src="/imgs/img-1.jpg"
          alt="img"
          width={750}
          height={750}
          className="h-full w-full object-cover"
        />
      </Tilt>
    </div>
  );
}
