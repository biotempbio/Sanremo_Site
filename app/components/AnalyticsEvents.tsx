"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
declare global { interface Window { ym?: (...args: unknown[]) => void } }
export function AnalyticsEvents() {
  const pathname = usePathname();
  useEffect(() => {
    const id = Number(process.env.NEXT_PUBLIC_METRIKA_ID); if (!id || !window.ym) return;
    const sent = new Set<string>(); const goal = (name: string) => { if (!sent.has(name)) { sent.add(name); window.ym?.(id, "reachGoal", name); } };
    const click = (event: MouseEvent) => { const link = (event.target as Element | null)?.closest("a"); if (!link) return; const href = link.getAttribute("href") || ""; if (href.startsWith("tel:")) goal("phone_click"); if (link.matches("[data-dealer-link]") || (pathname === "/dealers/" && /^https?:\/\//.test(href))) goal("dealer_click"); };
    document.addEventListener("click", click);
    const observer = pathname === "/choose/" ? new MutationObserver(() => { if (document.body.textContent?.includes("Основная рекомендация")) goal("quiz_done"); }) : null;
    observer?.observe(document.body, { childList: true, subtree: true });
    return () => { document.removeEventListener("click", click); observer?.disconnect(); };
  }, [pathname]);
  return null;
}
