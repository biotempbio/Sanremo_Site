import type { ReactNode } from "react";

export function ActionArrow() {
  return <svg className="action-arrow-icon" width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true" focusable="false">
    <path d="M1 8h17m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>;
}

export function CardAction({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`card-action${className ? ` ${className}` : ""}`}>{children}<ActionArrow /></span>;
}
