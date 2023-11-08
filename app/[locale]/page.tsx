import SectionContainer from "@/app/styled-components/SectionContainer";
import TestComp from "@/app/components/TestComp";
import { createTranslator } from "next-intl";
import type { Metadata } from "next";

type PageProps = {
  params: {
    locale: string;
  };
};

export const generateMetadata = async ({
  params: { locale },
}: PageProps): Promise<Metadata> => {
  const translations = (await import(`@/app/translations/${locale}.json`))
    .default;
  const t = await createTranslator({ locale, messages: translations });
  return {
    title: t("title"),
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
