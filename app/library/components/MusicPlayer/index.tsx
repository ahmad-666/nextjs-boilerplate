import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "../Button";
import Icon from "../Icon";
import useColorParser from "../../hooks/useColorParser";

type SongDetails = {
  name: string;
  singer: string;
  thumbnail: string;
};
type MusicPlayerProps = {
  src: string;
  song: SongDetails;
  volume?: number;
  setVolume?: (newVolume: number) => void;
  skipOffset?: number;
  color?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  visualizer?: boolean;
  onPlay?: (e: Event) => void;
  onPause?: (e: Event) => void;
  onProgress?: (e: Event) => void;
  onSeek?: (e: Event) => void;
  onEnd?: (e: Event) => void;
  className?: string;
};

export default function MusicPlayer({
  src,
  song,
  volume = 0.5,
  setVolume,
  skipOffset = 5,
  color = "primary",
  autoPlay = false,
  muted = false,
  loop = false,
  visualizer = true,
  onPlay,
  onPause,
  onProgress, //fired periodically as the browser loads a resource
  onSeek, //after seek operation complete(current video timeline position has changed with skip btns or we drag timeline or ...)
  onEnd,
  className = "",
}: MusicPlayerProps) {
  //states, hooks, ... ---------------------------
  const audio = useRef<HTMLAudioElement>(null!);
  const currentTimeElm = useRef<HTMLSpanElement>(null!); //not use state because it will update each 1 second
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [localVolume, setLocalVolume] = useState(volume);
  const latestVolume = useRef(volume);
  const parsedColor = useColorParser(color);
  //play, pause ---------------------------
  const playAudio = useCallback(() => {
    audio.current.play();
  }, []);
  const pauseAudio = useCallback(() => {
    audio.current.pause();
  }, []);
  const playHandler = useCallback(
    (e: Event) => {
      setIsPlaying(true);
      if (onPlay) onPlay(e);
    },
    [onPlay]
  );
  const pauseHandler = useCallback(
    (e: Event) => {
      setIsPlaying(false);
      if (onPause) onPause(e);
    },
    [onPause]
  );
  const togglePlay = useCallback(() => {
    if (audio.current.paused) playAudio();
    else pauseAudio();
  }, [playAudio, pauseAudio]);
  //skip backward,forward ---------------------------
  const skipAudio = useCallback((offset: number) => {
    audio.current.currentTime += offset;
  }, []);
  const skipBackHandler = useCallback(() => {
    skipAudio(-skipOffset);
  }, [skipOffset, skipAudio]);
  const skipForwardHandler = useCallback(() => {
    skipAudio(skipOffset);
  }, [skipOffset, skipAudio]);
  //volume, mute ---------------------------
  const volumeChange = useCallback((newVolume: number) => {
    audio.current.volume = newVolume;
    audio.current.muted = newVolume === 0;
    latestVolume.current = newVolume;
  }, []);
  const volumeHandler = useCallback(() => {
    const newVolume = audio.current.volume;
    setLocalVolume(newVolume);
    if (setVolume) setVolume(newVolume);
  }, [setVolume]);
  const toggleMute = useCallback(() => {
    const audioElm = audio.current;
    const isMuted = audioElm.volume === 0 || audioElm.muted;
    if (isMuted) {
      audioElm.muted = false;
      audioElm.volume = latestVolume.current;
    } else {
      audioElm.muted = true;
      audioElm.volume = 0;
    }
  }, []);
  //load data, loading, duration, timeupdate, ...
  const waitingHandler = useCallback((e: Event) => {
    setLoading(true);
  }, []);
  const canPlayHandler = useCallback((e: Event) => {
    setLoading(false);
  }, []);
  const canPlayThroughHandler = useCallback((e: Event) => {
    setLoading(false);
  }, []);
  const durationUpdateHandler = useCallback((e: Event) => {}, []);
  const timeUpdateHandler = useCallback((e: Event) => {}, []);
  const loadMetaDataHandler = useCallback((e: Event) => {}, []);
  //progress, seeker ---------------------------
  const progressHandler = useCallback(
    (e: Event) => {
      if (onProgress) onProgress(e);
    },
    [onProgress]
  );
  const seekHandler = useCallback(
    (e: Event) => {
      if (onSeek) onSeek(e);
    },
    [onSeek]
  );
  //init song, add key events, ... ---------------------------
  const addKeysShortcut = useCallback(
    (e: KeyboardEvent) => {
      const { key, target } = e;
      const tagName = (target as HTMLElement).tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea") return null;
      const normalizeKey = key.toLocaleLowerCase();
      switch (normalizeKey) {
        case " ":
          if (tagName === "button") {
            //if we focus on <button> then 'enter' or 'space' keys will have same effect as click
            e.preventDefault(); //prevent click behavior
          }
        case "k":
          togglePlay();
          break;
        case "arrowleft":
          skipBackHandler();
          break;
        case "arrowright":
          skipForwardHandler();
          break;
        case "arrowup":
          volumeChange(localVolume + 0.1);
          break;
        case "arrowdown":
          volumeChange(localVolume - 0.1);
          break;
        case "m":
          toggleMute();
          break;
      }
    },
    [
      localVolume,
      skipBackHandler,
      skipForwardHandler,
      toggleMute,
      togglePlay,
      volumeChange,
    ]
  );
  const endHandler = useCallback(
    (e: Event) => {
      if (onEnd) {
        onEnd(e);
      }
    },
    [onEnd]
  );
  useEffect(() => {
    const audioElm = audio.current;
    if (audioElm) {
      audioElm.pause(); //first clear old song then play new song
      const newAudio = new Audio(src);
      newAudio.autoplay = autoPlay;
      newAudio.loop = loop;
      newAudio.muted = muted;
      newAudio.volume = muted ? 0 : volume;
      newAudio.addEventListener("loadedmetadata", loadMetaDataHandler);
      newAudio.addEventListener("waiting", waitingHandler);
      newAudio.addEventListener("canplay", canPlayHandler);
      newAudio.addEventListener("canplaythrough", canPlayThroughHandler);
      newAudio.addEventListener("play", playHandler);
      newAudio.addEventListener("pause", pauseHandler);
      newAudio.addEventListener("volumechange", volumeHandler);
      newAudio.addEventListener("durationchange", durationUpdateHandler);
      newAudio.addEventListener("timeupdate", timeUpdateHandler);
      newAudio.addEventListener("progress", progressHandler);
      newAudio.addEventListener("seeked", seekHandler);
      newAudio.addEventListener("ended", endHandler);
      audio.current = newAudio;
      return () => {
        newAudio.removeEventListener("loadedmetadata", loadMetaDataHandler);
        newAudio.removeEventListener("waiting", waitingHandler);
        newAudio.removeEventListener("canplay", canPlayHandler);
        newAudio.removeEventListener("canplaythrough", canPlayThroughHandler);
        newAudio.removeEventListener("play", playHandler);
        newAudio.removeEventListener("pause", pauseHandler);
        newAudio.removeEventListener("volumechange", volumeHandler);
        newAudio.removeEventListener("durationchange", durationUpdateHandler);
        newAudio.removeEventListener("timeupdate", timeUpdateHandler);
        newAudio.removeEventListener("progress", progressHandler);
        newAudio.removeEventListener("seeked", seekHandler);
        newAudio.removeEventListener("ended", endHandler);
      };
    }
  }, [
    src,
    autoPlay,
    loop,
    muted,
    volume,
    loadMetaDataHandler,
    waitingHandler,
    canPlayHandler,
    canPlayThroughHandler,
    playHandler,
    pauseHandler,
    volumeHandler,
    durationUpdateHandler,
    timeUpdateHandler,
    progressHandler,
    seekHandler,
    endHandler,
  ]);

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Image
            src={song.thumbnail}
            alt={`${song.singer}-${song.name}`}
            width={200}
            height={200}
            className="h-[150px] w-[150px] animate-spin rounded-circle"
          />
          <div>
            <p className="text-body1 font-bold text-white">{song.name}</p>
            <p className="mt-2 text-body2 text-slate-400">{song.singer}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={skipBackHandler}
            variant="outlined"
            color="slate-400"
            size="md"
          >
            <Icon icon="mdi:skip-previous" color="white" size="md" />
          </Button>
          <Button
            onClick={togglePlay}
            variant="outlined"
            color="slate-400"
            size="md"
          >
            <Icon
              icon={isPlaying ? "mdi:pause" : "mdi:play"}
              color="white"
              size="md"
            />
          </Button>
          <Button
            onClick={skipForwardHandler}
            variant="outlined"
            color="slate-400"
            size="md"
          >
            <Icon icon="mdi:skip-next" color="white" size="md" />
          </Button>
        </div>
        <div>seeker</div>
        <div className="flex items-center gap-2 text-body1 text-slate-400">
          <span ref={currentTimeElm}></span>
          <span>/</span>
          <span>{duration}</span>
        </div>
        <div>volume</div>
      </div>
    </div>
  );
}
