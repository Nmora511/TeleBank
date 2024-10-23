"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "phosphor-react";

export default function BackArrow() {
  const router = useRouter();

  return (
    <ArrowLeft
      className="text-[var(--foreground)] hover:[var(--secondary-foreground)] cursor-pointer text-4xl"
      weight="bold"
      onClick={() => router.back()}
    />
  );
}
