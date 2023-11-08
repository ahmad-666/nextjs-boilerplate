import ImageComparison from ".";

export default function Example() {
  return (
    <div>
      <ImageComparison
        className="h-[600px] w-full"
        imgClass="object-cover"
        originalImg="/imgs/img-1.jpg"
        compareImg="/imgs/img-2.jpg"
      />
    </div>
  );
}
