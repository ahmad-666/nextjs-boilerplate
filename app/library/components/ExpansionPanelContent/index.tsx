export type ExpansionContentProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ExpansionPanelContent({
  children,
  className = "",
}: ExpansionContentProps) {
  return (
    <div className={`overflow-hidden !p-0`}>
      <div className={`${className}`}>{children}</div>
    </div>
  );
}
