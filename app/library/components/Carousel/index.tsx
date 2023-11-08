//anytime we want draggable we can use swiper
//Controller module if we want to sync two swiper instance to each other
//Thumbs modules for thumbnail(thumbnail can be clickable too)
//EffectCoverflow for create 3D sliders
//we have modules for lazy/virtual slides,keyboard,mouse,scrollbar,parallax,zoom,history/hash,other effects like cube,flip,...
//each module has its own settings,methods,events --> check https://swiperjs.com/swiper-api#modules e.g for Navigation module we can use <Swiper navigation={false} /> to disable it totally or <Swiper navigation/> to enable it with default settings or <Swiper navigation={{nextEl:'',prevEl:'',enabled}} /> to use custom settings
//we have effects like fade,flip,cube,card,creating,coverflow and just like any other modules each of them can have its own settings
//we can define events like <Swiper onSlideChange={()=>{...}} />
//some of important events: (swiper has events for touch,mouse,keyboard,transition,... too)
// onBeforeInit,onAfterInit,onBeforeDestroy,onDestroy,onClick,onProgress,onSlideChange
// onUpdate(after calling Swiper.update()),onReachBeginning,onReachEnd
//here for navigation we don't use 'Navigation' swiper module and create it manually ... for style Navigation we have 'navigationContainerClassName','navigationClassName'
//for pagination we always use Swiper 'Pagination' module ... for style pagination we use vanilla html way(adding css class to container and use css to style it)

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Swiper } from "swiper/react";
import {
  Autoplay,
  FreeMode,
  Pagination,
  Controller,
  Thumbs,
  EffectFade,
  EffectCoverflow,
  //   Parallax,
  //   Lazy
  //   Virtual,
} from "swiper";
import Button from "../Button";
import Icon from "../Icon";
import useLocaleDetails from "../../hooks/useLocaleDetails";
import type { SwiperRef } from "swiper/react"; //interface for ref of swiper
//we have --> import type { SwiperSlideProps,SwiperProps } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types"; //interface for all vanilla props of 'swiper'
// import type { SwiperOptions } from "swiper/types"; //here we don't use SwiperOptions interface and use ComponentProps<typeof Swiper>
import "swiper/css/bundle";
import "./index.scss";

declare module "swiper/react" {
  //add 'ref' prop to <SwiperSlide> , it will forwarded to <div class="swiper-slide">
  interface SwiperSlideProps {
    ref?: React.MutableRefObject<HTMLDivElement>;
  }
}
export type Pos = "inside" | "outside";
export type Dir = "horizontal" | "vertical";
export type Size = "sm" | "md" | "lg";
export type CarouselProps = Omit<
  React.ComponentProps<typeof Swiper>,
  "width" | "height"
> & {
  width?: number | string;
  height?: number | string;
  slide?: number;
  setSlide?: (newSlide: number) => void;
  showNavigation?: boolean;
  showPagination?: boolean;
  navigationPos?: Pos;
  paginationPos?: Pos;
  color?: string;
  navigationSize?: number;
  paginationSize?: Size;
  children?: React.ReactNode; //<SwiperSlide>...</SwiperSlide>
  navigationContainerClassName?: string;
  navigationClassName?: string;
  swiperClassName?: string;
  swiperWrapperClassName?: string;
  className?: string;
};

const Carousel = (
  {
    //our own props
    width = "100%",
    height = 400,
    slide = 0,
    setSlide,
    showNavigation = true,
    showPagination = true,
    navigationPos = "inside",
    paginationPos = "inside",
    color = "primary",
    children,
    navigationSize = 50,
    paginationSize = "md",
    navigationClassName = "",
    navigationContainerClassName = "",
    swiperWrapperClassName = "", //we can use items-stretch,items-start,items-center for align slider items
    swiperClassName = "",
    className = "",
    //swiper props that we get from React.ComponentProps<typeof Swiper>
    slidesPerView = 1, //use number like 1,2,2.5,... or 'auto' , if use number then swiper set width of each slide but if we use 'auto' then we must manually set width of each slide
    slidesPerGroup = 1, //e.g if we use 3 then each 3 slides will be one group and when we click next,prev or pagination slider will move by 3 slides
    spaceBetween = 20,
    loop = false, //should use it only if total number of slides must be >= slidesPerView * 2
    rewind = false, //should not use with loop
    autoHeight = false,
    pagination = {
      type: "bullets", //'bullets' | 'progressbar' | 'fraction'
      dynamicBullets: false,
      clickable: true,
      //should not use bulletClass,bulletActiveClass
    },
    centeredSlides = false,
    centerInsufficientSlides = false, //if set it center slides if the amount of slides less than slidesPerView(not use with loop)
    centeredSlidesBounds = false, //if set then active slide will be centered without adding gaps at the beginning and end of slider ... (not use with loop or pagination)
    breakpoints, // {500: { slidesPerView: 2,spaceBetween: 20}, // when window width is >= 500}
    direction = "horizontal", //'horizontal' | 'vertical'
    grabCursor = true, //cursor:grab when hover
    speed = 300, //duration of transition when we change slide
    threshold = 5, //if "touch distance" will be lower than this value then swiper will not move
    autoplay = false, //we can use false to disable , use true to use with default settings , use object to enable with custom settings like {delay:3000,pauseOnMouseEnter:true} ... for more info about settings check docs
    freeMode = false,
    //lazyPreloadPrevNext = 0, //only for lazy loading , number of next/previous slides to preload , we have lazyPreloaderClass prop too
    effect = "slide", //"slide" | "fade" | "flip" | "cube" | "cards" | "coverflow" | "creative",
    //any effect except 'slide' need its own module so first we need to import and register its module and then after set 'effect' prop we can use effect specific prop to config it:
    //<Swiper effect='coverflow' coverflowEffect={{rotate: 30,slideShadows: false}} />
    onInit,
    onSlideChange,
    ...rest //swiper has many other props that we can use too
  }: CarouselProps,
  ref: React.ForwardedRef<any>
) => {
  const swiperRef = useRef<SwiperRef>(null); //swiperRef.current.swiper.[...]
  //we can use swiperRef.current.swiper.activeIndex
  //we can use swiperRef.current.swiper.realIndex
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);
  const { dir: localeDir } = useLocaleDetails();
  const containerSize = useMemo(() => {
    return {
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
    };
  }, [width, height]);
  const prevBtnIcon = useMemo(() => {
    if (direction === "horizontal") {
      if (localeDir === "ltr") return "mdi:chevron-left";
      else return "mdi:chevron-right";
    } else return "mdi:chevron-up"; //for vertical carousel for both ltr,rtl
  }, [direction, localeDir]);
  const nextBtnIcon = useMemo(() => {
    if (direction === "horizontal") {
      if (localeDir === "ltr") return "mdi:chevron-right";
      else return "mdi:chevron-left";
    } else return "mdi:chevron-down"; //for vertical carousel for both ltr,rtl
  }, [direction, localeDir]);
  const checkNavigationStatus = useCallback(() => {
    const isBeginning = swiperRef.current?.swiper.isBeginning;
    const isEnd = swiperRef.current?.swiper.isEnd;
    if (rewind || loop) {
      setPrevBtnDisabled(false);
      setNextBtnDisabled(false);
    } else {
      setPrevBtnDisabled(isBeginning ? true : false);
      setNextBtnDisabled(isEnd ? true : false);
    }
  }, [loop, rewind]);
  const slideTo = useCallback((index: number) => {
    swiperRef.current?.swiper.slideTo(index);
  }, []);
  const prevSlide = useCallback(() => {
    swiperRef.current?.swiper.slidePrev();
  }, []);
  const nextSlide = useCallback(() => {
    swiperRef.current?.swiper.slideNext();
  }, []);
  const enableSlider = useCallback(() => {
    swiperRef.current?.swiper.enable();
  }, []);
  const disableSlider = useCallback(() => {
    swiperRef.current?.swiper.disable();
  }, []);
  const destroySlider = useCallback(() => {
    swiperRef.current?.swiper.destroy();
  }, []);
  const updateSlider = useCallback(() => {
    //should call it after add/remove slides manually or after you hide/show it or do any custom DOM modifications
    swiperRef.current?.swiper.update();
  }, []);
  const changeSliderDirection = useCallback((dir: Dir, needUpdate: boolean) => {
    //should call it after add/remove slides manually or after you hide/show it or do any custom DOM modifications
    swiperRef.current?.swiper.changeDirection(dir, needUpdate);
  }, []);
  const initHandler = useCallback(
    (swiper: SwiperType) => {
      checkNavigationStatus();
      if (onInit) onInit(swiper);
    },
    [checkNavigationStatus, onInit]
  );
  const slideChangeHandler = useCallback(
    (swiper: SwiperType) => {
      const newSlide = swiper.realIndex; //we have .activeIndex too
      checkNavigationStatus();
      if (setSlide) setSlide(newSlide);
      if (onSlideChange) onSlideChange(swiper);
    },
    [setSlide, onSlideChange, checkNavigationStatus]
  );
  useImperativeHandle(
    ref,
    () => {
      return {
        swiperRef,
        slideTo,
        prevSlide,
        nextSlide,
        enableSlider,
        disableSlider,
        destroySlider,
        updateSlider,
        changeSliderDirection,
        slideChangeHandler,
      };
    },
    [
      slideTo,
      prevSlide,
      nextSlide,
      enableSlider,
      disableSlider,
      destroySlider,
      updateSlider,
      changeSliderDirection,
      slideChangeHandler,
    ]
  );
  useEffect(() => {
    //anytime change 'slide' prop we move slide
    slideTo(slide);
  }, [slide, slideTo]);
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        ...containerSize,
      }}
    >
      <Swiper
        ref={swiperRef}
        className={`h-full
          ${showNavigation && navigationPos === "inside" ? "w-full" : ""} ${
          showNavigation && navigationPos === "outside"
            ? "w-[calc(100%-100px)]"
            : ""
        } ${showPagination && paginationPos === "inside" ? "pb-0" : ""} ${
          showPagination && paginationPos === "outside" ? "!pb-10" : ""
        } ${paginationSize === "sm" ? "swiper-sm-pagination" : ""} ${
          paginationSize === "md" ? "swiper-md-pagination" : ""
        } ${
          paginationSize === "lg" ? "swiper-lg-pagination" : ""
        } ${swiperClassName}`}
        wrapperClass={swiperWrapperClassName}
        modules={[
          Autoplay,
          FreeMode,
          Pagination,
          Controller,
          Thumbs,
          EffectFade,
          EffectCoverflow,
        ]}
        navigation={false}
        pagination={showPagination ? pagination : false}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        slidesPerGroup={slidesPerGroup}
        loop={loop}
        rewind={rewind}
        autoHeight={autoHeight}
        centeredSlides={centeredSlides}
        centerInsufficientSlides={centerInsufficientSlides}
        centeredSlidesBounds={centeredSlidesBounds}
        breakpoints={breakpoints}
        direction={direction}
        grabCursor={grabCursor}
        speed={speed}
        threshold={threshold}
        autoplay={autoplay}
        freeMode={freeMode}
        effect={effect}
        onInit={initHandler}
        onSlideChange={slideChangeHandler}
        {...rest}
      >
        {children}
      </Swiper>
      {showNavigation && (
        <div
          className={`pointer-events-none absolute z-1 flex items-center justify-between ${
            direction === "horizontal"
              ? "start-0 top-1/2 w-full -translate-y-1/2 flex-row"
              : "start-1/2 top-0 h-full flex-col ltr:-translate-x-1/2  rtl:translate-x-1/2"
          } ${navigationContainerClassName} `}
        >
          <Button
            className={`pointer-events-auto !p-0 ${navigationClassName}`}
            variant="text"
            color={color}
            disabled={prevBtnDisabled}
            onClick={prevSlide}
            hover={false}
            ripple={false}
          >
            <Icon icon={prevBtnIcon} size={navigationSize} color={color} />
          </Button>
          <Button
            className={`pointer-events-auto !p-0 ${navigationClassName}`}
            variant="text"
            color={color}
            disabled={nextBtnDisabled}
            onClick={nextSlide}
            hover={false}
            ripple={false}
          >
            <Icon icon={nextBtnIcon} size={navigationSize} color={color} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default forwardRef(Carousel);
