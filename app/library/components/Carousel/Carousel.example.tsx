"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Carousel from "../Carousel";
import { SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";

const slides: any[] = [];
for (let i = 1; i <= 12; i++)
  slides.push({
    imgSrc: `/imgs/img-
${i}.jpg`,
  });
export default function Example() {
  const swiper = useRef<any>(null!); //for access to ref in parent
  const [firstSlide, setFirstSlide] = useState<SwiperType>(null!);
  const [secondSlide, setSecondSlide] = useState<SwiperType>(null!);
  const [thumbnailSlider, setThumbnailSlider] = useState<SwiperType>(null!);
  useEffect(() => {
    swiper.current.slideTo(5);
    //swiper.current.swiperRef.current.swiper.disable()
  }, []);
  return (
    <div>
      <h1 className="mb-10">1-Simple Example</h1>
      <Carousel
        width="100%"
        height={500}
        swiperClassName="!py-10"
        showNavigation
        showPagination
        navigationPos="outside"
        paginationPos="outside"
        loop
        spaceBetween={0}
        slidesPerView={1}
        breakpoints={{
          500: {
            spaceBetween: 10,
            slidesPerView: 2,
          },
          750: {
            spaceBetween: 20,
            slidesPerView: 3,
          },
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide
            key={slide.imgSrc}
            className="overflow-hidden rounded shadow-[0_0_10px_0_rgba(0,0,0,.8)]"
          >
            <Image
              src={slide.imgSrc}
              alt={slide.imgSrc}
              width={1500}
              height={700}
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Carousel>

      <h1 className="mb-10">2-Fade Example</h1>
      <Carousel effect="fade" spaceBetween={0} slidesPerView={1}>
        {slides.map((slide) => (
          <SwiperSlide key={slide.imgSrc} className="overflow-hidden rounded">
            <Image
              src={slide.imgSrc}
              alt={slide.imgSrc}
              width={1500}
              height={700}
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Carousel>

      <h1 className="mb-10">3-3D Example with custom style</h1>
      {/* .swiper-gray-filter {
             .swiper-slide:not(.swiper-slide-active) {filter: grayscale(0.75);}
        } */}
      <Carousel
        className="swiper-grey-filter"
        slide={2}
        showPagination={false}
        loop
        centeredSlides
        slidesPerView="auto"
        effect="coverflow"
        coverflowEffect={{
          rotate: 0, //for rotate
          scale: 1, //for scale
          stretch: 0, //for translateX
          depth: 100, //for translateZ
          modifier: 2.5, //add multiplier to above keys
          //depth,scale,stretch,modifier,width of each slide are related to each other so we
          //need to find good combination
          slideShadows: true, //add shadow
        }}
        // coverflowEffect={{
        //   //another coverflow effect
        //   rotate: 25,
        //   scale: 1,
        //   stretch: -50,
        //   depth: 200,
        //   modifier: 1,
        // }}
      >
        {slides.map((slide) => (
          <SwiperSlide
            key={slide.imgSrc}
            className="!w-[250px] overflow-hidden rounded md:!w-[340px]"
          >
            <Image
              src={slide.imgSrc}
              alt={slide.imgSrc}
              width={1500}
              height={700}
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Carousel>

      <h1 className="mb-10">
        4-Two Swiper that control each other(using Control module)
      </h1>
      <Carousel
        slidesPerView={3}
        controller={{ control: secondSlide }}
        onSwiper={setFirstSlide}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.imgSrc} className="overflow-hidden rounded ">
            <Image
              src={slide.imgSrc}
              alt={slide.imgSrc}
              width={1500}
              height={700}
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Carousel>
      <Carousel
        slidesPerView={3}
        controller={{ control: firstSlide }}
        onSwiper={setSecondSlide}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.imgSrc} className="overflow-hidden rounded ">
            <Image
              src={slide.imgSrc}
              alt={slide.imgSrc}
              width={1500}
              height={700}
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Carousel>

      <h1 className="mb-10">5-Swiper with thumbnail(using Thumb module)</h1>
      <Carousel thumbs={{ swiper: thumbnailSlider }} slidesPerView={1}>
        {slides.map((slide) => (
          <SwiperSlide key={slide.imgSrc}>
            <Image
              src={slide.imgSrc}
              alt={slide.imgSrc}
              width={1000}
              height={700}
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Carousel>
      <Carousel
        className="mt-5"
        height={120}
        showNavigation={false}
        showPagination={false}
        slidesPerView={4}
        watchSlidesProgress
        onSwiper={(swiper: SwiperType) => setThumbnailSlider(swiper)}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.imgSrc} className="cursor-pointer">
            <Image
              src={slide.imgSrc}
              alt={slide.imgSrc}
              width={200}
              height={70}
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Carousel>
    </div>
  );
}
