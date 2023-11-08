import FilePreview from "./FilePreview";
import type { FilesSectionProps } from "./types";

export default function FilesSection({
  type,
  previews,
  clearable = false,
  clearClicked,
  maxCharacters = 20,
  acceptedFilesTitle,
  rejectedFilesTitle,
  className = "",
}: FilesSectionProps) {
  return (
    <div className={`${className}`}>
      <p className="text-subtitle1 font-bold text-title-main">
        {type === "accepted" ? acceptedFilesTitle : rejectedFilesTitle}
      </p>
      <div>
        {previews.map((preview, i) => (
          <div
            key={preview.id}
            className="border-0 border-b border-solid border-divider-main py-4 last:border-b-0"
          >
            <FilePreview
              id={preview.id}
              name={preview.name}
              src={preview.src}
              type={preview.type}
              size={preview.size}
              desc={preview.desc}
              clearable={clearable}
              clearClicked={clearClicked}
              maxCharacters={maxCharacters}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
