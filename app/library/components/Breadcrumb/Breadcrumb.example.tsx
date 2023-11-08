import Breadcrumb from ".";
import BreadcrumbItem from "../BreadcrumbItem";

export default function Example() {
  return (
    <div>
      {
        <Breadcrumb activeClass="!bg-purple-500 !text-white rounded-sm">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/cat" disabled>
            Category
          </BreadcrumbItem>
        </Breadcrumb>
      }
    </div>
  );
}
