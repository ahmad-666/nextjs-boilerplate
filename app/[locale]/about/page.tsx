import SectionContainer from "@/app/styled-components/SectionContainer";

type PageProps = {
  params: {
    locale: string;
  };
};

export const metadata = {
  title: "About Page",
  description: "Desc of About",
};

export default async function page({ params: { locale } }: PageProps) {
  return (
    <div>
      <SectionContainer>
        <h1>About</h1>
      </SectionContainer>
    </div>
  );
}
