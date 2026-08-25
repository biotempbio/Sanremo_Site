"use client";

import type { FormEvent, ReactNode } from "react";

export default function MailtoForm({ subject, children, className, style }: { subject: string; children: ReactNode; className?: string; style?: React.CSSProperties }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = Array.from(data.entries())
      .filter(([, value]) => typeof value === "string" && value.trim())
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    window.location.href = `mailto:info@sanremomachines.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return <form className={className} style={style} onSubmit={submit}>{children}</form>;
}
