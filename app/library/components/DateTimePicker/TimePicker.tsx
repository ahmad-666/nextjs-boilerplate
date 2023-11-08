import { useState, useMemo, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import TimeInput from "./TimeInput";
import type { TimePickerProps } from "./types";

export default function TimePicker({
  time, //something like '06:45'
  setTime,
  defaultToday = true,
  hint = true,
  min, //something like '06:45'
  max, //something like '06:45'
  format = "HH:mm",
  color = "primary",
  size = 50,
  title,
  disabled = false,
  className = "",
}: TimePickerProps) {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const formatDetails = useMemo(() => {
    const formatSplit = format.split(":");
    return {
      hour: formatSplit[0],
      minute: formatSplit[1],
    };
  }, [format]);
  const minMax = useMemo(() => {
    const minDay = min ? dayjs(min, format) : null;
    const maxDay = max ? dayjs(max, format) : null;
    const minHour = minDay ? +minDay.format(formatDetails.hour) : null;
    const maxHour = maxDay ? +maxDay.format(formatDetails.hour) : null;
    const minMinute =
      minDay && +hour === minHour ? +minDay.format(formatDetails.minute) : null;
    const maxMinute =
      maxDay && +hour === maxHour ? +maxDay.format(formatDetails.minute) : null;
    return {
      minDay,
      maxDay,
      minHour,
      maxHour,
      minMinute,
      maxMinute,
    };
  }, [hour, format, min, max, formatDetails]);
  const finalizeValue = useCallback(
    (h: string, m: string) => {
      if (h && m) {
        //only set parent's value if we have both hour,minute
        const d = dayjs(`${h}:${m}`, format);
        let finalizeDay = d;
        //check if selected hour/minute is inside min,max range or not
        if (minMax.minDay && d.isBefore(minMax.minDay))
          finalizeDay = minMax.minDay;
        else if (minMax.maxDay && d.isAfter(minMax.maxDay))
          finalizeDay = minMax.maxDay;
        setTime(finalizeDay.format(format));
      }
    },
    [format, minMax, setTime]
  );
  useEffect(() => {
    //set value of local states hour,minute
    if (time) {
      const d = dayjs(time, format);
      const h = d.format(formatDetails.hour);
      const m = d.format(formatDetails.minute);
      setHour(h);
      setMinute(m);
    } else if (defaultToday) {
      const today = dayjs();
      const h = today.format(formatDetails.hour);
      const m = today.format(formatDetails.minute);
      setHour(h);
      setMinute(m);
      finalizeValue(h, m);
    }
  }, [defaultToday, time, format, formatDetails, finalizeValue]);
  const hourChange = useCallback(
    (newHour: string) => {
      setHour(newHour);
      finalizeValue(newHour, minute);
    },
    [finalizeValue, minute]
  );
  const minuteChange = useCallback(
    (newMinute: string) => {
      setMinute(newMinute);
      finalizeValue(hour, newMinute);
    },
    [finalizeValue, hour]
  );
  return (
    <div className={`${className}`}>
      <p className="text-body2 font-bold text-title-main">{title}</p>
      <div className="dir-ltr mt-1 flex items-center gap-3">
        <TimeInput
          value={hour}
          setValue={hourChange}
          min={minMax.minHour}
          max={minMax.maxHour}
          defaultMax={24}
          color={color}
          size={size}
          disabled={disabled}
        />
        <span className="text-subtitle1 font-bold text-text-main">:</span>
        <TimeInput
          value={minute}
          setValue={minuteChange}
          min={minMax.minMinute}
          max={minMax.maxMinute}
          defaultMax={60}
          color={color}
          size={size}
          disabled={disabled}
        />
      </div>
      {hint && (min || max) && (
        <div className="mt-1 text-caption text-text-main">
          {min && <p>Min value is {min}</p>}
          {max && <p>max value is {max}</p>}
        </div>
      )}
    </div>
  );
}
