import { useState } from "react";
import StepperHeaders from ".";
import StepperHeader from "../StepperHeader";
import StepperItems from "../StepperItems";
import StepperItem from "../StepperItem";

const steps = [
  { step: 1, title: "title#1", content: "content#1" },
  { step: 2, title: "title#2", content: "content#2" },
  { step: 3, title: "title#3", content: "content#3" },
  { step: 4, title: "title#4", content: "content#4" },
];
export default function Example() {
  const [step, setStep] = useState(1);
  return (
    <div>
      <StepperHeaders dividerClassName="-mt-6">
        {steps.map((s) => (
          <StepperHeader
            key={s.step}
            title={s.title}
            step={s.step}
            complete={step >= s.step}
          ></StepperHeader>
        ))}
      </StepperHeaders>
      <StepperItems value={step}>
        {steps.map((s) => (
          <StepperItem key={s.step} step={s.step} className="py-5">
            <h3>{s.content}</h3>
          </StepperItem>
        ))}
      </StepperItems>
      <button disabled={step === 1} onClick={() => setStep((old) => old - 1)}>
        prev
      </button>
      <button
        disabled={step === steps.length}
        onClick={() => setStep((old) => old + 1)}
      >
        next
      </button>
    </div>
  );
}
