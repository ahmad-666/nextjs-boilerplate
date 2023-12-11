"use client";

import LocaleProvider from "@/app/library/context/Locale";
import ThemeProvider from "@/app/library/context/Theme";

type LibraryProviderProps = {
  children: React.ReactNode;
};

const LibraryProvider = ({ children }: LibraryProviderProps) => {
  return (
    // <LocaleProvider>
    <ThemeProvider>{children}</ThemeProvider>
    // </LocaleProvider>
  );
};
export default LibraryProvider;
