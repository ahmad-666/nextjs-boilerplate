export type TabContentProps = {
  value: number | string;
  children: React.ReactNode;
  className?: string;
};

export default function TabContent({
  value,
  children,
  className = "",
}: TabContentProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
