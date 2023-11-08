import Avatar from ".";
import Image from "next/image";

export default function Example() {
  return (
    <div>
      <Avatar
        color="primary"
        size={50}
        outlineWidth={4}
        outlineColor="purple-500"
      >
        <Image
          src="/imgs/img-1.jpg"
          alt="img"
          width={300}
          height={300}
          className="object-cover"
        />
      </Avatar>
    </div>
  );
}
