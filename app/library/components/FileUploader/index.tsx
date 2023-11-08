//if we multiple files and each file should have edit functionality instead of create one <FileUploader multiple /> we can create multiple <FileUploader multiple={false} />
//we get files,setFiles,previews,setPreviews as props because we need them on parent too(files,previews should only contain accepted files that those files that exceed maxSize,maxFiles,...) and we have local states such as acceptedPreviews,setAcceptedPreviews

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import FormHint from "../FormField/FormHint";
import Icon from "../Icon";
import Button from "../Button";
import FilesSection from "./FilesSection";
import { useTranslations } from "next-intl";
import type { FileUploaderProps, FilePreviewType, FileType } from "./types";

export default function FileUploader({
  file,
  setFile,
  preview,
  setPreview,
  multiple,
  accept = ["*/*"], //['image/png','video/*']
  maxSize = -1, //in megabytes ... -1 for no restriction , 5 for 5mb
  maxFiles = -1, //-1 for for restriction
  maxCharacters = 20, //for clamp filename
  clearable = true,
  clearHandler,
  color = "primary",
  hideDetails = false,
  error = "",
  hint = "",
  className,
}: FileUploaderProps) {
  const t = useTranslations("fileUploader");
  const inputRef = useRef<HTMLInputElement>(null!);
  const [acceptedPreviews, setAcceptedPreviews] = useState<FilePreviewType[]>(
    []
  ); //always array even for multiple:false
  const [rejectedPreviews, setRejectedPreviews] = useState<FilePreviewType[]>(
    []
  ); //always array even for multiple:false
  const acceptNormalize = useMemo(() => {
    return accept.join(", ");
  }, [accept]);
  const translations = useMemo(() => {
    return {
      dragAndDrop: t("dragAndDrop"),
      or: t("or"),
      upload: t("upload"),
      acceptedFiles: t("acceptedFiles"),
      rejectedFiles: t("rejectedFiles"),
    };
  }, [t]);
  const openFileBrowser = useCallback(() => {
    inputRef.current.click();
  }, []);
  const checkSize = useCallback(
    (fileSize: number) => {
      if (maxSize >= 0 && fileSize > maxSize * 1024 * 1024) return false;
      return true;
    },
    [maxSize]
  );
  const checkQuantity = useCallback(
    (filesNum: number) => {
      if (maxFiles >= 0 && acceptedPreviews.length + filesNum > maxFiles)
        return false;
      return true;
    },
    [maxFiles, acceptedPreviews]
  );
  const updateFile = useCallback(
    (uploadedFile?: File | FileList) => {
      if (!multiple && uploadedFile) {
        //do nothing for cancel btn
        const newFile = uploadedFile as File;
        const { name, size, type } = newFile as File;
        const src = URL.createObjectURL(newFile);
        const sizeIsValid = checkSize(newFile.size);
        const id = Math.random();
        const file: FileType = {
          id,
          file: newFile,
        };
        const filePreview: FilePreviewType = {
          id,
          src,
          name,
          size,
          type,
          desc: !sizeIsValid
            ? `maximum accepted file size is ${maxSize}mb`
            : "",
        };
        setAcceptedPreviews(sizeIsValid ? [filePreview] : []);
        setRejectedPreviews(!sizeIsValid ? [filePreview] : []);
        setPreview(sizeIsValid ? filePreview : null);
        setFile(sizeIsValid ? file : null);
      } else if (multiple && uploadedFile) {
        //do nothing for cancel btn
        const newFiles = uploadedFile as FileList;
        const newAcceptedPreviews: FilePreviewType[] = [];
        const newRejectedPreviews: FilePreviewType[] = [];
        const newAcceptedFiles: FileType[] = [];
        [...newFiles].forEach((newFile: File, i: number) => {
          const { name, size, type } = newFile;
          const src = URL.createObjectURL(newFile);
          const sizeIsValid = checkSize(newFile.size);
          const quantityIsValid = checkQuantity(i + 1);
          const id = Math.random();
          const file = {
            id,
            file: newFile,
          };
          const filePreview: FilePreviewType = {
            id,
            src,
            name,
            size,
            type,
            desc: !sizeIsValid
              ? `maximum accepted file size is ${maxSize}mb`
              : !quantityIsValid
              ? `maximum accepted files number is ${maxFiles}`
              : "",
          };
          if (!sizeIsValid || !quantityIsValid) {
            newRejectedPreviews.push(filePreview);
          } else {
            newAcceptedPreviews.push(filePreview);
            newAcceptedFiles.push(file);
          }
        });
        setAcceptedPreviews([...acceptedPreviews, ...newAcceptedPreviews]);
        setRejectedPreviews([...newRejectedPreviews]); //we clear previous rejected and only append new ones
        setPreview([...preview, ...newAcceptedPreviews]);
        setFile([...file, ...newAcceptedFiles]);
      }
    },
    [
      acceptedPreviews,
      checkQuantity,
      checkSize,
      file,
      maxFiles,
      maxSize,
      multiple,
      preview,
      setFile,
      setPreview,
    ]
  );
  const changeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!multiple) updateFile(files?.[0]);
      else updateFile(files!);
    },
    [multiple, updateFile]
  );
  const clearClicked = useCallback(
    (id: number | string) => {
      //only for acceptedPreviews we show clear icon
      if (!multiple) {
        setAcceptedPreviews([]);
        setFile(null);
        setPreview(null);
      } else {
        setAcceptedPreviews(acceptedPreviews.filter((p) => p.id !== id));
        setFile(file.filter((f) => f.id !== id));
        setPreview(preview.filter((p) => p.id !== id));
      }
      if (clearHandler) clearHandler(id);
    },
    [
      multiple,
      clearHandler,
      setFile,
      setPreview,
      preview,
      acceptedPreviews,
      file,
    ]
  );
  const dragOverHandler = useCallback((e: React.DragEvent) => {
    e.preventDefault(); //make container a valid drop zone
  }, []);
  const dropHandler = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault(); //prevent file(s) from being opened
      const { files } = e.dataTransfer;
      if (files.length) {
        if (!multiple) updateFile(files[0]);
        else updateFile(files);
      }
    },
    [multiple, updateFile]
  );
  useEffect(() => {
    //for init time to fill acceptedPreviews base on previews
    if (!multiple && preview) setAcceptedPreviews([preview]);
    else if (multiple && preview.length) setAcceptedPreviews(preview);
  }, [multiple, preview]);
  return (
    <div className={`max-w-[100%] ${className}`}>
      <div>
        <div
          onDragOver={(e) => dragOverHandler(e)}
          onDrop={(e) => dropHandler(e)}
          className="flex items-center justify-center rounded-sm border-2 border-dashed border-border-main p-4"
        >
          <input
            ref={inputRef}
            type="file"
            accept={acceptNormalize}
            multiple={multiple}
            onChange={changeHandler}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4 text-subtitle1 font-bold text-text-main">
            <Icon icon="mdi:tray-arrow-up" size="lg" color={color} />
            <p className="text-center">{translations.dragAndDrop}</p>
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-16 bg-text-main"></span>
              <p>{translations.or}</p>
              <span className="h-0.5 w-16 bg-text-main"></span>
            </div>
            <Button
              color={color}
              variant="filled"
              size="md"
              flat
              onClick={openFileBrowser}
            >
              {translations.upload}
            </Button>
          </div>
        </div>
        {(error || hint) && (
          <FormHint hideDetails={hideDetails} error={error} hint={hint} />
        )}
      </div>
      {!!acceptedPreviews.length && (
        <FilesSection
          className="mt-4"
          type="accepted"
          previews={acceptedPreviews}
          clearable={clearable}
          clearClicked={clearClicked}
          maxCharacters={maxCharacters}
          acceptedFilesTitle={translations.acceptedFiles}
        />
      )}
      {!!rejectedPreviews.length && (
        <FilesSection
          className="mt-4"
          type="rejected"
          previews={rejectedPreviews}
          maxCharacters={maxCharacters}
          rejectedFilesTitle={translations.rejectedFiles}
        />
      )}
    </div>
  );
}
