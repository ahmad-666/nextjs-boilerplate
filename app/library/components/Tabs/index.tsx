import {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  Children,
  cloneElement,
} from "react";
import Carousel from "../Carousel";
import { SwiperSlide } from "swiper/react";
import useColorParser from "../../hooks/useColorParser";

export type TabsProps = {
  tab: number | string;
  setTab: (val: number | string) => void;
  grow?: boolean;
  fixedWidth?: number;
  alignTabs?: "start" | "center" | "end";
  showArrows?: boolean;
  showSlider?: boolean;
  sliderSize?: number;
  color?: string;
  direction?: "horizontal" | "vertical";
  children: React.ReactNode;
  activeClass?: string;
  className?: string;
};

export default function Tabs({
  tab,
  setTab,
  grow = false,
  fixedWidth,
  alignTabs = "start",
  showSlider = true,
  showArrows = false,
  sliderSize = 2,
  color = "primary",
  direction = "horizontal",
  children,
  activeClass = "",
  className = "",
}: TabsProps) {
  const indicator = useRef<HTMLDivElement>(null!);
  const activeTab = useRef<HTMLDivElement>(null!);
  const parsedColor = useColorParser(color);
  const justifyContent = useMemo(() => {
    if (alignTabs === "start") return "justify-start";
    else if (alignTabs === "end") return "justify-end";
    return "justify-center";
  }, [alignTabs]);
  const moveIndicator = useCallback(() => {
    const indicatorElm = indicator.current;
    const activeTabElm = activeTab.current;
    if (indicatorElm && activeTabElm) {
      if (direction === "horizontal") {
        indicatorElm.style.width = `${activeTabElm.clientWidth}px`;
        indicatorElm.style.transform = `translateX(${activeTabElm.offsetLeft}px)`;
      } else {
        indicatorElm.style.height = `${activeTabElm.clientHeight}px`;
        indicatorElm.style.transform = `translateY(${activeTabElm.offsetTop}px)`;
      }
    }
  }, [direction]);
  useEffect(() => {
    //move indicator whenever we select any new tab
    moveIndicator();
  }, [tab, moveIndicator]);
  return (
    <div className={`${className}`}>
      <Carousel
        width="100%"
        height={direction === "horizontal" ? "auto" : "100%"}
        autoHeight
        direction={direction}
        showPagination={false}
        showNavigation={showArrows}
        navigationPos="outside"
        navigationSize={35}
        slidesPerView="auto"
        spaceBetween={10}
        loop={false}
        color={color}
        swiperClassName={`${direction === "vertical" ? "!h-full" : ""}`}
        swiperWrapperClassName={`relative ${justifyContent}`}
      >
        {Children.map(children, (tabComponent: any) => {
          const isActive = tab === tabComponent.props.value;
          return (
            <SwiperSlide
              className={`${grow ? "grow" : ""} shrink-0`}
              style={{
                width: fixedWidth ? `${fixedWidth}px` : "auto",
              }}
              ref={isActive ? activeTab : undefined}
            >
              {cloneElement(tabComponent, {
                value: tabComponent.props.value,
                setValue: setTab,
                color,
                disabled: tabComponent.props.disabled,
                children: tabComponent.props.children,
                href: tabComponent.props.href,
                replace: tabComponent.props.replace,
                className: `${isActive ? activeClass : ""} ${
                  tabComponent.props.className || ""
                }`,
              })}
            </SwiperSlide>
          );
        })}
        {showSlider && (
          <SwiperSlide
            ref={indicator}
            className={`!absolute !m-0 rounded-xs transition-all duration-300 ease-in-out ${
              direction === "horizontal" ? "bottom-0 left-0" : "right-0 top-0"
            }`}
            style={{
              width: direction === "vertical" ? `${sliderSize}px` : undefined,
              height:
                direction === "horizontal" ? `${sliderSize}px` : undefined,
              backgroundColor: parsedColor,
            }}
          ></SwiperSlide>
        )}
      </Carousel>
    </div>
  );
}
