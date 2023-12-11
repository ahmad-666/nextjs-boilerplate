import { useEffect } from 'react'
import { useRouter } from 'next/router'
import axiosInstance from '@/src/utils/axios'
import type {GetServerSideProps,GetServerSidePropsContext} from 'next'
import { useQuery } from '@tanstack/react-query'

//for SSR we add getServerSideProps , for ssg,isr we add getStaticProps,getStaticPaths(for ssg pages that have dynamic route)
type User = {
  id:number,
  name: string 
}
type PageProps = {
  users: User[]
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context:GetServerSidePropsContext) => {
  // context.params,context.query,context.locale,context.locales,context.req,context.res
  //const {userId} = context.params!
  try{
    const {data:users} = await axiosInstance.get<User[]>('/users')
    if(!users || !users.length) {
      //server return 200 status code but we don't have any result 
      return {notFound:true}
      //return {redirect:{destination:'/404',permanent:false}}
    }
    return {props:{users} }
  }
  catch(err){
    //if server returns 4XX,5XX status code or if we manually throw new Error in 'try' block 
    return {props:{users:[]}}
  }
  
};

export default function Page({users=[]}:PageProps) {
  const router = useRouter()
 
  // useEffect(()=>{
  //   router.push('/404')
  // },[])
 const {isFetching,isError,data:newUsers} = useQuery<User[]>({
  initialData: users,
  refetchOnMount:false,
  queryKey: ['get-users'],
  queryFn: async ()=>{
    //if we face any problem then isError will became true 
    const {data} = await axiosInstance.get('/users')
    return data 
  }
 })
  return <div>
    <h1>Server Users:</h1>
    {
      users.map(u=><h5 key={u.id}>{u.name}</h5>)
    }
    <h1>Users:</h1>
    {isFetching && <h1>Loading ...</h1>}
    {isError && <h1>Error ...</h1>}
    {
      newUsers.map(u=><h5 key={u.id}>{u.name}</h5>)
    }
  </div>;
}
