"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next-intl/client";
import { useTranslations } from "next-intl";
import useTheme from "../library/hooks/useTheme";

export default function TestComp() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const t = useTranslations();
  return (
    <div>
      <button
        onClick={() => setTheme((old) => (old === "light" ? "dark" : "light"))}
      >
        toggle theme
      </button>
      <button onClick={() => router.push("/", { locale: "en" })}>
        en locale
      </button>
      <button onClick={() => router.push("/", { locale: "fa" })}>
        fa locale
      </button>

      <div className="mx-auto mt-16 flex h-[300px] w-[300px] items-center justify-center rounded-sm bg-card-main text-h3 font-bold text-text-main">
        {t("text")}
      </div>
    </div>
  );
}
