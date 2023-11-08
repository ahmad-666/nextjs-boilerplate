import useBreakpoints from "../../hooks/useBreakpoints";
import { useMemo } from "react";

export type GridColProps = {
  totalCols?: number;
  cols?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  order?: number;
  orderSM?: number;
  orderMD?: number;
  orderLG?: number;
  orderXL?: number;
  children: React.ReactNode;
  spacing?: number;
  spacingSM?: number;
  spacingMD?: number;
  spacingLG?: number;
  spacingXL?: number;
  className?: string;
};

export default function GridCol({
  totalCols = 12,
  cols = 12,
  sm,
  md,
  lg,
  xl,
  order,
  orderSM,
  orderMD,
  orderLG,
  orderXL,
  children,
  spacing = 4,
  spacingSM,
  spacingMD,
  spacingLG,
  spacingXL,
  className = "",
}: GridColProps) {
  const { sm: isSM, md: isMD, lg: isLG, xl: isXL } = useBreakpoints();
  const width = useMemo(() => {
    let colsNum = 0;
    if (isXL) colsNum = xl || lg || md || sm || cols;
    else if (isLG) colsNum = lg || md || sm || cols;
    else if (isMD) colsNum = md || sm || cols;
    else if (isSM) colsNum = sm || cols;
    else colsNum = cols;
    return `${(colsNum / totalCols) * 100}%`;
  }, [xl, lg, md, sm, cols, isSM, isMD, isLG, isXL, totalCols]);
  const orderNormalize = useMemo(() => {
    let result;
    if (isXL) result = orderXL || orderLG || orderMD || orderSM || order;
    else if (isLG) result = orderLG || orderMD || orderSM || order;
    else if (isMD) result = orderMD || orderSM || order;
    else if (isSM) result = orderSM || order;
    else result = order;
    return result;
  }, [orderXL, orderLG, orderMD, orderSM, order, isSM, isMD, isLG, isXL]);
  const spacingNormalize = useMemo(() => {
    let result;
    if (isXL)
      result = spacingXL || spacingLG || spacingMD || spacingSM || spacing;
    else if (isLG) result = spacingLG || spacingMD || spacingSM || spacing;
    else if (isMD) result = spacingMD || spacingSM || spacing;
    else if (isSM) result = spacingSM || spacing;
    else result = spacing;
    return result;
  }, [
    spacing,
    spacingSM,
    spacingMD,
    spacingLG,
    spacingXL,
    isSM,
    isMD,
    isLG,
    isXL,
  ]);
  return (
    <div
      className={`${className}`}
      style={{
        width,
        order: orderNormalize,
        padding: `${spacingNormalize * 4}px`,
      }}
    >
      {children}
    </div>
  );
}
