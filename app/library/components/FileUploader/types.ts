export type FilePreviewType = {
  id: number | string;
  src: string;
  name: string;
  type: string; //mime type
  size?: number;
  desc?: string;
};
export type FilePreviewProps = FilePreviewType & {
  clearable?: boolean;
  clearClicked?: (id: number | string) => void;
  maxCharacters?: number;
  className?: string;
};
export type FilesSectionProps = {
  type: "accepted" | "rejected";
  previews: FilePreviewType[];
  clearable?: boolean;
  clearClicked?: (id: number | string) => void;
  maxCharacters?: number;
  acceptedFilesTitle?: string;
  rejectedFilesTitle?: string;
  className?: string;
};
export type FileType = {
  id: number | string;
  file: null | File;
};
export type FileUploaderSingle = {
  multiple: false;
  maxFiles?: never;
  file: null | FileType;
  setFile: (val: null | FileType) => void;
  preview: null | FilePreviewType;
  setPreview: (val: null | FilePreviewType) => void;
};
export type FileUploaderMultiple = {
  multiple: true;
  maxFiles?: number;
  file: FileType[];
  setFile: (val: FileType[]) => void;
  preview: FilePreviewType[];
  setPreview: (val: FilePreviewType[]) => void;
};
export type BasicProps = {
  accept?: string[];
  maxSize?: number;
  maxCharacters?: number;
  color?: string;
  hideDetails?: boolean;
  clearable?: boolean;
  clearHandler?: (id: number | string) => void;
  hint?: string;
  error?: string;
  className?: string;
};
export type FileUploaderProps = BasicProps &
  (FileUploaderSingle | FileUploaderMultiple);
