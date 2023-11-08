export type ItemProps = {
  value: number | string;
  toggleItem?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function Item({
  value,
  toggleItem,
  disabled = false,
  children,
  className = "",
}: ItemProps) {
  return (
    <div
      onClick={toggleItem}
      className={`${
        disabled ? "pointer-events-none opacity-40" : "cursor-pointer"
      } ${className}`}
    >
      {children}
    </div>
  );
}
