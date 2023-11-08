//we can check https://easings.net/
//arg of of all easing methods is number between 0,1 which is progress of animation e.g if we want to go from 0px to 200px in 2 seconds and we are now at 1second means we should pass .5 to easing method ... easing method will return a value between 0,1 too
//Simple animation using requestAnimationFrame:
// const elm = document.querySelector('.elm');
// const finalOpacity = 1;
// const duration = 1000;
// const easeInSine(progress:number){...} //see its implementation from bellow
// all easing method take arg that is between [0,1] and return a value between [0,1]
// const startTime = 0;
// const animationId = null;
// const animate(){
//   const timestamp = Date.now();
//   if (!startTime) startTime = timestamp;
//   const runtime = timestamp - startTime;
//   const relativeProgress = runtime / duration;
//   const easedProgress = easeInSine(relativeProgress);
//   const newOpacity = finalOpacity * Math.min(easedProgress, 1);
//   elm.style.opacity = `${newOpacity}`;
//   if (runtime < duration) animationId = requestAnimationFrame(animate);
//   else cancelAnimationFrame(animationId);
// };
// animate()

import { useState, useCallback, useEffect } from "react";

export type Easing =
  | "ease-in-sine"
  | "ease-out-sine"
  | "ease-in-out-sine"
  | "ease-in-quad"
  | "ease-out-quad"
  | "ease-in-out-quad"
  | "ease-in-cubic"
  | "ease-out-cubic"
  | "ease-in-out-cubic"
  | "ease-in-quart"
  | "ease-out-quart"
  | "ease-in-out-quart"
  | "ease-in-quint"
  | "ease-out-quint"
  | "ease-in-out-quint"
  | "ease-in-expo"
  | "ease-out-expo"
  | "ease-in-out-expo"
  | "ease-in-circ"
  | "ease-out-circ"
  | "ease-in-out-circ"
  | "ease-in-back"
  | "ease-out-back"
  | "ease-in-out-back"
  | "ease-in-elastic"
  | "ease-out-elastic"
  | "ease-in-out-elastic"
  | "ease-in-bounce"
  | "ease-out-bounce"
  | "ease-in-out-bounce";
const useEasing = (type: Easing) => {
  const easeInSine = useCallback((x: number) => {
    return 1 - Math.cos((x * Math.PI) / 2);
  }, []); //CSS: cubic-bezier(0.12, 0, 0.39, 0)
  const easeOutSine = useCallback((x: number) => {
    return Math.sin((x * Math.PI) / 2);
  }, []); //CSS: cubic-bezier(0.61, 1, 0.88, 1)
  const easeInOutSine = useCallback((x: number) => {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }, []); //CSS: cubic-bezier(0.37, 0, 0.63, 1)
  const easeInQuad = useCallback((x: number) => {
    return x * x;
  }, []); //CSS: cubic-bezier(0.11, 0, 0.5, 0)
  const easeOutQuad = useCallback((x: number) => {
    return 1 - (1 - x) * (1 - x);
  }, []); //CSS: cubic-bezier(0.5, 1, 0.89, 1)
  const easeInOutQuad = useCallback((x: number) => {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  }, []); //CSS: cubic-bezier(0.45, 0, 0.55, 1)
  const easeInCubic = useCallback((x: number) => {
    return x * x * x;
  }, []); //CSS: cubic-bezier(0.32, 0, 0.67, 0)
  const easeOutCubic = useCallback((x: number) => {
    return 1 - Math.pow(1 - x, 3);
  }, []); //CSS: cubic-bezier(0.33, 1, 0.68, 1)
  const easeInOutCubic = useCallback((x: number) => {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }, []); //CSS: cubic-bezier(0.65, 0, 0.35, 1)
  const easeInQuart = useCallback((x: number) => {
    return x * x * x * x;
  }, []); //CSS: cubic-bezier(0.5, 0, 0.75, 0)
  const easeOutQuart = useCallback((x: number) => {
    return 1 - Math.pow(1 - x, 4);
  }, []); //CSS: cubic-bezier(0.25, 1, 0.5, 1)
  const easeInOutQuart = useCallback((x: number) => {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
  }, []); //CSS: cubic-bezier(0.76, 0, 0.24, 1)
  const easeInQuint = useCallback((x: number) => {
    return x * x * x * x * x;
  }, []); //CSS: cubic-bezier(0.64, 0, 0.78, 0)
  const easeOutQuint = useCallback((x: number) => {
    return 1 - Math.pow(1 - x, 5);
  }, []); //CSS: cubic-bezier(0.22, 1, 0.36, 1)
  const easeInOutQuint = useCallback((x: number) => {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
  }, []); //CSS: cubic-bezier(0.83, 0, 0.17, 1)
  const easeInExpo = useCallback((x: number) => {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
  }, []); //CSS: cubic-bezier(0.7, 0, 0.84, 0)
  const easeOutExpo = useCallback((x: number) => {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }, []); //CSS: cubic-bezier(0.16, 1, 0.3, 1)
  const easeInOutExpo = useCallback((x: number) => {
    return x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? Math.pow(2, 20 * x - 10) / 2
      : (2 - Math.pow(2, -20 * x + 10)) / 2;
  }, []); //CSS: cubic-bezier(0.87, 0, 0.13, 1)
  const easeInCirc = useCallback((x: number) => {
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
  }, []); //CSS: cubic-bezier(0.55, 0, 1, 0.45)
  const easeOutCirc = useCallback((x: number) => {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
  }, []); //CSS: cubic-bezier(0, 0.55, 0.45, 1)
  const easeInOutCirc = useCallback((x: number) => {
    return x < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
  }, []); //CSS: cubic-bezier(0.85, 0, 0.15, 1)
  const easeInBack = useCallback((x: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * x * x * x - c1 * x * x;
  }, []); //CSS: cubic-bezier(0.36, 0, 0.66, -0.56)
  const easeOutBack = useCallback((x: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }, []); //CSS: cubic-bezier(0.34, 1.56, 0.64, 1)
  const easeInOutBack = useCallback((x: number) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  }, []); //CSS: cubic-bezier(0.68, -0.6, 0.32, 1.6)
  const easeInElastic = useCallback((x: number) => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
      ? 0
      : x === 1
      ? 1
      : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
  }, []); //CSS: Not available
  const easeOutElastic = useCallback((x: number) => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  }, []); //CSS: Not available
  const easeInOutElastic = useCallback((x: number) => {
    const c5 = (2 * Math.PI) / 4.5;
    return x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
  }, []); //CSS: Not available
  const easeOutBounce = useCallback((x: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (x < 1 / d1) {
      return n1 * x * x;
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  }, []); //CSS: Not available
  const easeInBounce = useCallback(
    (x: number) => {
      return 1 - easeOutBounce(1 - x);
    },
    [easeOutBounce]
  ); //CSS: Not available
  const easeInOutBounce = useCallback(
    (x: number) => {
      return x < 0.5
        ? (1 - easeOutBounce(1 - 2 * x)) / 2
        : (1 + easeOutBounce(2 * x - 1)) / 2;
    },
    [easeOutBounce]
  ); //CSS: Not available

  const [easing, setEasing] = useState<(x: number) => number>(
    () => easeInCubic
  );
  useEffect(() => {
    switch (type) {
      case "ease-in-sine":
        setEasing(() => easeInSine);
        break;
      case "ease-out-sine":
        setEasing(() => easeOutSine);
        break;
      case "ease-in-out-sine":
        setEasing(() => easeInOutSine);
        break;
      case "ease-in-quad":
        setEasing(() => easeInQuad);
        break;
      case "ease-out-quad":
        setEasing(() => easeOutQuad);
        break;
      case "ease-in-out-quad":
        setEasing(() => easeInOutQuad);
        break;
      case "ease-in-cubic":
        setEasing(() => easeInCubic);
        break;
      case "ease-out-cubic":
        setEasing(() => easeOutCubic);
        break;
      case "ease-in-out-cubic":
        setEasing(() => easeInOutCubic);
        break;
      case "ease-in-quart":
        setEasing(() => easeInQuart);
        break;
      case "ease-out-quart":
        setEasing(() => easeOutQuart);
        break;
      case "ease-in-out-quart":
        setEasing(() => easeInOutQuart);
        break;
      case "ease-in-quint":
        setEasing(() => easeInQuint);
        break;
      case "ease-out-quint":
        setEasing(() => easeOutQuint);
        break;
      case "ease-in-out-quint":
        setEasing(() => easeInOutQuint);
        break;
      case "ease-in-expo":
        setEasing(() => easeInExpo);
        break;
      case "ease-out-expo":
        setEasing(() => easeOutExpo);
        break;
      case "ease-in-out-expo":
        setEasing(() => easeInOutExpo);
        break;
      case "ease-in-circ":
        setEasing(() => easeInCirc);
        break;
      case "ease-out-circ":
        setEasing(() => easeOutCirc);
        break;
      case "ease-in-out-circ":
        setEasing(() => easeInOutCirc);
        break;
      case "ease-in-back":
        setEasing(() => easeInBack);
        break;
      case "ease-out-back":
        setEasing(() => easeOutBack);
        break;
      case "ease-in-out-back":
        setEasing(() => easeInOutBack);
        break;
      case "ease-in-elastic":
        setEasing(() => easeInElastic);
        break;
      case "ease-out-elastic":
        setEasing(() => easeOutElastic);
        break;
      case "ease-in-out-elastic":
        setEasing(() => easeInOutElastic);
        break;
      case "ease-in-bounce":
        setEasing(() => easeInBounce);
        break;
      case "ease-out-bounce":
        setEasing(() => easeOutBounce);
        break;
      case "ease-in-out-bounce":
        setEasing(() => easeInOutBounce);
        break;
    }
  }, [
    type,
    easeInBack,
    easeInBounce,
    easeInCirc,
    easeInCubic,
    easeInElastic,
    easeInExpo,
    easeInOutBack,
    easeInOutBounce,
    easeInOutCirc,
    easeInOutCubic,
    easeInOutElastic,
    easeInOutExpo,
    easeInOutQuad,
    easeInOutQuart,
    easeInOutQuint,
    easeInOutSine,
    easeInQuad,
    easeInQuart,
    easeInQuint,
    easeInSine,
    easeOutBack,
    easeOutBounce,
    easeOutCirc,
    easeOutCubic,
    easeOutElastic,
    easeOutExpo,
    easeOutQuad,
    easeOutQuart,
    easeOutQuint,
    easeOutSine,
  ]);
  return easing;
};
export default useEasing;
