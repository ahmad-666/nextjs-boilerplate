import useClient from "../../hooks/useClient";

export type ClientOnlyProps = {
  children: React.ReactNode;
};

export default function ClientOnly({ children }: ClientOnlyProps) {
  const isClient = useClient();
  if (!isClient) return null;
  return <>{children}</>;
}
