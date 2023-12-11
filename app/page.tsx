import SectionContainer from "@/app/styled-components/SectionContainer";
import TestComp from "@/app/components/TestComp";

type PageProps = {
  params: {
    locale: string;
  };
};

export default async function Page({ params: { locale } }: PageProps) {
  return (
    <div>
      <SectionContainer>
        <TestComp />
      </SectionContainer>
    </div>
  );
}
