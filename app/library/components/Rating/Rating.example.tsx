import { useState } from "react";
import Rating from ".";

export default function Example() {
  const [score, setScore] = useState(3.7);

  return (
    <div>
      <Rating
        value={score}
        setValue={(newVal) => setScore(newVal)}
        halfIncrement
        hover
        length={5}
        size={30}
      ></Rating>
    </div>
  );
}
