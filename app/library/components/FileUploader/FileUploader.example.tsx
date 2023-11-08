import { useState } from "react";
import FileUploader from ".";
import type { FileType, FilePreviewType } from "./types";

export default function Example() {
  const [file, setFile] = useState<null | FileType>(null);
  const [preview, setPreview] = useState<null | FilePreviewType>(null);
  const [files, setFiles] = useState<FileType[]>([]);
  const [previews, setPreviews] = useState<FilePreviewType[]>([
    {
      id: 1,
      name: "name",
      src: "/imgs/img-1.jpg",
      type: "image/*", //*/* if we don't know its mime type
    },
  ]);
  return (
    <div>
      <h1>1-Single</h1>
      <FileUploader
        className="w-[450px]"
        file={file}
        setFile={(f) => {
          setFile(f);
        }}
        preview={preview}
        setPreview={(p) => setPreview(p)}
        multiple={false}
        maxSize={1}
        clearHandler={(id) => {}}
      />

      <h1>2-Multiple</h1>
      <FileUploader
        className="w-[450px]"
        file={files}
        setFile={(f) => {
          setFiles(f);
        }}
        preview={previews}
        setPreview={(p) => setPreviews(p)}
        multiple={true}
        maxSize={1}
        maxFiles={3}
        clearHandler={(id) => {}}
      />
    </div>
  );
}
