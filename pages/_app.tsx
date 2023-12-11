//act as layout 

import App, {
  type AppContext,
  type AppInitialProps,
  type AppProps,
} from "next/app";
import axiosInstance from "@/src/utils/axios";
import { Inter } from "next/font/google";
import ReactQuery from "@/src/context/ReactQuery";

type Post = {
  id: number;
  title: string;
};
type AppOwnProps = { posts: Post[] };

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({
  Component,
  pageProps,
  posts,
}: AppProps & AppOwnProps) {
  return (
    <>
      <main className={`${inter.className}`}>
        {/* {posts.map((p) => (
          <h3 key={p.id}>{p.title}</h3>
        ))} */}
        <ReactQuery>
          <Component {...pageProps} />
        </ReactQuery>
      </main>
    </>
  );
}

MyApp.getInitialProps = async (
  context: AppContext
): Promise<AppOwnProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context);
  const { data: posts } = await axiosInstance.get<Post[]>("/posts");

  return { ...ctx, posts };
};
