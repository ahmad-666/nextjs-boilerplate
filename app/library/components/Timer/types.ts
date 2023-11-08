type Size = "sm" | "md" | "lg";
type Type = "day" | "hour" | "minute" | "second";
export type Cell = {
  size?: Size;
  topColor?: string;
  bottomColor?: string;
  textColor?: string;
};
export type TimerCellProps = Cell & {
  value: number;
  className?: string;
};
export type Timer = {
  title: string;
  val1: number;
  val2: number;
};
export type TimerSectionProps = Timer &
  Cell & {
    className?: string;
  };
export type TimerProps = Cell & {
  type?: Type[];
  value: number;
  className?: string;
};
