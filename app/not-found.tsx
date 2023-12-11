import Link from "next/link";

export default function NotFound() {
  //different from error.tsx , will execute for any client route that we don't have it or for anytime we manually call:
  //import { notFound } from "next/navigation";
  //notFound();
  return (
    <div>
      <h2>Not Found</h2>
      <Link href="/">Return Home</Link>
    </div>
  );
}
