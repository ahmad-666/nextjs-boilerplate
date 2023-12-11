"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  //execute this component whenever we throw error --> throw new Error("custom error");
  //if we don't have this component in dev we see default error popup and in prod we see next.js default error page
  //we can add global-error.tsx file too but really no need for it
  //axios will automatically throw error if we get 4XX,5XX status code
  //1-
  // type Post = {id: number;title: string;};
  // export default async function Page() {await axios<Post[]>("/invalid-route");} --> we will be redirected to nearest error.tsx file
  //2-because we use try/catch we actually handle error so its like we don't have any real error and we don't see any error.tsx file
  // export default async function Page() {
  //   try {await axios("/invalid-route")}
  //   catch (err) {//if we use throw new Error here we still go to error.tsx file}
  // }
  //3-don't use any try/catch inside queryFn so let axios throw new Error so isError will became true, we don't show error.tsx page but we can change ui with isError:true
  // type Post = {id: number;title: string;};
  // export default function Comp() {
  //   const {isFetching,isError,data: posts, } = useQuery<Post[]>({
  //     queryKey: ["get-posts"],
  //     queryFn: async () => {
  //       const { data } = await axios.get("/invalid-route");
  //       return data;
  //     },
  //   });
  // }
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div>
      <h1>error.tsx file </h1>
      <h2>Something went wrong!</h2>
      <h3>{error.message}</h3>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
