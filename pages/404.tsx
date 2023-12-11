export default function Custom404() {
    //will execute for any non existed client routes 
    //will execute if we use --> return {notFound:true} from getServerSideProps 
    //in client we can use --> const router = useRouter() , router.push('/404')
    return <h1>404 - Page Not Found!!!!</h1>
  }