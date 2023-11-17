//we always use controls={false} on <video> because we want to create our own controls
//we normally want to use 'w-full h-auto'(without any 'object-cover',...) to have fixed-width but auto height and always show full video without any cropped part
//here we don't design any quality selection because it need whole streaming back-end that we don't here(when user upload a video it will automatically create different quality for it)

import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import Image from "next/image";
import Button from "../Button";
import Icon from "../Icon";
import Slider from "../Slider";
import ProgressCircular from "../ProgressCircular";
import useColorParser from "../../hooks/useColorParser";
import useBoundingRect from "../../hooks/useBoundingRect";
import useThumbnail from "../../hooks/useThumbnail";
import "./styles.scss";

export type Mode = "default" | "picture-in-picture" | "theater" | "fullscreen";
export type Dir = "up" | "down";
export type Caption = {
  src: string;
  kind: "subtitles" | "captions" | "descriptions" | "metadata";
  label: string;
  srcLang?: string;
};
// export type Source = {
//   src: string;
//   type?: string; //Mime Type
// };
export type VideoPlayerProps = {
  src: string;
  caption?: Caption;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  volume?: number;
  setVolume?: (newVolume: number) => void;
  rate?: number;
  setRate?: (newRate: number) => void;
  rates?: number[];
  skipOffset?: number;
  color?: string;
  thumbnailCount?: number;
  controls?: boolean;
  pauseOnTabBlur?: boolean;
  onPlay?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onPause?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onProgress?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onSeek?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onPictureInPictureChange?: (isPictureInPicture: boolean) => void;
  onTheaterChange?: (isTheater: boolean) => void;
  onEnd?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  vidClassName?: string;
  captionClassName?: string;
  className?: string;
};

const VideoPlayer = (
  {
    src,
    caption, //for subtitles
    autoPlay = true, //if we want autoplay,muted={false} we should know that user should interact with page first , we can use autoplay={false},muted={false} OR autoplay,muted
    muted = false,
    loop = false, //if we want to have refresh btn we should set it to false
    volume = 0.75, //[0,1]
    setVolume,
    rate = 1,
    setRate,
    rates = [0.25, 0.5, 1, 1.5, 2], //available play speed rate
    skipOffset = 5, //5seconds on next/prev skip
    color = "primary",
    thumbnailCount = 10, //each 5 second generate preview thumbnail
    controls = true,
    pauseOnTabBlur = false, //if true then if we blur of current tab we pause the video
    onPlay,
    onPause,
    onProgress,
    onSeek,
    onFullscreenChange,
    onPictureInPictureChange,
    onTheaterChange,
    onEnd,
    vidClassName = "",
    captionClassName = "",
    className = "",
  }: VideoPlayerProps,
  ref: React.ForwardedRef<HTMLVideoElement>
) => {
  //states,refs,hooks -----------------------------
  const container = useRef<HTMLDivElement>(null!);
  const video = useRef<HTMLVideoElement>(null!);
  const timeElm = useRef<HTMLSpanElement>(null!);
  const captionElm = useRef<HTMLDivElement>(null!);
  const seekerContainer = useRef<HTMLDivElement>(null!);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isEnd, setIsEnd] = useState(false);
  const [localVolume, setLocalVolume] = useState(volume); //[0,1]
  const latestVolume = useRef(volume); //[0,1] , for store latest volume value
  const [duration, setDuration] = useState("");
  const videoTime = useRef(""); //not useState because it will get updated each 1second
  const [enableCaption, setEnableCaption] = useState(false);
  const [localRate, setLocalRate] = useState(rate);
  const [mode, setMode] = useState<Mode>("default");
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [activePreview, setActivePreview] = useState<null | string>(null);
  const [showThumbnail, setShowThumbnail] = useState(false);
  const isScrubbing = useRef(false);
  const isScrubVideoPaused = useRef(false); //for holing pause state of video player at start of scrubbing
  const parsedColor = useColorParser(color);
  const generateThumbnail = useThumbnail();
  const { left: seekerBoundingLeft, width: seekerBoundingWidth } =
    useBoundingRect(seekerContainer);
  //seeker,progress,preview,thumbnail ------------------------
  const getVideoPositionPercent = useCallback(
    (x: number) => {
      const value = x - seekerBoundingLeft;
      const normalizeValue =
        Math.min(Math.max(0, value), seekerBoundingWidth) / seekerBoundingWidth;
      return normalizeValue * 100;
    },
    [seekerBoundingLeft, seekerBoundingWidth]
  );
  const createPreviews = useCallback(async () => {
    const previewPromises: Promise<string>[] = [];
    const previewTimePercent = Math.floor(
      video.current.duration / thumbnailCount
    );
    for (let i = 0; i < thumbnailCount; i++) {
      previewPromises.push(generateThumbnail(src, i * previewTimePercent));
    }
    const newPreviews = await Promise.all(previewPromises);
    setPreviews(newPreviews);
  }, [src, thumbnailCount, generateThumbnail]);
  const seekerScrubStartHandler = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      const { type } = e;
      const videoElm = video.current;
      isScrubbing.current = true;
      setShowThumbnail(true);
      isScrubVideoPaused.current = videoElm.paused;
      if (type === "mousedown") videoElm.pause();
    },
    []
  );
  const seekerScrubMoveHandler = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (isScrubbing.current) {
        const { type } = e;
        let offsetX = 0;
        if (type === "mousemove") {
          const { clientX } = e as MouseEvent;
          offsetX = clientX;
        } else if (type === "touchmove") {
          const { changedTouches } = e as TouchEvent;
          offsetX = changedTouches[0].clientX;
        }
        const percent = getVideoPositionPercent(offsetX);
        seekerContainer.current.style.setProperty("--progress", `${percent}`);
        seekerContainer.current.style.setProperty(
          "--preview-position",
          `${Math.min(Math.max(7, percent), 93)}`
        );
        setActivePreview(
          previews[Math.floor((percent / 100) * previews.length)]
        );
      }
    },
    [previews, getVideoPositionPercent]
  );
  const seekerScrubEndHandler = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (isScrubbing.current) {
        const { type } = e;
        let offsetX = 0;
        const videoElm = video.current;
        if (type === "mouseup") {
          const { clientX } = e as MouseEvent;
          offsetX = clientX;
        } else if (type === "touchend") {
          const { changedTouches } = e as TouchEvent;
          offsetX = changedTouches[0].clientX;
        }
        const percent = getVideoPositionPercent(offsetX);
        videoElm.currentTime = videoElm.duration * (percent / 100);
        seekerContainer.current.style.setProperty("--preview-position", "0");
        isScrubbing.current = false;
        isScrubVideoPaused.current = false;
        setShowThumbnail(false);
        setActivePreview(null);
        if (type === "mouseup") {
          if (isScrubVideoPaused.current) videoElm.pause();
          else videoElm.play();
        }
      }
    },
    [getVideoPositionPercent]
  );
  const seekerMoveHandler = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      const { type } = e;
      let offsetX: number = 0;
      if (type === "mousemove") {
        const { clientX } = e as React.MouseEvent<HTMLDivElement>;
        offsetX = clientX;
      } else if (type === "touchmove") {
        const { changedTouches } = e as React.TouchEvent<HTMLDivElement>;
        offsetX = changedTouches[0].clientX;
      }
      const percent = getVideoPositionPercent(offsetX);
      seekerContainer.current.style.setProperty("--position", `${percent}`);
    },
    [getVideoPositionPercent]
  );
  const seekerOutHandler = useCallback(() => {
    seekerContainer.current.style.setProperty("--position", "0");
  }, []);
  const seekerClickHandler = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { clientX } = e;
      const videoElm = video.current;
      const percent = getVideoPositionPercent(clientX) / 100;
      videoElm.currentTime = videoElm.duration * percent;
    },
    [getVideoPositionPercent]
  );
  //play,pause ------------------------------
  const playVideo = useCallback(() => {
    //.play() will actually return a promise
    video.current.play();
  }, []);
  const pauseVideo = useCallback(() => {
    video.current.pause();
  }, []);
  const playHandler = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      setIsPlaying(true);
      setIsEnd(false);
      if (onPlay) onPlay(e);
    },
    [onPlay]
  );
  const pauseHandler = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      setIsPlaying(false);
      if (onPause) onPause(e);
    },
    [onPause]
  );
  const togglePlay = useCallback(() => {
    if (video.current.paused) playVideo();
    else pauseVideo();
  }, [playVideo, pauseVideo]);
  const refreshClick = useCallback(() => {
    const videoElm = video.current;
    videoElm.currentTime = 0; //reset video to its start
    videoElm.play();
    setIsEnd(false);
  }, []);
  const endHandler = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      setIsEnd(true);
      if (onEnd) onEnd(e);
    },
    [onEnd]
  );
  //skip btns -------------------------------
  const skipVideo = useCallback((seconds: number) => {
    video.current.currentTime += seconds;
  }, []);
  const progressHandler = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (onProgress) onProgress(e);
    },
    [onProgress]
  );
  const seekedHandler = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (onSeek) onSeek(e);
    },
    [onSeek]
  );
  //volume ----------------------------------
  const toggleMute = useCallback(() => {
    const videoElm = video.current;
    const isMuted = videoElm.muted;
    if (isMuted) {
      videoElm.muted = false;
      videoElm.volume = latestVolume.current;
    } else {
      videoElm.muted = true;
      videoElm.volume = 0;
    }
  }, []);
  const volumeSliderChange = useCallback((newVal: any) => {
    const videoElm = video.current;
    const normalizeVal = Math.max(Math.min(newVal, 1), 0);
    videoElm.volume = normalizeVal;
    videoElm.muted = normalizeVal === 0;
    latestVolume.current = normalizeVal;
  }, []);
  const volumeChangeHandler = useCallback(() => {
    const newVolume = video.current.volume;
    setLocalVolume(newVolume);
    if (setVolume) setVolume(newVolume);
  }, [setVolume]);
  //current time,duration -------------------
  const timeNormalize = useCallback((seconds: number) => {
    const s = Math.floor(seconds % 60);
    const m = Math.floor((seconds / 60) % 60);
    const h = Math.floor(seconds / (60 * 60));
    const intl = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });
    if (!h) return `${m}:${intl.format(s)}`;
    return `${h}:${intl.format(m)}:${intl.format(s)}`;
  }, []);
  const durationChangeHandler = useCallback(() => {
    const videoDuration = video.current.duration;
    setDuration(timeNormalize(videoDuration));
  }, [timeNormalize]);
  const loadMetaDataHandler = useCallback(() => {
    durationChangeHandler();
    createPreviews();
  }, [createPreviews, durationChangeHandler]);
  const timeUpdateHandler = useCallback(() => {
    const videoElm = video.current;
    const videoCurrentTime = videoElm.currentTime;
    const videoDuration = videoElm.duration;
    const percent = videoCurrentTime / videoDuration;
    const timeContainer = timeElm.current;
    videoTime.current = timeNormalize(videoCurrentTime);
    if (timeContainer) {
      timeContainer.textContent = videoTime.current; //we manually update textContent because we don't use state for 'videoTime' because it gets updated each 1 second
    }
    seekerContainer.current.style.setProperty("--progress", `${percent * 100}`);
  }, [timeNormalize]);
  //caption ---------------------------------
  const toggleCaptions = useCallback(() => {
    if (caption) setEnableCaption((old) => !old);
  }, [caption]);
  const cueChangeHandler = useCallback((e: Event) => {
    const { target } = e;
    const cue: any = (target as TextTrack).activeCues?.[0];
    const elm = captionElm.current;
    if (elm) elm.textContent = cue?.text || "";
  }, []);
  //rate ------------------------------------
  const rateChanger = useCallback(
    (dir: Dir) => {
      const videoElm = video.current;
      const currentRate = videoElm.playbackRate;
      const currentRateIndex = rates.findIndex((r) => r === currentRate);
      const newRateIndex =
        dir === "up"
          ? (currentRateIndex + 1) % rates.length
          : currentRateIndex - 1;
      const newRate = rates.at(newRateIndex) || 1;
      videoElm.playbackRate = newRate;
    },
    [rates]
  );
  const rateChangeHandler = useCallback(() => {
    const vidRate = video.current.playbackRate;
    setLocalRate(vidRate);
    if (setRate) setRate(vidRate);
  }, [setRate]);
  //picture-in-picture,theater,fullscreen ---
  const togglePictureInPictureMode = useCallback(async () => {
    try {
      if (!document.pictureInPictureElement) {
        await video.current.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    } catch (err) {}
  }, []);
  const pictureInPictureChangeHandler = useCallback(() => {
    const isPictureInPicture = !!document.pictureInPictureElement;
    setMode(isPictureInPicture ? "picture-in-picture" : "default");
    if (onPictureInPictureChange) onPictureInPictureChange(isPictureInPicture);
  }, [onPictureInPictureChange]);
  const toggleTheaterMode = useCallback(() => {
    const isTheater = mode !== "theater";
    setMode(isTheater ? "theater" : "default");
    if (onTheaterChange) onTheaterChange(isTheater);
  }, [mode, onTheaterChange]);
  const toggleFullscreenMode = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await container.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {}
  }, []);
  const fullscreenChangeHandler = useCallback(() => {
    const isFullscreen = !!document.fullscreenElement;
    setMode(isFullscreen ? "fullscreen" : "default");
    if (onFullscreenChange) onFullscreenChange(isFullscreen);
  }, [onFullscreenChange]);
  //loading , buffering ------------------------
  const waitingHandler = useCallback(() => {
    setLoading(true);
  }, []);
  const canPlayHandler = useCallback(() => {
    setLoading(false);
  }, []);
  const canPlayThroughHandler = useCallback(() => {
    setLoading(false);
  }, []);
  //accessibility methods(keyboard,tabFocus,...)
  const tabBlurHandler = useCallback(() => {
    if (pauseOnTabBlur) {
      pauseVideo();
    }
  }, [pauseOnTabBlur, pauseVideo]);
  const addKeyShortcuts = useCallback(
    (e: KeyboardEvent) => {
      const { key, target } = e;
      const tagName = (target as HTMLElement).tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea") return null; //don't interact with video player if we are typing on some input,textarea
      const keyNormalize = key.toLowerCase();
      switch (keyNormalize) {
        case " ":
          if (tagName === "button") {
            //if we focus on <button> then 'enter' or 'space' keys will have same effect as click
            e.preventDefault(); //prevent click behavior
          }
        case "k":
          togglePlay();
          break;
        case "arrowleft":
          skipVideo(-skipOffset);
          break;
        case "arrowright":
          skipVideo(skipOffset);
          break;
        case "arrowup":
          volumeSliderChange(localVolume + 0.1);
          break;
        case "arrowdown":
          volumeSliderChange(localVolume - 0.1);
          break;
        case "m":
          toggleMute();
          break;
        case "c":
          toggleCaptions();
          break;
        case "<":
          rateChanger("down");
          break;
        case ">":
          rateChanger("up");
          break;
        case "i":
          togglePictureInPictureMode();
          break;
        case "t":
          toggleTheaterMode();
          break;
        case "f":
          toggleFullscreenMode();
          break;
      }
    },
    [
      localVolume,
      skipOffset,
      togglePlay,
      skipVideo,
      volumeSliderChange,
      toggleMute,
      toggleCaptions,
      rateChanger,
      togglePictureInPictureMode,
      toggleTheaterMode,
      toggleFullscreenMode,
    ]
  );
  //useEffects ------------------------------
  useEffect(() => {
    video.current.load();
    //we must call it only once per video 'src' , each time we call it video src totally reloaded and start from beginning , only after this line events like 'loadMetaData' will work correctly
  }, []);
  useEffect(() => {
    const videoElm = video.current;
    videoElm.volume = muted ? 0 : volume;
    videoElm.muted = muted || volume === 0;
  }, [muted, volume]);
  useEffect(() => {
    video.current.playbackRate = rate;
  }, [rate]);
  useEffect(() => {
    const track = video.current.textTracks[0]; //one video can have multiple captions(subtitles for different languages) but here we assume we have only one caption so we get first textTrack caption has things like
    //we have track.cues,track.activeCues,track.addCue,track.removeCue,track.oncuechange,track.addEventListener
    //for typescript types we have  TextTrack,TextTrackList,TextTrackCue,TextTrackCueList
    if (enableCaption && track) {
      track.mode = "hidden"; //hide default video caption because we want to create our own caption style
      //if mode is 'disabled' then .cues will always be null
      track.addEventListener("cuechange", cueChangeHandler);
      return () => {
        track.removeEventListener("cuechange", cueChangeHandler);
      };
    }
  }, [enableCaption, cueChangeHandler]);
  useEffect(() => {
    const containerElm = container.current;
    const videoElm = video.current;
    window.addEventListener("blur", tabBlurHandler);
    document.addEventListener("keydown", addKeyShortcuts);
    document.addEventListener("fullscreenchange", fullscreenChangeHandler);
    document.addEventListener("mousemove", seekerScrubMoveHandler);
    document.addEventListener("touchmove", seekerScrubMoveHandler);
    document.addEventListener("mouseup", seekerScrubEndHandler);
    containerElm.addEventListener("touchend", seekerScrubEndHandler);
    videoElm.addEventListener(
      "enterpictureinpicture",
      pictureInPictureChangeHandler
    );
    videoElm.addEventListener(
      "leavepictureinpicture",
      pictureInPictureChangeHandler
    );
    return () => {
      window.removeEventListener("blur", tabBlurHandler);
      document.removeEventListener("keydown", addKeyShortcuts);
      document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
      document.removeEventListener("mousemove", seekerScrubMoveHandler);
      document.removeEventListener("touchmove", seekerScrubMoveHandler);
      document.removeEventListener("mouseup", seekerScrubEndHandler);
      containerElm.removeEventListener("touchend", seekerScrubEndHandler);
      videoElm.removeEventListener(
        "enterpictureinpicture",
        pictureInPictureChangeHandler
      );
      videoElm.removeEventListener(
        "leavepictureinpicture",
        pictureInPictureChangeHandler
      );
    };
  }, [
    tabBlurHandler,
    addKeyShortcuts,
    fullscreenChangeHandler,
    seekerScrubMoveHandler,
    seekerScrubEndHandler,
    pictureInPictureChangeHandler,
  ]);
  return (
    <div
      ref={container}
      draggable={false}
      className={`video-player group/container relative flex w-full select-none items-center justify-center overflow-hidden bg-black ${
        mode === "default" ? "h-auto" : ""
      } ${mode === "theater" ? "h-[85vh]" : ""} ${
        mode === "fullscreen" ? "h-screen" : ""
      } ${className}`}
    >
      <video
        ref={(elm) => {
          if (elm) {
            video.current = elm;
            if (ref) {
              (ref as React.MutableRefObject<HTMLVideoElement>).current = elm;
            }
          }
        }}
        className={`mx-auto block h-auto max-h-full max-w-full ${
          mode !== "theater" ? "w-full" : "w-[80%]"
        } ${vidClassName}`}
        src={src}
        controls={false}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreenMode}
        //onLoadStart={} fired when the browser has started to load a resource(only one time)
        onLoadedMetadata={loadMetaDataHandler} //fired when the metadata(duration,...) has been loaded(only one time)
        //onLoadedData={} fired when the frame at the current playback position of the media has finished loading(only one time)
        onWaiting={waitingHandler} // fired when playback has stopped because of a temporary lack of data
        onCanPlay={canPlayHandler} // fired when the user can play media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content
        onCanPlayThrough={canPlayThroughHandler} // fired when the user can play the media, and estimates that enough data has been loaded to play the media up to its end without having to stop for further buffering of content.
        onPlay={playHandler}
        onPause={pauseHandler}
        onVolumeChange={volumeChangeHandler}
        onTimeUpdate={timeUpdateHandler} //fired when the time indicated by the currentTime attribute has been updated
        onDurationChange={durationChangeHandler}
        onRateChange={rateChangeHandler}
        onProgress={progressHandler} //fired periodically as the browser loads a resource
        // onSeeking={} start of seeking operation
        onSeeked={seekedHandler} //after seek operation complete(current video timeline position has changed with skip btns or we drag timeline or ...)
        onEnded={endHandler}
      >
        {/* {srcs.map((src) => (
          <source key={src.src} src={src.src} type={src.type} />
        ))}
        Your browser does not support HTML5 video. */}
        {/* browser will play first source that it can play(should all point to same video but maybe with different formats) */}
        {caption && (
          <track
            key={caption.src}
            src={caption.src}
            kind={caption.kind}
            label={caption.label}
            srcLang={caption.srcLang}
          />
        )}
        {/* {captions.map((caption) => (
          <track
            key={caption.src}
            src={caption.src}
            kind={caption.kind}
            label={caption.label}
            srcLang={caption.srcLang}
          />
        ))} */}
      </video>
      {showThumbnail && activePreview && (
        <div className="absolute left-0 top-0 z-1 h-full w-full">
          <Image
            src={activePreview}
            alt={activePreview}
            width={200}
            height={200}
            className="h-full w-full object-cover blur-sm"
          />
        </div>
      )}
      <div className="absolute bottom-0 left-0 z-2 flex w-full flex-col items-center text-body2 text-white md:text-subtitle1">
        {enableCaption && (
          <div
            ref={captionElm}
            className={`mb-4 max-w-[90%] rounded-sm bg-black/75 p-2 text-center empty:p-0 ${captionClassName}`}
          ></div>
        )}
        {controls && (
          <div
            className={`group/controls hidden w-full group-focus-within/container:block group-hover/container:block ${
              !isPlaying ? "!block" : ""
            } `}
          >
            <div
              ref={seekerContainer}
              onMouseDown={seekerScrubStartHandler}
              onTouchStart={seekerScrubStartHandler}
              onMouseMove={seekerMoveHandler}
              onTouchMove={seekerMoveHandler}
              onMouseLeave={seekerOutHandler}
              onTouchEnd={seekerOutHandler}
              onClick={seekerClickHandler}
              className="seeker-container group/seeker mx-auto w-[90%] cursor-pointer py-1 sm:w-[95%] sm:py-2 md:py-4 lg:w-[98%]"
            >
              <div className="relative h-[4px] w-full bg-slate-700 hover:h-[6px]">
                <div className="position-seeker absolute z-1 h-full w-full origin-left bg-slate-400"></div>
                <div
                  className="progress-seeker absolute z-2 h-full w-full origin-left"
                  style={{
                    backgroundColor: parsedColor,
                  }}
                ></div>
                <div
                  className="indicator absolute left-0 top-1/2 z-3 aspect-square w-[0px] -translate-x-1/2 -translate-y-1/2 rounded-circle group-hover/seeker:w-[15px]"
                  style={{
                    backgroundColor: parsedColor,
                  }}
                ></div>
                {activePreview && (
                  <div className="preview-container pointer-events-none absolute bottom-5 z-4 aspect-video h-[40px] -translate-x-1/2 overflow-hidden rounded-sm border-2 border-solid border-white sm:h-[60px] md:h-[80px] lg:h-[100px]">
                    <Image
                      src={activePreview}
                      alt={activePreview}
                      width={100}
                      height={100}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="group/control-btns flex select-none items-center justify-between gap-2 p-1 !pt-0 sm:p-2 md:p-4">
              <div className="flex items-center gap-2">
                {!isEnd ? (
                  <Button
                    variant="text"
                    ripple={false}
                    className="!p-0"
                    onClick={togglePlay}
                  >
                    <Icon
                      icon={isPlaying ? "mdi:pause" : "mdi:play"}
                      color="white"
                      size="md"
                    />
                  </Button>
                ) : (
                  <Button
                    variant="text"
                    ripple={false}
                    className="!p-0"
                    onClick={refreshClick}
                  >
                    <Icon icon="mdi:refresh" color="white" size="md" />
                  </Button>
                )}
                <Button
                  variant="text"
                  ripple={false}
                  className="!p-0"
                  onClick={() => skipVideo(-skipOffset)}
                >
                  <Icon icon="mdi:skip-previous" color="white" size="md" />
                </Button>
                <Button
                  variant="text"
                  ripple={false}
                  className="!p-0"
                  onClick={() => skipVideo(skipOffset)}
                >
                  <Icon icon="mdi:skip-next" color="white" size="md" />
                </Button>
                <div className="group/volume flex items-center">
                  <Button
                    variant="text"
                    ripple={false}
                    className="peer !p-0"
                    onClick={toggleMute}
                  >
                    <Icon
                      icon={
                        !localVolume
                          ? "mdi:volume-mute"
                          : localVolume < 0.5
                          ? "mdi:volume-medium"
                          : "mdi:volume-high"
                      }
                      color="white"
                      size="md"
                    />
                  </Button>
                  <Slider
                    className="mx-0 w-0 opacity-0 transition-all duration-200 ease-in-out group-hover/volume:mx-4 group-hover/volume:w-[100px] group-hover/volume:opacity-100 peer-focus:mx-4 peer-focus:w-[100px] peer-focus:opacity-100"
                    value={localVolume}
                    setValue={volumeSliderChange}
                    showTooltip={false}
                    hideDetails
                    min={0}
                    max={1}
                    step={0.01}
                    railStyle={{
                      height: "8px",
                      backgroundColor: "white",
                    }}
                    trackStyle={{
                      height: "8px",
                      backgroundColor: `${parsedColor}aa`,
                    }}
                    handleStyle={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: parsedColor,
                      opacity: 1,
                      top: "40%",
                      border: "none",
                    }}
                  />
                </div>
                <div className="flex items-center gap-1 text-caption sm:text-body1">
                  <span ref={timeElm}></span>
                  <span>/</span>
                  <span>{duration}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="text"
                  ripple={false}
                  className="!p-0"
                  onClick={toggleCaptions}
                  disabled={!caption}
                >
                  <Icon
                    icon={
                      !enableCaption
                        ? "mdi:closed-caption-outline"
                        : "mdi:closed-caption"
                    }
                    color="white"
                    size="md"
                  />
                </Button>
                <Button
                  variant="text"
                  ripple={false}
                  className="!p-0 text-body2 sm:text-body1"
                  onClick={() => rateChanger("up")}
                  color="white"
                >
                  {localRate}x
                </Button>
                <Button
                  variant="text"
                  ripple={false}
                  className="!p-0"
                  onClick={togglePictureInPictureMode}
                >
                  <Icon
                    icon={
                      mode === "picture-in-picture"
                        ? "mdi:picture-in-picture-bottom-right-outline"
                        : "mdi:picture-in-picture-bottom-right"
                    }
                    color="white"
                    size="md"
                  />
                </Button>
                <Button
                  variant="text"
                  ripple={false}
                  className="!p-0"
                  onClick={toggleTheaterMode}
                >
                  <Icon
                    icon={
                      mode === "theater"
                        ? "mdi:rectangle"
                        : "mdi:rectangle-outline"
                    }
                    color="white"
                    size="md"
                  />
                </Button>
                <Button
                  variant="text"
                  ripple={false}
                  className="!p-0"
                  onClick={toggleFullscreenMode}
                >
                  <Icon
                    icon={
                      mode === "fullscreen"
                        ? "mdi:fullscreen-exit"
                        : "mdi:fullscreen"
                    }
                    color="white"
                    size="md"
                  />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {loading && (
        <ProgressCircular
          size={100}
          width={5}
          color={color}
          indeterminate
          className="absolute left-1/2 top-1/2 z-2 -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </div>
  );
};

export default forwardRef(VideoPlayer);
