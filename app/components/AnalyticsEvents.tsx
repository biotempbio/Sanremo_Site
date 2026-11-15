"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
declare global { interface Window { ym?: (...args: unknown[]) => void } }
export function AnalyticsEvents() {
  const pathname = usePathname();
  useEffect(() => {
    const id = Number(process.env.NEXT_PUBLIC_METRIKA_ID); if (location.hostname !== "sanremomachines.ru" || !id) return;
    const goal = (name: string) => window.ym?.(id, "reachGoal", name);
    const click = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const label = link.textContent?.trim().toLocaleLowerCase("ru-RU") ?? "";
      if (href.startsWith("tel:")) goal("phone_click");
      if (href.startsWith("mailto:")) goal("email_click");
      if (link.hasAttribute("download") || /\.(?:pdf|docx?|xlsx?)(?:[?#]|$)/i.test(href)) goal("document_download");
      const dealerLink = href === "/dealers/" || link.matches("[data-dealer-link]") || (pathname === "/dealers/" && /^https?:\/\//.test(href));
      if (dealerLink) goal("dealer_click");
      if (href === "/dealers/" && (link.dataset.analyticsAction === "dealer-buy" || (pathname?.startsWith("/products/") && label === "где купить"))) goal("dealer_buy_click");
      if (href === "/dealers/" && (link.dataset.analyticsAction === "dealer-find" || label === "найти дилера")) goal("dealer_find_click");
    };
    document.addEventListener("click", click);
    let quizSent = false;
    const observer = pathname === "/choose/" ? new MutationObserver(() => {
      if (!quizSent && document.body.textContent?.includes("Основная рекомендация")) { quizSent = true; goal("quiz_done"); }
    }) : null;
    observer?.observe(document.body, { childList: true, subtree: true });
    return () => { document.removeEventListener("click", click); observer?.disconnect(); };
  }, [pathname]);
  return null;
}
