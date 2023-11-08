import Timer from ".";
import dayjs from "dayjs";

const startDate = dayjs();
const endDate = dayjs().add(1, "day").add(5, "second");
const seconds = dayjs(endDate).diff(startDate, "seconds");

export default function Example() {
  return (
    <div>
      <Timer
        type={["day", "hour", "minute", "second"]}
        size="lg"
        value={seconds} //total number of seconds --> 1day,5seconds
      />
    </div>
  );
}
