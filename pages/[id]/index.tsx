import { useRouter } from 'next/router'
import type {GetServerSideProps,GetServerSidePropsContext} from 'next'


export const getServerSideProps: GetServerSideProps = async (context:GetServerSidePropsContext) => {
    console.log('server',(context.params!).id)
    return {props:{} }
};

export default function Page() {
  const router = useRouter()

  return (
    <div>
        <h1>{router.query.id}</h1>
    </div>
  )
}
