//***If we want flip timer we can use: https://github.com/pqina/flip

import { useMemo } from "react";
import ClientOnly from "../ClientOnly";
import TimerSection from "./TimerSection";
import useTimer from "../../hooks/useTimer";
import { useTranslations } from "next-intl";
import type { Timer, TimerProps } from "./types";

export default function Timer({
  type = ["minute", "second"], //we have day,hours,minutes,seconds ... we don't have month,year because each month can have different number of days
  value, //total number of seconds to init timer with , e.g 62 means 1minute and 2seconds
  topColor = "card-darken1",
  bottomColor = "card-lighten1",
  textColor = "primary",
  size = "md",
  className = "",
}: TimerProps) {
  const t = useTranslations("timer");
  const {
    result: { days, hours, minutes, seconds },
  } = useTimer(value);
  const has = useMemo(() => {
    return {
      day: type.includes("day"),
      hour: type.includes("hour"),
      minute: type.includes("minute"),
      second: type.includes("second"),
    };
  }, [type]);
  const timers = useMemo<Timer[]>(() => {
    const results: Timer[] = [];
    if (has.day) {
      results.push({
        title: t("day"),
        val1: Math.floor(days / 10),
        val2: days % 10,
      });
    }
    if (has.hour) {
      results.push({
        title: t("hour"),
        val1: Math.floor(hours / 10),
        val2: hours % 10,
      });
    }
    if (has.minute) {
      results.push({
        title: t("minute"),
        val1: Math.floor(minutes / 10),
        val2: minutes % 10,
      });
    }
    if (has.second) {
      results.push({
        title: t("second"),
        val1: Math.floor(seconds / 10),
        val2: seconds % 10,
      });
    }
    return results;
  }, [has, days, hours, minutes, seconds, t]);

  return (
    <ClientOnly>
      <div className={`${className}`}>
        <div className="dir-ltr flex flex-wrap items-center justify-center gap-8">
          {timers.map((timer) => (
            <TimerSection
              key={timer.title}
              title={timer.title}
              val1={timer.val1}
              val2={timer.val2}
              topColor={topColor}
              bottomColor={bottomColor}
              textColor={textColor}
              size={size}
            />
          ))}
        </div>
      </div>
    </ClientOnly>
  );
}
