// tailwind.config:
//     animation: {fadeIn: "fadeIn .3s ease-in-out"},
//     keyframes: {
//         fadeIn: {
//         "0%": {opacity: "0",transform: "translateY(50px)"},
//         "100%": {opacity: "1",transform: "translateY(0px)"}
//         }
//     }

import Lazy from ".";

export default function Example() {
  return (
    <div>
      <Lazy height="75vh">
        <div className="h-[75vh] animate-fadeIn bg-slate-300"></div>
      </Lazy>
      <div className="h-[125vh] w-full"></div>
      <Lazy height="75vh">
        <div className="h-[75vh] w-full animate-fadeIn bg-slate-300"></div>
      </Lazy>
    </div>
  );
}
