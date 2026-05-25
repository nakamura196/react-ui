"use client";

import * as React from "react";

export interface LocaleOption {
  code: string;
  label: string;
}

export interface LanguageSwitcherProps {
  locales: LocaleOption[];
  current: string;
  /** 選択時に呼ばれる。アプリ側で next-intl のルーター遷移などを行う。 */
  onChange: (code: string) => void;
  label?: string;
  className?: string;
}

/** 言語切替（presentational）。ルーティングはアプリの onChange に委譲。 */
export function LanguageSwitcher({
  locales,
  current,
  onChange,
  label = "Language",
  className,
}: LanguageSwitcherProps) {
  return (
    <span className={`relative inline-flex items-center ${className ?? ""}`}>
      <GlobeIcon className="pointer-events-none absolute left-2 h-4 w-4 text-[var(--ds-fg-muted)]" />
      <select
        aria-label={label}
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-md border border-[var(--ds-border)] bg-[var(--ds-bg)] py-1 pl-7 pr-7 text-sm text-[var(--ds-fg)] transition-colors hover:border-[var(--ds-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-ring)]"
      >
        {locales.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2 h-4 w-4 text-[var(--ds-fg-muted)]" />
    </span>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
