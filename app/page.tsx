import SectionContainer from "@/app/styled-components/SectionContainer";
import TestComp from "@/app/components/TestComp";

//we can use bellow params on layout,pages,route-handlers
export const dynamic = "force-dynamic"; //'auto' | 'force-dynamic'(SSR) | 'error' | 'force-static'(SSG)
//export const revalidate = false //false | 'force-cache' | 0 | number(in seconds,ISR)
export default async function Page({}) {
  return (
    <div>
      <SectionContainer>
        <TestComp />
      </SectionContainer>
    </div>
  );
}
