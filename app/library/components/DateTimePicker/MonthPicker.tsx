import { useEffect, useMemo, useRef } from "react";
import dayjs from "dayjs";
import GridRow from "../GridRow";
import GridCol from "../GridCol";
import Button from "../Button";
import type { MonthPickerProps, MonthData } from "./types";

export default function MonthPicker({
  month,
  setMonth,
  calendar,
  color = "primary",
  grid = {
    cols: 6,
    sm: 4,
    md: 4,
    lg: 3,
  },
  children,
  className,
}: MonthPickerProps) {
  const activeMonthElm = useRef<null | HTMLDivElement>(null);
  const months = useMemo(() => {
    const results: MonthData[] = [];
    const startMonth = dayjs()
      .calendar(calendar)
      .locale(calendar === "gregory" ? "en" : "fa")
      .month(0);
    for (let i = 0; i < 12; i++) {
      const m = startMonth.add(i, "month");
      results.push({
        value: +m.format("M"),
        text: m.format("MMMM"),
      });
    }
    return results;
  }, [calendar]);
  useEffect(() => {
    setTimeout(() => {
      if (activeMonthElm.current) {
        activeMonthElm.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, []);
  return (
    <div className={`${className}`}>
      <GridRow className="max-h-[300px] overflow-auto">
        {months.map((m) => {
          const isSelected = m.value === month;
          return (
            <GridCol
              key={m.value}
              cols={grid.cols}
              sm={grid.sm}
              md={grid.md}
              lg={grid.lg}
              spacing={2}
            >
              <div ref={isSelected ? activeMonthElm : undefined}>
                <Button
                  size="sm"
                  className="w-full"
                  variant={isSelected ? "filled" : "text"}
                  color={color}
                  onClick={() => setMonth(m.value)}
                >
                  {m.text}
                </Button>
              </div>
            </GridCol>
          );
        })}
      </GridRow>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
