//for example check StepperHeaders folder

export type StepperItemProps = {
  step: number;
  children: React.ReactNode;
  className?: string;
};

export default function StepperItem({
  step,
  children,
  className = "",
}: StepperItemProps) {
  return <div className={`${className}`}>{children}</div>;
}
