import NextAuth, {
  SessionStrategy,
  NextAuthOptions,
  DefaultSession,
  User,
} from "next-auth";
// import {JWT} from 'next-auth/jwt'
import CredentialsProvider from "next-auth/providers/credentials";
//because we use next-auth we don't use redux,zustand,... anymore
const STRATEGY: SessionStrategy = "jwt";
declare module "next-auth" {
  //extend User type
  interface User {
    id?: number | string;
    name?: string;
    img?: string;
    token?: string;
  }
  interface Session extends DefaultSession {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  //extend User type
  interface JWT {
    user?: User;
  }
}

export const authOptions: NextAuthOptions = {
  //   secret: "secret", //no need to provide it and we just provide NEXTAUTH_SECRET env variable inside .env file and that value will be used as 'secret' here
  session: {
    strategy: STRATEGY, //default is 'jwt' , if we used adapter we should use 'database'
    maxAge: 30 * 24 * 60 * 60, //in seconds , 30 days(default) ... jwt maxAge will be this value too ... with this we persist data
    updateAge: 24 * 60 * 60, //in seconds , 24 hours(default)
  },
  pages: {
    signIn: "/login", //create custom login page
    //we should create /app/login/page.tsx file and inside that we have login form
    //
    //signOut: "/logout", //create custom signOut page ...
    //newUser: "/register", //If set, new users will be directed here on first sign in
  },
  providers: [
    //array of different providers, we can use google,github,... providers too
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        // always executed on server
        // credentials is same credentials that we define above so here we have credentials.username , credentials.password
        //this method will return promise but manually we never call it
        const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });
        //const user = await res.json();
        const user = { id: "1", name: "name", img: "/1.jpg", token: "token" }; //we do this line because we want to simulate real response
        if (user) {
          //we can access to return value inside 'jwt({user})' method
          return user;
        }
        return null; //unauth
      },
    }),
  ],
  //   import { signIn, signOut } from "next-auth/react";
  //signIn(); //without arg will send us to login page
  //if we don't set pages:{signIn} then login page  will be created by next-auth itself and its submitting will handle by next-auth itself
  //if inside [...nextauth]/route.ts we have:
  //   credentials: {
  //     username: { label: "username", type: "text" }, //label,type are attribute of <input />
  //     password: { label: "password", type: "password" },
  //   },
  //so inside login page we have two input field and we access its content via credentials.username,credentials.password
  //other way is that we use
  //   signIn("credentials", {
  //     //call 'authorize' method inside /app/api/auth/[...nextauth]/route.ts
  //     //first arg is type of provider
  //     username: "entered-username",
  //     password: "entered-password",
  //     redirect: true,
  //     callbackUrl: "/",
  //   }); now we call

  callbacks: {
    //examples: https://next-auth.js.org/configuration/callbacks
    //first jwt() will be called and then session() so we can pass data from jwt() to session()
    async jwt({ token, user, trigger, session }) {
      //called whenever jwt created or updated ... returned value(token) will be encrypted, and it is stored in a cookie.
      //   if (account) {
      //     token.accessToken = account.access_token;
      //   }
      //token arg is not accessToken that we get via back-end and its just name of field here
      if (user) token.user = user; //'user' only has value if execute 'authorize' method in provider
      if (trigger === "update") {
        //when we call 'update()' method
        //trigger can be 'signIn','signUp','update'
        //now session is payload of 'update()' method that we call
        const { name: newName, img: newImg } = session;
        if (token.user) {
          if (newName) token.user.name = newName;
          if (newImg) token.user.img = newImg;
        }
      }
      return token;
    },
    async session({ session, token }) {
      //called whenever a session is checked ... return value(session) will be accessible via useSession() or getServerSession()
      session.user = token.user!;
      return session;
    },
  },
};
const nextAuth = NextAuth(authOptions);
export { nextAuth as GET, nextAuth as POST };
