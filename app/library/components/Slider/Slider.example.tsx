import { useState } from "react";
import Slider from "./index";

export default function Example() {
  const [slider, setSlider] = useState<any>(0);
  const [range, setRange] = useState<any>([0, 100]);
  const [lazyRange, setLazyRange] = useState<any>([0, 100]);
  const [multipleRange, setMultipleRange] = useState<any>([0, 25, 50, 75, 100]);
  return (
    <div>
      <h1>1-Continuous Slider with custom style</h1>
      <Slider
        value={slider}
        setValue={(newVal) => setSlider(newVal)}
        min={0}
        max={100}
        step={1}
        railStyle={{
          height: "10px",
          backgroundColor: "#eee",
        }}
        trackStyle={{
          height: "10px",
          backgroundColor: "#808",
        }}
        handleStyle={{
          width: "15px",
          height: "15px",
          backgroundColor: "white",
          top: "50%",
          opacity: 1,
        }}
        dotStyle={{
          width: "10px",
          height: "10px",
          top: "0%",
          backgroundColor: "#666",
        }}
        dotActiveStyle={{
          backgroundColor: "#f00",
        }}
      />

      <h1>2-Slider with discrete value</h1>
      <Slider
        value={slider}
        setValue={(newVal) => setSlider(newVal)}
        dots
        min={0}
        max={100}
        step={null}
        marks={{
          0: "a",
          10: "b",
          70: "c",
          100: "d",
        }}
      />

      <h1>3-Vertical Slider with custom marks </h1>
      <div className="mx-auto h-[500px] w-1/2">
        <Slider
          value={slider}
          setValue={(newVal) => setSlider(newVal)}
          className="h-full"
          dir="vertical"
          reverse
          step={10}
          dots
          marks={{
            10: 10,
            20: "20%",
            30: <h1 className="font-bold text-red-500">30%</h1>,
            40: {
              style: {
                color: "blue",
              },
              label: <h3>40%</h3>,
            },
          }}
        />
      </div>

      <h1>4-Ranger with lazy load</h1>
      <Slider
        range
        value={range}
        setValue={(newVal) => setRange(newVal)}
        onAfterChange={(newVal) => setLazyRange(newVal)}
      />

      <h1>5-Ranger with more than 2 handlers</h1>
      <Slider
        range
        handlesCount={5}
        value={multipleRange}
        setValue={(newVal) => setMultipleRange(newVal)}
      />
    </div>
  );
}
