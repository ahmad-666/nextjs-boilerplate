"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
type NextAuthProps = {
  children: React.ReactNode;
  session: Session | null;
};
export default function NextAuth({ children, session }: NextAuthProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
