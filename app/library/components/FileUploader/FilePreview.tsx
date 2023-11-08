import { useMemo } from "react";
import Image from "next/image";
import Icon from "../Icon";
import Button from "../Button";
import wordSrc from "./word.png";
import powerpointSrc from "./powerpoint.png";
import excelSrc from "./excel.png";
import pdfSrc from "./pdf.png";
import textSrc from "./text.png";
import zipSrc from "./zip.png";
import fileSrc from "./file.png";
import videoSrc from "./video.png";
import type { FilePreviewProps } from "./types";

export default function FilePreview({
  id,
  src,
  name,
  type, //mime type e.g image/* or video/mp4
  size,
  desc,
  clearable = true,
  clearClicked,
  maxCharacters = 20,
  className = "",
}: FilePreviewProps) {
  const isImage = useMemo(() => {
    return type.includes("image");
  }, [type]);
  const isVideo = useMemo(() => {
    return type.includes("video");
  }, [type]);
  const isText = useMemo(() => {
    return type.includes("text");
  }, [type]);
  const isPdf = useMemo(() => {
    return type.includes("pdf");
  }, [type]);
  const isZip = useMemo(() => {
    return type.includes("zip") || type.includes("rar");
  }, [type]);
  const isWord = useMemo(() => {
    return type.includes("word");
  }, [type]);
  const isPowerpoint = useMemo(() => {
    return type.includes("powerpoint") || type.includes("presentationml");
  }, [type]);
  const isExcel = useMemo(() => {
    return type.includes("excel") || type.includes("spreadsheetml");
  }, [type]);
  const thumbnail = useMemo(() => {
    if (isImage) return src;
    else if (isVideo) return videoSrc;
    else if (isText) return textSrc;
    else if (isPdf) return pdfSrc;
    else if (isZip) return zipSrc;
    else if (isWord) return wordSrc;
    else if (isPowerpoint) return powerpointSrc;
    else if (isExcel) return excelSrc;
    else return fileSrc;
  }, [
    isExcel,
    isImage,
    isPdf,
    isPowerpoint,
    isText,
    isVideo,
    isWord,
    isZip,
    src,
  ]);
  const fileName = useMemo(() => {
    if (name.length > maxCharacters)
      return `${name.slice(0, maxCharacters)}...`;
    return name;
  }, [name, maxCharacters]);
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <a
        target="_blank"
        href={src}
        className="flex grow cursor-pointer items-center"
      >
        <Image
          src={thumbnail}
          alt="thumbnail"
          width={75}
          height={75}
          className="h-[60px] w-[60px] rounded-sm object-cover"
        />
        <div className="ms-2">
          <p className="text-body2 font-bold text-text-main">{fileName}</p>
          <div className="mt-1 text-caption">
            {!!size && (
              <span className="text-text-lighten2">
                {(size / (1024 * 1024)).toFixed(2)}Mb
              </span>
            )}
            {desc && (
              <>
                <span className="mx-2">-</span>
                <span className="text-error-main">{desc}</span>
              </>
            )}
          </div>
        </div>
      </a>
      {clearable && clearClicked && (
        <Button
          size="sm"
          variant="text"
          className="shrink-0 !p-0"
          onClick={() => clearClicked(id)}
        >
          <Icon icon="mdi:delete-outline" size="sm" color="slate-400" />
        </Button>
      )}
    </div>
  );
}
