"use client";
import { usePathname } from "next/navigation";
export function Canonical({ siteUrl }: { siteUrl: string }) {
  const pathname = usePathname();
  const path = pathname === "/" ? "/" : `${pathname.replace(/\/$/, "")}/`;
  return <link rel="canonical" href={new URL(path, siteUrl).toString()} />;
}
