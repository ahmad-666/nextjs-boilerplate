import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import Button from "../Button";
import Icon from "../Icon";
import Divider from "../Divider";
import YearPicker from "./YearPicker";
import MonthPicker from "./MonthPicker";
import useColorParser from "../../hooks/useColorParser";
import type { Dayjs } from "dayjs";
import type { DatePickerProps, Month, Day, Mode } from "./types";
import useMediaQuery from "../../hooks/useMediaQuery";

export default function DatePicker({
  date,
  setDate,
  range = false,
  valueType = "gregory", //type for value(input,output),min,max
  calendar = "gregory", //type for calendar that we show in ui
  cols = 1,
  format = "YYYY/MM/DD",
  min,
  max,
  mobileBreakpoint = 600,
  size = 40,
  yearPickerOffset = 100,
  yearMonthPickerGrid = {
    cols: 6,
    sm: 6,
    md: 4,
    lg: 3,
  },
  color = "primary",
  textColor = "text",
  betweenColor = "primary-lighten2",
  disableColor = "disable",
  todayColor = "secondary",
  todayText,
  dayJsx,
  className = "",
}: DatePickerProps) {
  const isMobile = useMediaQuery(`(width<=${mobileBreakpoint}px)`);
  const [activeDate, setActiveDate] = useState<Dayjs>(dayjs());
  const [months, setMonths] = useState<Month[]>([]);
  const [hoveredDay, setHoveredDay] = useState<null | Day>(null);
  const [year, setYear] = useState<null | number>(null);
  const [month, setMonth] = useState<null | number>(null);
  const [mode, setMode] = useState<Mode>("date-picker");
  const parsedColor = useColorParser(color);
  const parsedTextColor = useColorParser(textColor);
  const parsedBetweenColor = useColorParser(betweenColor);
  const parsedTodayColor = useColorParser(todayColor);
  const parsedDisableColor = useColorParser(disableColor);
  const parsedDividerColor = useColorParser("divider");
  const dateInfo = useMemo(() => {
    return {
      valueIsJalali: valueType === "jalali", //for input(date,date[0],date[1],min,max)
      calendarIsJalali: calendar === "jalali", //for output(calendar in ui)
      valueCalendar: valueType, //for input(date,date[0],date[1],min,max)
      calendar: calendar, //for output(calendar in ui)
      locale: calendar === "gregory" ? "en" : "fa", //for output(calendar in ui)
    };
  }, [valueType, calendar]);
  const weekdays = useMemo(() => {
    if (dateInfo.calendar === "gregory")
      return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    else return ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  }, [dateInfo]);
  const formatDetails = useMemo(() => {
    return {
      year: format.replace(/[^Y]/g, ""),
      month: format.replace(/[^M]/g, ""),
      day: format.replace(/[^D]/g, ""),
    };
  }, [format]);
  const todayDate = useMemo(() => {
    const d = dayjs().calendar(dateInfo.calendar).locale(dateInfo.locale);
    return {
      date: d,
      year: d.format(formatDetails.year),
      month: d.format(formatDetails.month),
      day: d.format(formatDetails.day),
    };
  }, [dateInfo, formatDetails]);
  const minMaxDate = useMemo(() => {
    return {
      min: min ? dayjs(min, { jalali: dateInfo.valueIsJalali }) : null,
      max: max ? dayjs(max, { jalali: dateInfo.valueIsJalali }) : null,
    };
  }, [min, max, dateInfo]);
  const monthNums = useMemo(() => {
    if (isMobile) return 1;
    return cols;
  }, [cols, isMobile]);
  const direction = useMemo(() => {
    return calendar === "gregory" ? "ltr" : "rtl";
  }, [calendar]);
  const generateMonths = useCallback(() => {
    const allMonths: Month[] = [];
    for (let i = 0; i < monthNums; i++) {
      const monthDay = activeDate.add(i, "month");
      const year = +monthDay.format(formatDetails.year);
      const month = +monthDay.format(formatDetails.month);
      const monthName = monthDay.format("MMMM");
      const daysInMonth = monthDay.daysInMonth();
      const monthStartDate = monthDay.startOf("month");
      const monthEndDate = monthDay.endOf("month");
      const monthStartDayWeekIndex = monthStartDate.weekday();
      const days: Day[] = [];
      for (let i = 0; i < 42; i++) {
        //6 rows and seven columns
        const isPrevMonth = i < monthStartDayWeekIndex;
        const isNextMonth = i >= monthStartDayWeekIndex + daysInMonth;
        let dayDate = null;
        if (isPrevMonth) {
          dayDate = monthStartDate.subtract(monthStartDayWeekIndex - i, "day");
        } else if (isNextMonth) {
          dayDate = monthEndDate.add(
            i - daysInMonth - monthStartDayWeekIndex + 1,
            "day"
          );
        } else {
          dayDate = monthStartDate.add(i - monthStartDayWeekIndex, "day");
        }
        const dayFormat = dayDate.format(formatDetails.day);
        const day = +dayFormat;
        const valueDate = dayDate
          .calendar(dateInfo.valueCalendar)
          .format(format);
        const calendarDate = dayDate.calendar(dateInfo.calendar).format(format);
        const dayInstance = dayjs(calendarDate, {
          jalali: dateInfo.calendarIsJalali,
        });
        const isToday = dayInstance.isToday();
        const isMin = minMaxDate.min
          ? dayInstance.isBefore(minMaxDate.min)
          : false;
        const isMax = minMaxDate.max
          ? dayInstance.isAfter(minMaxDate.max)
          : false;
        const singleSelected = !!(!range && date && date === valueDate);
        const rangeStartSelected = !!(
          range &&
          date?.[0] &&
          date[0] === valueDate
        );
        const rangeEndSelected = !!(
          range &&
          date?.[1] &&
          date[1] === valueDate
        );
        const isSelected =
          singleSelected || rangeStartSelected || rangeEndSelected;
        const isBetween = !!(
          range &&
          date?.[0] &&
          date?.[1] &&
          dayInstance.isBetween(
            dayjs(date[0], { jalali: dateInfo.valueIsJalali }),
            dayjs(date[1], { jalali: dateInfo.valueIsJalali })
          )
        );
        days.push({
          day,
          dayFormat,
          valueDate,
          calendarDate,
          isPrevMonth,
          isNextMonth,
          isToday,
          isMin,
          isMax,
          isSelected,
          isBetween,
        });
      }
      const newMonth: Month = {
        year,
        month,
        monthName,
        days,
      };
      allMonths.push(newMonth);
    }
    setMonths(allMonths);
  }, [
    monthNums,
    activeDate,
    formatDetails,
    format,
    dateInfo,
    minMaxDate,
    range,
    date,
  ]);
  const getDayColor = useCallback(
    (day: Day) => {
      let bgColor = "transparent";
      let color = parsedTextColor;
      let borderRadius = "0rem";
      const dayD = dayjs(day.valueDate, {
        jalali: dateInfo.valueIsJalali,
      });
      const rangeStartD =
        range && date?.[0]
          ? dayjs(date[0], { jalali: dateInfo.valueIsJalali })
          : null;
      const hoveredD = hoveredDay
        ? dayjs(hoveredDay?.valueDate, {
            jalali: dateInfo.valueIsJalali,
          })
        : null;
      if (day.isSelected) {
        bgColor = parsedColor;
        color = "white";
        if (!range) borderRadius = ".5rem";
        else if (range && date?.[0] === day.valueDate) {
          borderRadius =
            direction === "ltr" ? ".5rem 0 0 .5rem" : "0 .5rem .5rem 0";
        } else if (range && date?.[1] === day.valueDate) {
          borderRadius =
            direction === "ltr" ? "0 .5rem .5rem 0" : ".5rem 0 0 .5rem";
        }
      } else if (
        day.isBetween ||
        (dayD.isAfter(rangeStartD || "") && dayD.isSameOrBefore(hoveredD || ""))
      ) {
        bgColor = parsedBetweenColor;
        color = "white";
      } else if (day.isToday) {
        bgColor = parsedTodayColor;
        color = "white";
        borderRadius = ".5rem";
      } else if (day.isMin || day.isMax) {
        color = parsedDisableColor;
      }
      return {
        bgColor,
        color,
        borderRadius,
      };
    },
    [
      date,
      range,
      parsedBetweenColor,
      parsedColor,
      parsedTextColor,
      parsedTodayColor,
      parsedDisableColor,
      hoveredDay,
      dateInfo,
      direction,
    ]
  );
  const selectDay = useCallback(
    (day: Day) => {
      const dayValue = day.valueDate;
      let finalValue: string | string[];
      if (!range) finalValue = dayValue;
      else if ((!date?.[0] && !date?.[1]) || (date[0] && date[1]))
        finalValue = [dayValue];
      else if (date[0] && !date[1]) {
        const selectedDay = dayjs(dayValue, {
          jalali: dateInfo.valueIsJalali,
        });
        const startDay = dayjs(date[0], { jalali: dateInfo.valueIsJalali });
        if (selectedDay.isSameOrBefore(startDay)) finalValue = [dayValue];
        else finalValue = [date[0], dayValue];
      }
      setDate(finalValue! as any);
    },
    [date, dateInfo, range, setDate]
  );
  const prevMonth = useCallback(() => {
    setActiveDate((old) => old.subtract(1, "month"));
  }, []);
  const nextMonth = useCallback(() => {
    setActiveDate((old) => old.add(1, "month"));
  }, []);
  const dayMouseEnterHandler = useCallback(
    (day: Day) => {
      if (range && date?.[0] && !date[1]) setHoveredDay(day);
    },
    [range, date]
  );
  const dayMouseLeaveHandler = useCallback((day: Day) => {
    setHoveredDay(null);
  }, []);
  const monthClickHandler = useCallback(() => {
    setMode("month-picker");
  }, [setMode]);
  const yearClickHandler = useCallback(() => {
    setMode("year-picker");
  }, [setMode]);
  const showTodayHandler = useCallback(() => {
    setActiveDate(todayDate.date);
  }, [todayDate]);
  const setNewYearHandler = useCallback((newYear: number) => {
    setYear(newYear);
    setActiveDate((old) => old.year(newYear));
    setMode("date-picker");
  }, []);
  const setNewMonthHandler = useCallback((newMonth: number) => {
    setMonth(newMonth);
    setActiveDate((old) => old.month(newMonth - 1));
    setMode("date-picker");
  }, []);
  const returnToCalendarHandler = useCallback(() => {
    setMode("date-picker");
  }, []);
  useEffect(() => {
    let day;
    if (!range) day = date;
    else day = date?.[0];
    const d = dayjs((day as any) || undefined, {
      jalali: dateInfo.valueIsJalali,
    })
      .calendar(dateInfo.calendar)
      .locale(dateInfo.locale);
    setActiveDate(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, dateInfo]); //***Don't add 'date' as dependency
  useEffect(() => {
    setYear(+activeDate.format("YYYY")); //year is always in YYYY format
    setMonth(+activeDate.format("M")); //month is always in M format
    generateMonths();
  }, [activeDate, generateMonths]);
  return (
    <div
      className={`${className}`}
      style={{
        direction,
      }}
    >
      {mode === "date-picker" && (
        <>
          <div className="flex overflow-auto">
            {months.map((month, monthIndex) => (
              <div
                key={month.month}
                className={`shrink-0 border-0 border-solid px-2 last:border-none ${
                  direction === "ltr" ? "border-r" : "border-l"
                }`}
                style={{
                  borderColor: parsedDividerColor,
                }}
              >
                <div className="flex items-center justify-between gap-x-4">
                  <Button
                    className={`!p-0 ${
                      monthIndex !== 0 ? "pointer-events-none opacity-0" : ""
                    }`}
                    variant="text"
                    color={color}
                    onClick={prevMonth}
                  >
                    <Icon
                      icon={`${
                        direction === "ltr"
                          ? "mdi:chevron-left"
                          : "mdi:chevron-right"
                      }`}
                      size="sm"
                      color={textColor}
                    />
                  </Button>
                  <div
                    className="flex cursor-pointer gap-2 text-body1 font-bold"
                    style={{ color: parsedTextColor }}
                  >
                    <span onClick={monthClickHandler}>{month.monthName}</span>
                    <span onClick={yearClickHandler}>{month.year}</span>
                  </div>
                  <Button
                    className={`!p-0 ${
                      monthIndex !== months.length - 1
                        ? "pointer-events-none opacity-0"
                        : ""
                    }`}
                    variant="text"
                    color={color}
                    onClick={nextMonth}
                  >
                    <Icon
                      icon={`${
                        direction === "ltr"
                          ? "mdi:chevron-right"
                          : "mdi:chevron-left"
                      }`}
                      size="sm"
                      color={textColor}
                    />
                  </Button>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-7">
                    {weekdays.map((weekday) => (
                      <div
                        key={weekday}
                        className="flex items-center justify-center"
                        style={{
                          minWidth: `${size}px`,
                        }}
                      >
                        <p
                          className="text-body2 font-bold"
                          style={{ color: parsedTextColor }}
                        >
                          {weekday}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-7">
                    {month.days.map((day) => {
                      const dayCss = getDayColor(day);
                      return (
                        <div
                          key={day.calendarDate}
                          className={`flex items-center justify-center ${
                            day.isPrevMonth || day.isNextMonth
                              ? "opacity-0"
                              : ""
                          } ${
                            day.isPrevMonth ||
                            day.isNextMonth ||
                            day.isMin ||
                            day.isMax
                              ? "pointer-events-none"
                              : "cursor-pointer"
                          } ${day.isSelected ? "font-bold" : ""}`}
                          style={{
                            minWidth: `${size}px`,
                            height: `${size}px`,
                            backgroundColor: dayCss.bgColor,
                            color: dayCss.color,
                            borderRadius: dayCss.borderRadius,
                          }}
                          onClick={() => selectDay(day)}
                          onMouseEnter={() => dayMouseEnterHandler(day)}
                          onMouseLeave={() => dayMouseLeaveHandler(day)}
                        >
                          <div className="text-body2">
                            {dayJsx ? dayJsx(day) : day.day}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Divider color="divider" height={2} className="my-4" />
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <Button
              size="sm"
              variant="outlined"
              color={todayColor}
              onClick={showTodayHandler}
            >
              {todayText}
            </Button>
            <div
              className="flex items-center gap-2 text-body2"
              style={{
                color: parsedTextColor,
              }}
            >
              <span
                className="min-h-[30px] min-w-[100px] rounded-sm border border-solid p-2 text-center"
                style={{
                  borderColor: parsedDividerColor,
                }}
              >
                {!range ? date : date?.[0]}
              </span>
              {range && (
                <>
                  <span className="font-bold">-</span>
                  <span
                    className="min-h-[30px] min-w-[100px] rounded-sm border border-solid p-2 text-center"
                    style={{
                      borderColor: parsedDividerColor,
                    }}
                  >
                    {date?.[1]}
                  </span>
                </>
              )}
            </div>
          </div>
        </>
      )}
      {mode === "year-picker" && (
        <YearPicker
          year={year}
          setYear={setNewYearHandler}
          calendar={calendar}
          offset={yearPickerOffset}
          grid={yearMonthPickerGrid}
          color={color}
        >
          <Button
            size="sm"
            variant="filled"
            color={color}
            onClick={() => returnToCalendarHandler()}
          >
            Return to Calendar
          </Button>
        </YearPicker>
      )}
      {mode === "month-picker" && (
        <MonthPicker
          month={month}
          setMonth={setNewMonthHandler}
          calendar={calendar}
          grid={yearMonthPickerGrid}
          color={color}
        >
          <Button
            size="sm"
            variant="filled"
            color={color}
            onClick={() => returnToCalendarHandler()}
          >
            Return to Calendar
          </Button>
        </MonthPicker>
      )}
    </div>
  );
}
