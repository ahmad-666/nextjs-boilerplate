import { useState, useRef, useEffect } from "react";
import VideoPlayer from ".";
import Icon from "../Icon";
import useThumbnail from "../../hooks/useThumbnail";

export default function Example() {
  const video = useRef<HTMLVideoElement>(null!);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState("");
  const generateThumbnail = useThumbnail();
  useEffect(() => {
    const createThumbnail = async () => {
      const src = await generateThumbnail("/videos/vid.mp4", 5);
      setThumbnailSrc(src);
    };
    createThumbnail();
  }, [generateThumbnail]);
  return (
    <div>
      <h1>1-Simple Video with ref</h1>
      <button
        onClick={() => {
          video.current.pause();
        }}
      >
        pause
      </button>
      <VideoPlayer
        ref={video}
        src="/videos/vid.mp4"
        caption={{
          src: "/videos/sub-fa.vtt",
          kind: "subtitles",
          label: "Persian",
          srcLang: "fa",
        }}
        autoPlay
        thumbnailCount={20}
        muted={false}
        loop
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
      />

      <h1>2-Video that when we pause we see thumbnail</h1>
      <div className="relative">
        <VideoPlayer
          ref={video}
          src="/videos/vid.mp4"
          caption={{
            src: "/videos/sub-fa.vtt",
            kind: "subtitles",
            label: "Persian",
            srcLang: "fa",
          }}
          autoPlay
          thumbnailCount={20}
          muted={false}
          loop
          // className="h-[400px] w-[400px] rounded"
          className=""
          onPlay={() => {
            setIsPlaying(true);
          }}
          onPause={() => {
            setIsPlaying(false);
          }}
        />
        {!isPlaying && (
          <div
            onClick={() => {
              video.current.play();
            }}
            className="absolute left-0 top-0 z-3 h-full w-full cursor-pointer bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${thumbnailSrc})`,
            }}
          >
            <div className="flex h-full w-full flex-col items-center justify-center bg-black/75">
              <Icon color="red-600" size={100} icon="mdi:play-circle" />
              <p className="mt-6 text-center text-h6 font-bold text-white">
                Title Of Video
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
