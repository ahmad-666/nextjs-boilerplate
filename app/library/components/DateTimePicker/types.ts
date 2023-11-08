//----------------------DatePicker----------------------
//----------------------DatePicker----------------------
//----------------------DatePicker----------------------
export type Type = "gregory" | "jalali";
export type Day = {
  day: number;
  dayFormat: string;
  valueDate: string;
  calendarDate: string;
  isToday: boolean;
  isPrevMonth: boolean;
  isNextMonth: boolean;
  isMin: boolean;
  isMax: boolean;
  isSelected: boolean;
  isBetween: boolean;
};
export type Month = {
  year: number;
  month: number;
  monthName: string;
  days: Day[];
};
export type Theme = {
  bgColor?: string;
  color?: string;
  textColor?: string;
  betweenColor?: string;
  disableColor?: string;
  todayColor?: string;
};
export type DatePickerSingle = {
  range?: false;
  date: null | string;
  setDate: (date: null | string) => void;
};
export type DatePickerRange = {
  range?: true;
  date: string[];
  setDate: (date: string[]) => void;
};
export type DatePickerBasicProps = {
  valueType?: Type;
  calendar?: Type;
  cols?: number;
  format?: string;
  min?: null | string;
  max?: null | string;
  mobileBreakpoint?: number;
  size?: number;
  yearPickerOffset?: number;
  yearMonthPickerGrid?: Grid;
  todayText: string;
  dayJsx?: (day: Day) => React.ReactNode;
  className?: string;
} & Theme;
export type DatePickerProps = DatePickerBasicProps &
  (DatePickerSingle | DatePickerRange);
export type YearData = {
  value: number;
  text: string;
};
export type MonthData = {
  value: number;
  text: string;
};
export type Grid = {
  cols?: number;
  sm?: number;
  md?: number;
  lg?: number;
};
export type YearPickerProps = {
  year: null | number;
  setYear: (year: number) => void;
  calendar: Type;
  offset?: number;
  color?: string;
  grid?: Grid;
  children?: React.ReactNode;
  className?: string;
};
export type MonthPickerProps = {
  month: null | number;
  setMonth: (month: number) => void;
  calendar: Type;
  color?: string;
  grid?: Grid;
  children?: React.ReactNode;
  className?: string;
};
//----------------------TimePicker----------------------
//----------------------TimePicker----------------------
//----------------------TimePicker----------------------
export type TimeInputProps = {
  value: string;
  setValue: (val: string) => void;
  defaultMax?: number;
  min?: null | number;
  max?: null | number;
  color?: string;
  size?: number;
  disabled?: boolean;
  className?: string;
};
export type TimePickerProps = {
  time: null | string;
  setTime: (val: null | string) => void;
  defaultToday?: boolean;
  hint?: boolean;
  min?: null | string;
  max?: null | string;
  format?: string;
  color?: string;
  size?: number;
  title: string;
  disabled?: boolean;
  className?: string;
};
//----------------------DateTimePicker----------------------
//----------------------DateTimePicker----------------------
//----------------------DateTimePicker----------------------
export type Mode = "year-picker" | "month-picker" | "date-picker";
export type DateTimePickerType = "date" | "time" | "datetime";
export type DateTimePickerSingle = {
  range?: false;
  value: null | string;
  onChange: (val: null | string) => void;
};
export type DateTimePickerRange = {
  range?: true;
  value: string[];
  onChange: (val: string[]) => void;
};
export type DateTimePickerBasic = {
  type?: DateTimePickerType;
  valueType?: Type;
  calendar?: Type;
  changeCalendar?: (calendar: Type) => void;
  cols?: number;
  format?: string;
  min?: string;
  max?: string;
  yearPickerOffset?: number;
  yearMonthPickerGrid?: Grid;
  startTimeTitle?: string;
  endTimeTitle?: string;
  mobileBreakpoint?: number;
  size?: number;
  showToggleCalendarBtn?: boolean;
  dayJsx?: (day: Day) => React.ReactNode;
  className?: string;
} & Theme;
export type DateTimePickerProps = DateTimePickerBasic &
  (DateTimePickerSingle | DateTimePickerRange);
