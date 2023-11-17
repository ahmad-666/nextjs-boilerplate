// -for video thumbnail we could use <video poster="img.jpg" /> but its for specific frame
// const generateThumbnail = useThumbnail();
// const [src, setSrc] = useState("");
// <img src={src} />
// <button onClick={async () => {
//     try {
//         const thumbnail = await generateThumbnail("/videos/vid.mp4",400);
//         setSrc(thumbnail);
//     } catch (err) {}
// }}>
//     click me
// </button>

import { useCallback } from "react";

const useThumbnail = () => {
  const generateThumbnail = useCallback(
    (
      src: string,
      seekTo: number = 1,
      quality: number = 0.5
    ): Promise<string> => {
      //seekTo is second in timeline of video that we want to generate thumbnail for it
      //quality should be value [0,1]
      return new Promise((resolve, reject) => {
        const videoPlayer = document.createElement("video");
        videoPlayer.setAttribute("src", src);
        videoPlayer.load();
        videoPlayer.addEventListener("error", () => {
          reject("error when loading video file");
        });
        videoPlayer.addEventListener("loadedmetadata", () => {
          if (videoPlayer.duration < seekTo) {
            reject("video is too short.");
          }
          setTimeout(() => {
            // delay seeking or else 'seeked' event won't fire on Safari
            videoPlayer.currentTime = seekTo;
          }, 200);
          videoPlayer.addEventListener("seeked", () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d")!;
            canvas.width = videoPlayer.videoWidth;
            canvas.height = videoPlayer.videoHeight;
            ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
            ctx.canvas.toBlob(
              (blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  resolve(url);
                } else reject("cannot generate blob");
              },
              "image/jpeg",
              quality
            );
          });
        });
      });
    },
    []
  );
  return generateThumbnail;
};

export default useThumbnail;
