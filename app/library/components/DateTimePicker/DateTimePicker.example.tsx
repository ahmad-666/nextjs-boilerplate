import { useState } from "react";
import DateTimePicker from "./index";

export default function Example() {
  const [dateRange, setDateRange] = useState<string[]>([]);
  const [dateTime, setDateTime] = useState<string[]>([]);

  return (
    <div>
      <h1>1-value,min,max in gregory and calendar in gregory too :</h1>
      <DateTimePicker
        value={dateRange}
        onChange={(newVal) => setDateRange(newVal)}
        cols={2}
        range={true}
        valueType="gregory"
        calendar="gregory"
        min="2023/09/05"
        max="2023/09/25"
      />

      <h1>2-value,min,max in jalali but calendar in gregory :</h1>
      <DateTimePicker
        value={dateRange}
        onChange={(newVal) => setDateRange(newVal)}
        cols={2}
        range={true}
        valueType="jalali"
        calendar="gregory"
        min="1402/06/05"
        max="1402/06/25"
      />

      <h1>3-date-time</h1>
      <DateTimePicker
        type="datetime"
        format="YYYY/MM/DD HH:mm"
        value={dateTime}
        valueType="jalali"
        calendar="gregory"
        onChange={(newVal) => setDateTime(newVal)}
        range={true}
        min="1402/06/05 05:45"
        max="1405/06/25 20:05"
        cols={2}
      />
    </div>
  );
}
