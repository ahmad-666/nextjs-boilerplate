import { useSession } from "next-auth/react";
const useAuth = () => {
  const session = useSession();
  //we have session.status,session.data,session.update()
  //status can be 'loading','authenticated','unauthenticated'
  //update is method
  //data is data about logged-in user ... null of not user is logged-in
  const user = session.data?.user;
  return {
    isAuth: !!user,
    id: user?.id,
    name: user?.name,
    img: user?.img,
    token: user?.token,
  };
};
export default useAuth;
