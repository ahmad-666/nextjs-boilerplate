//activeDate is used for generateMonths method and via it we show days in ui and calendar that we show in ui is based on calendar prop
//each day has valueDate and valueDate is related to valueType prop means even if we show gregory calendar in ui but we pass valueType as 'jalali' valueDate is 'jalali' date of that gregory date that we show in ui
// ***IMPORTANT: for pure timepicker its better that we use <TimePicker /> component instead of <DateTimePicker type="time" />

import { useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import Button from "../Button";
import ClientOnly from "../ClientOnly";
import { useTranslations } from "next-intl";
import useColorParser from "../../hooks/useColorParser";
import type { DateTimePickerProps } from "./types";

export default function DateTimePicker({
  type = "date",
  value,
  onChange,
  range = false,
  valueType = "gregory", //type for value(input,output),min,max
  calendar = "gregory", //type for calendar that we show in ui
  changeCalendar,
  cols = 1,
  format = "YYYY/MM/DD", //for time,datetime we must use correct value e.g for time use 'HH:mm' and for datetime use 'YYYY/MM/DD HH:mm'
  min, //should be in same format of value(same format as 'format' prop value)
  max, //should be in same format of value(same format as 'format' prop value)
  yearPickerOffset = 100,
  yearMonthPickerGrid = {
    cols: 6,
    sm: 6,
    md: 4,
    lg: 3,
  },
  startTimeTitle,
  endTimeTitle,
  mobileBreakpoint = 600,
  bgColor = "card",
  color = "primary", //color for selected date,toggle calendar btn, active year/month
  textColor = "text",
  betweenColor = "primary-lighten2", //for days between two selected day on multiple:true
  disableColor = "disable", //for dates that are bellow min or higher than max
  todayColor = "secondary", //for today color btn,today color date
  size = 40,
  showToggleCalendarBtn = true,
  dayJsx,
  className = "",
}: DateTimePickerProps) {
  const t = useTranslations("dateTimePicker");
  const [calendarLocal, setCalendarLocal] = useState(calendar);
  const parsedBgColor = useColorParser(bgColor);
  const translations = useMemo(() => {
    return {
      startTimeTitle: startTimeTitle || t("startTimeTitle"),
      endTimeTitle: endTimeTitle || t("endTimeTitle"),
      today: t("today"),
      clear: t("clear"),
      toggleCalendar: t("toggleCalendar", {
        type: calendarLocal === "gregory" ? t("jalali") : t("gregory"),
      }),
    };
  }, [calendarLocal, startTimeTitle, endTimeTitle, t]);
  const hasDate = useMemo(() => {
    return type === "date" || type === "datetime";
  }, [type]);
  const hasTime = useMemo(() => {
    return type === "time" || type === "datetime";
  }, [type]);
  const formatDetails = useMemo(() => {
    const formatSplit = format.split(" ");
    return {
      date: hasDate ? formatSplit[0] : null,
      time:
        type === "time"
          ? formatSplit[0]
          : type === "datetime"
          ? formatSplit[1]
          : null,
    };
  }, [format, type, hasDate]);
  const dateTimeValues = useMemo(() => {
    let date: null | string | string[] = null;
    let timeStart: null | string = null;
    let timeEnd: null | string = null;
    let timeStartDisabled = false;
    let timeEndDisabled = false;
    if (type === "date") {
      date = value;
    } else if (type === "time") {
      if (!range) {
        timeStart = (value as string) || null;
      } else {
        timeStart = value?.[0] || null;
        timeEnd = value?.[1] || null;
      }
    } else if (type === "datetime") {
      if (!range) {
        const d = value ? dayjs(value as string, format) : null;
        if (d) {
          date = d.format(formatDetails.date!);
          timeStart = d.format(formatDetails.time!);
        } else {
          timeStartDisabled = true;
        }
      } else {
        const d1 = value?.[0] ? dayjs(value?.[0], format) : null;
        const d2 = value?.[1] ? dayjs(value?.[1], format) : null;
        const dates = [];
        if (d1) {
          dates.push(d1.format(formatDetails.date!));
          timeStart = d1.format(formatDetails.time!);
        } else {
          timeStartDisabled = true;
        }
        if (d2) {
          dates.push(d2.format(formatDetails.date!));
          timeEnd = d2.format(formatDetails.time!);
        } else {
          timeEndDisabled = true;
        }
        date = dates;
      }
    }
    return {
      date: date || (!range ? null : []),
      timeStart: timeStart || dayjs().format(formatDetails.time!), //default time is alway current-time
      timeEnd: timeEnd || dayjs().format(formatDetails.time!), //default time is alway current-time
      timeStartDisabled,
      timeEndDisabled,
    };
  }, [format, formatDetails, range, type, value]);
  const minMax = useMemo(() => {
    let datePickerMin = null;
    let datePickerMax = null;
    let timePickerStartMin = null;
    let timePickerStartMax = null;
    let timePickerEndMin = null;
    let timePickerEndMax = null;
    if (type === "date") {
      datePickerMin = min || null;
      datePickerMax = max || null;
    } else if (type === "time") {
      timePickerStartMin = min || null;
      timePickerStartMax = max || null;
      if (range) {
        timePickerEndMin = min || null;
        timePickerEndMax = max || null;
      }
    } else if (type === "datetime") {
      const minD = dayjs(min, format);
      const maxD = dayjs(max, format);
      datePickerMin = minD ? minD.format(formatDetails.date!) : null;
      datePickerMax = maxD ? maxD.format(formatDetails.date!) : null;
      if (!range) {
        timePickerStartMin = minD ? minD.format(formatDetails.time!) : null;
        timePickerStartMax = maxD ? maxD.format(formatDetails.time!) : null;
      } else {
        timePickerStartMin =
          minD && dateTimeValues.date?.[0] === datePickerMin
            ? minD.format(formatDetails.time!)
            : null;
        timePickerEndMax =
          maxD && dateTimeValues.date?.[1] === datePickerMax
            ? maxD.format(formatDetails.time!)
            : null;
      }
    }
    return {
      datePickerMin,
      datePickerMax,
      timePickerStartMin,
      timePickerStartMax,
      timePickerEndMin,
      timePickerEndMax,
    };
  }, [dateTimeValues.date, format, formatDetails, max, min, range, type]);
  const toggleCalendar = useCallback(() => {
    const newCalendar = calendarLocal === "gregory" ? "jalali" : "gregory";
    setCalendarLocal(newCalendar);
    if (changeCalendar) changeCalendar(newCalendar);
  }, [calendarLocal, changeCalendar]);
  const clearHandler = useCallback(() => {
    onChange((!range ? null : []) as any);
  }, [range, onChange]);
  const dateChange = useCallback(
    (date: null | string | string[]) => {
      const { timeStart, timeEnd } = dateTimeValues;
      let finalValue: null | string | string[];
      if (type === "date") finalValue = date;
      else if (type === "datetime") {
        if (!range) {
          if (date && timeStart) finalValue = `${date} ${timeStart}`;
        } else {
          const results = [];
          if (date?.[0] && timeStart) results.push(`${date?.[0]} ${timeStart}`);
          if (date?.[1] && timeEnd) results.push(`${date?.[1]} ${timeEnd}`);
          finalValue = results;
        }
      }
      onChange(finalValue! as any);
    },
    [dateTimeValues, range, onChange, type]
  );
  const timeStartChange = useCallback(
    (timeStart: null | string) => {
      const { date, timeEnd } = dateTimeValues;
      let finalValue: null | string | string[];
      if (type === "time") {
        if (!range) finalValue = timeStart;
        else {
          const times = [];
          if (timeStart) times.push(timeStart);
          if (timeEnd) times.push(timeEnd);
          finalValue = times;
        }
      } else if (type === "datetime") {
        if (!range) {
          if (date && timeStart) finalValue = `${date} ${timeStart}`;
        } else {
          const results = [];
          if (date?.[0] && timeStart) results.push(`${date?.[0]} ${timeStart}`);
          if (date?.[1] && timeEnd) results.push(`${date?.[1]} ${timeEnd}`);
          finalValue = results;
        }
      }
      onChange(finalValue! as any);
    },
    [dateTimeValues, range, onChange, type]
  );
  const timeEndChange = useCallback(
    (timeEnd: null | string) => {
      const { date, timeStart } = dateTimeValues;
      let finalValue: null | string | string[];
      if (type === "time") {
        if (!range) finalValue = timeStart;
        else {
          const times = [];
          if (timeStart) times.push(timeStart);
          if (timeEnd) times.push(timeEnd);
          finalValue = times;
        }
      } else if (type === "datetime") {
        if (!range) {
          if (date && timeStart) finalValue = `${date} ${timeStart}`;
        } else {
          const results = [];
          if (date?.[0] && timeStart) results.push(`${date?.[0]} ${timeStart}`);
          if (date?.[1] && timeEnd) results.push(`${date?.[1]} ${timeEnd}`);
          finalValue = results;
        }
      }
      onChange(finalValue! as any);
    },
    [dateTimeValues, range, onChange, type]
  );
  return (
    <ClientOnly>
      <div
        className={`inline-block overflow-hidden rounded-sm p-4 ${className}`}
        style={{
          backgroundColor: parsedBgColor,
        }}
      >
        {hasDate && (
          <DatePicker
            range={range}
            date={dateTimeValues.date as any}
            setDate={dateChange}
            valueType={valueType}
            calendar={calendarLocal}
            format={formatDetails.date!}
            cols={cols}
            min={minMax.datePickerMin}
            max={minMax.datePickerMax}
            mobileBreakpoint={mobileBreakpoint}
            size={size}
            yearPickerOffset={yearPickerOffset}
            yearMonthPickerGrid={yearMonthPickerGrid}
            textColor={textColor}
            color={color}
            betweenColor={betweenColor}
            disableColor={disableColor}
            todayColor={todayColor}
            todayText={translations.today}
            dayJsx={dayJsx}
          />
        )}
        {hasTime && (
          <div
            className={`flex items-center justify-around gap-4 ${
              hasDate ? "mt-4" : ""
            }`}
          >
            <TimePicker
              title={translations.startTimeTitle}
              time={dateTimeValues.timeStart}
              disabled={dateTimeValues.timeStartDisabled}
              setTime={timeStartChange}
              format={formatDetails.time!}
              min={minMax.timePickerStartMin}
              max={minMax.timePickerStartMax}
              color={color}
              size={size}
              defaultToday
            />
            {range && (
              <TimePicker
                title={translations.endTimeTitle}
                time={dateTimeValues.timeEnd}
                disabled={dateTimeValues.timeEndDisabled}
                setTime={timeEndChange}
                format={formatDetails.time!}
                min={minMax.timePickerEndMin}
                max={minMax.timePickerEndMax}
                color={color}
                size={size}
                defaultToday
              />
            )}
          </div>
        )}
        {hasDate && (
          <div className="mt-4 flex items-center  gap-4">
            <Button
              variant="filled"
              size="sm"
              color="error"
              onClick={clearHandler}
            >
              {translations.clear}
            </Button>
            {showToggleCalendarBtn && (
              <Button
                variant="filled"
                size="sm"
                color={color}
                onClick={toggleCalendar}
              >
                {translations.toggleCalendar}
              </Button>
            )}
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
