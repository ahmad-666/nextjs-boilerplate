//it's not hook and its simple method because we can use it totally outside of any react hook,react component
//because its simple method we can't handle any state like loading,error,success and we handle them manually(create useHttp hook) or via react-query(useQuery,useMutation)
//if we want to create useHTTP it should manage states like loading,error,success,data,... get callbacks like beforeReq,afterReq,onSuccess,onError,...
//this method is only for replacing axios(with being wrapper around fetch) and nothing more and if we are using axios there is no need for using it
//for error handling in axios we use try/catch but in fetch we work with res.ok and if !res.ok we should throw new error
//we can use 'fetchReq' method directly but its better that we create instance for it and work with those instances e.g for setting baseUrl,interceptors,authorization token or ...
//for anything that we want to do it globally on http req --> use interceptor
//Example:
// .env: NEXT_PUBLIC_BASE_URL = https://jsonplaceholder.typicode.com
// /app/api/users.ts:
// import { fetchInstance } from "@/app/utils/fetchReq";
// export const getUsers = async ({name,age,}: {name: string;age: number;}) => {
//   const users = await fetchInstance("/users", {method: "GET",params: {name,age,},});
//   return users;
// };
// Comp.ts:
// import { useQuery } from "react-query";
// import { getUsers } from "@/app/api/user";
// const { data, isLoading, error } = useQuery({
//   queryKey: [""],
//   queryFn: async () => {
//     const users = await getUsers();
//     return users;
//   },
//   onError(err){setSnackbar(err)}
// });

import { getServerSession } from "next-auth/next"; //for get auth session from server
import { getSession } from "next-auth/react"; //for get auth session from client
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type ResponseType = "JSON" | "BLOB";
type Cache = "no-store" | "force-cache";
type ReqError = {
  status: number;
  statusText: string;
  url: string;
  message: string;
};
type FetchReqConfig = {
  baseUrl?: string;
  method?: Method;
  headers?: HeadersInit;
  responseType?: ResponseType;
  params?: Record<string, any>;
  body?: any;
  cache?: Cache;
  revalidate?: false | number;
  beforeRequest?: () => void;
  afterRequest?: () => void;
  onSuccess?: (res?: any) => void;
  onError?: (err?: ReqError) => void;
};

const defaultConfig: FetchReqConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "JSON",
};

const fetchReq = async (
  url: string,
  {
    baseUrl = defaultConfig.baseUrl,
    method = defaultConfig.method,
    headers = defaultConfig.headers,
    responseType = defaultConfig.responseType,
    params, //for url query
    body = {},
    cache = "no-store", //'no-store' for ssr,'force-cache' for ssg,isr(base on revalidate)
    revalidate = 0, //in seconds,3600 means cache life-time is 1hour , 0 means don't cache at all(same as cache:'no-store') , false means cache resource forever(same as Infinite)
    //conflicting options such as { revalidate: 0, cache: 'force-cache' } or { revalidate: 10, cache: 'no-store' } will cause an error
    beforeRequest,
    afterRequest,
    onSuccess,
    onError,
  }: FetchReqConfig = defaultConfig
) => {
  const urlQueries = new URLSearchParams(params).toString();
  const finalUrl = `${baseUrl}${url}${urlQueries ? `?${urlQueries}` : ""}`;
  if (beforeRequest) beforeRequest();
  const res = await fetch(finalUrl, {
    method,
    headers,
    body: Object.keys(body).length ? JSON.stringify(body) : undefined,
    cache,
    next: { revalidate },
  });
  if (afterRequest) afterRequest();
  if (res.ok) {
    let data: any = null;
    if (responseType === "JSON") data = await res.json();
    else if (responseType === "BLOB") data = await res.blob();
    if (onSuccess) onSuccess(data);
    return data;
  } else {
    const errorMsg = `Error in sending http req to ${res.url}`;
    if (onError) {
      onError({
        status: res.status,
        statusText: res.statusText,
        url: res.url,
        message: errorMsg,
      });
    }
    throw new Error(errorMsg);
  }
};

export const fetchInstance = async (
  url: string,
  {
    method = "GET",
    headers = {
      "Content-Type": "application/json",
    },
    responseType = "JSON",
    body,
    params,
    cache = "no-store",
    revalidate = 0,
  }: FetchReqConfig = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "JSON",
    cache: "no-store",
    revalidate: 0,
  }
) => {
  const isServer = typeof window === "undefined";
  const session = isServer
    ? await getServerSession(authOptions)
    : await getSession();
  const token = session?.user?.token; //this instance always attach auth token if we have it
  const finalHeaders: Record<string, any> = { ...headers };
  if (token) finalHeaders.Authorization = `Bearer ${token}`;
  const data = await fetchReq(url, {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL, //this instance always send its req to this baseUrl so we don't get it as arg
    method,
    headers: finalHeaders,
    responseType,
    body,
    params,
    cache,
    revalidate,
    onError: (error) => {
      //this instance always log error if we have any
    },
  });
  return data;
};

export default fetchReq;
