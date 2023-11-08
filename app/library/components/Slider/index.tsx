//we are using rc-slider library
//this component is both for 'slider','ranger'
//we can have Slider with more that 2 handlers too
//for full examples check https://slider-react-component.vercel.app/demo/debug

import { useRef, useMemo, useCallback } from "react";
import RcSlider from "rc-slider";
import type { SliderRef } from "rc-slider";
import FormHint from "../FormField/FormHint";
import "rc-slider/assets/index.css";

export type Value = number | number[];
export type Dir = "horizontal" | "vertical";
export type Pos = "bottom" | "top" | "left" | "right";
export type Visibility = "always" | "hover";
export type SliderProps = Omit<
  React.ComponentProps<typeof RcSlider>,
  | "value"
  | "vertical"
  | "count"
  | "railStyle"
  | "trackStyle"
  | "handleStyle"
  | "dotStyle"
  | "activeDotStyle"
  | "className"
> & {
  value: Value;
  setValue: (newVal: Value) => void;
  dir?: Dir;
  handlesCount?: number;
  showTooltip?: boolean;
  tooltipVisibility?: Visibility;
  tooltipPos?: Pos;
  tooltipRender?: (value: Value) => React.ReactNode;
  error?: string;
  hint?: string;
  hideDetails?: boolean;
  railStyle?: React.CSSProperties;
  trackStyle?: React.CSSProperties;
  handleStyle?: React.CSSProperties;
  dotStyle?: React.CSSProperties;
  dotActiveStyle?: React.CSSProperties;
  sliderClassName?: string;
  tooltipClassName?: string;
  className?: string;
};

export default function Slider({
  //our own props
  value,
  setValue,
  dir = "horizontal", //for vertical we need to wrap around container with fixed height
  handlesCount = 1, //only for range:true ... how many handlers we need
  showTooltip = true,
  tooltipVisibility = "hover",
  tooltipPos = "top",
  tooltipRender = (value) => value,
  error = "",
  hint = "",
  hideDetails = false,
  railStyle, //rail is for unfilled part of track
  trackStyle, //track is for filled part of track
  handleStyle, //for handlers that we move
  dotStyle, //if we set dots:true then dots will be places on track ... this is for styling them
  dotActiveStyle, //only for dots:true ... style of active dots
  sliderClassName = "",
  tooltipClassName = "",
  className = "",
  //rc-slider props(inherited from RcSlider)
  range = false,
  min = 0,
  max = 100,
  step = 1, //step and discrete are two different things ... min=0,max=100,step=10 is still continuous but user can only select 0,10,20,...,90,100 ... for discrete we should use step={null}
  reverse = false, //can be used for LTR,RTL
  disabled = false,
  dots = false, //should use only if 'step' is bigger than 1 ... for each step it will added a dot on track
  marks, //for label marks ... by default we don't see any marks ... this has nothing to do with continuous or discrete variants and can be used for both ... object that key should be number(position of slider) and value is for render mark e.g {0:'0',25:'25%',50:<h6 className="font-bold text-red-500">50%</h6>,100:{style: {color: 'red',},label: <strong>100%</strong>}} ... for those marks that we added we see small circle on track too
  allowCross = true, //only for range:true ... allow handles to cross each other
  pushable = false, //only for range:true ... can be number or boolean ... if true it allows pushing of surrounding handles when moving a handle ... if number then it will be the minimum distance between handles
  onBeforeChange,
  onChange,
  onAfterChange, //for lazy we can use this
  onFocus,
  onBlur,
  ...rest
}: SliderProps) {
  const ref = useRef<SliderRef>(null!);
  const handlersFinalCount = useMemo(() => {
    if (!range) return 0;
    return handlesCount - 1;
  }, [range, handlesCount]);
  const onBeforeChangeHandler = useCallback(
    (startValue: Value) => {
      if (onBeforeChange) onBeforeChange(startValue);
    },
    [onBeforeChange]
  );
  const onChangeHandler = useCallback(
    (newVal: Value) => {
      setValue(newVal);
      if (onChange) onChange(newVal);
    },
    [setValue, onChange]
  );
  const onAfterChangeHandler = useCallback(
    (newVal: Value) => {
      if (onAfterChange) onAfterChange(newVal);
    },
    [onAfterChange]
  );
  return (
    <div className={`${className}`}>
      <RcSlider
        ref={ref}
        className={`${sliderClassName}`}
        value={value}
        range={range}
        min={min}
        max={max}
        step={step}
        count={handlersFinalCount}
        vertical={dir !== "horizontal"}
        reverse={reverse}
        disabled={disabled}
        dots={dots}
        marks={marks}
        allowCross={allowCross}
        pushable={pushable}
        handleRender={
          !showTooltip
            ? undefined
            : ({ props }, { value }) => {
                const { className, ...rest } = props as any;
                return (
                  <div {...rest} className={`group ${className}`}>
                    <div
                      className={`pointer-events-none absolute rounded-xs bg-slate-800 p-1.5 text-caption text-white ${
                        tooltipVisibility === "hover"
                          ? "opacity-0 transition-opacity duration-200 ease-linear group-hover:opacity-100 "
                          : ""
                      } ${
                        tooltipVisibility === "always" ? "opacity-100" : ""
                      } ${
                        tooltipPos === "top"
                          ? "bottom-[calc(100%+5px)] left-1/2 -translate-x-1/2"
                          : ""
                      } ${
                        tooltipPos === "bottom"
                          ? "left-1/2 top-[calc(100%+5px)] -translate-x-1/2"
                          : ""
                      } ${
                        tooltipPos === "left"
                          ? "right-[calc(100%+5px)] top-1/2 -translate-y-1/2"
                          : ""
                      } ${
                        tooltipPos === "right"
                          ? "left-[calc(100%+5px)] top-1/2 -translate-y-1/2"
                          : ""
                      } ${tooltipClassName}`}
                    >
                      {tooltipRender(value)}
                    </div>
                  </div>
                );
              }
        }
        styles={{
          rail: {
            ...railStyle,
          },
          track: {
            ...trackStyle,
          },
          handle: {
            ...handleStyle,
          },
        }}
        dotStyle={{
          ...dotStyle,
        }}
        activeDotStyle={{
          ...dotActiveStyle,
        }}
        onBeforeChange={onBeforeChangeHandler}
        onChange={onChangeHandler}
        onAfterChange={onAfterChangeHandler}
        onFocus={onFocus}
        onBlur={onBlur}
        {...rest}
      />
      <FormHint error={error} hint={hint} hideDetails={hideDetails} />
    </div>
  );
}
