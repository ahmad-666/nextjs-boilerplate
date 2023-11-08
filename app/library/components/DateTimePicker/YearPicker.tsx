import { useEffect, useMemo, useRef } from "react";
import dayjs from "dayjs";
import GridRow from "../GridRow";
import GridCol from "../GridCol";
import Button from "../Button";
import type { YearPickerProps, YearData } from "./types";

export default function YearPicker({
  year,
  setYear,
  calendar,
  offset = 100,
  color = "primary",
  grid = {
    cols: 6,
    sm: 4,
    md: 4,
    lg: 3,
  },
  children,
  className,
}: YearPickerProps) {
  const activeYearElm = useRef<null | HTMLDivElement>(null);
  const years = useMemo(() => {
    let results: YearData[] = [];
    const currentYear = dayjs().calendar(calendar);
    for (let i = -offset; i < offset; i++) {
      const y = currentYear.add(i, "year");
      results.push({
        value: +y.format("YYYY"),
        text: y.format("YYYY"),
      });
    }
    return results;
  }, [calendar, offset]);
  useEffect(() => {
    setTimeout(() => {
      if (activeYearElm.current) {
        activeYearElm.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, []);
  return (
    <div className={`${className}`}>
      <GridRow className="max-h-[300px] overflow-auto">
        {years.map((y) => {
          const isSelected = y.value === year;
          return (
            <GridCol
              key={y.value}
              cols={grid.cols}
              sm={grid.sm}
              md={grid.md}
              lg={grid.lg}
              spacing={2}
            >
              <div ref={isSelected ? activeYearElm : undefined}>
                <Button
                  size="sm"
                  className="w-full"
                  variant={isSelected ? "filled" : "text"}
                  color={color}
                  onClick={() => setYear(y.value)}
                >
                  {y.text}
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
