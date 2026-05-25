import * as React from "react";
import type { LinkLike } from "./types";
import { SectionHeading } from "./SectionHeading";

export interface NewsItem {
  /** 表示用の日付文字列（例 "2026-05-25"）。整形済みを渡す。 */
  date: string;
  title: string;
  href?: string;
  external?: boolean;
}

export interface NewsProps {
  heading: string;
  items: NewsItem[];
  emptyText?: string;
  LinkComponent?: LinkLike;
  className?: string;
}

/** お知らせ（News）セクション。日付 + 見出しの一覧を表示。 */
export function News({
  heading,
  items,
  emptyText = "—",
  LinkComponent,
  className,
}: NewsProps) {
  return (
    <section className={`container mx-auto px-4 py-12 ${className ?? ""}`}>
      <SectionHeading>{heading}</SectionHeading>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--ds-fg-muted)]">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-[var(--ds-border)] border-y border-[var(--ds-border)]">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <time className="shrink-0 text-sm tabular-nums text-[var(--ds-fg-muted)]">
                {item.date}
              </time>
              <span className="text-[var(--ds-fg)]">
                {renderTitle(item, LinkComponent)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function renderTitle(item: NewsItem, LinkComponent?: LinkLike) {
  if (!item.href) return item.title;
  const cls = "text-[var(--ds-primary)] hover:underline";
  if (item.external || !LinkComponent) {
    return (
      <a
        href={item.href}
        className={cls}
        {...(item.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {item.title}
      </a>
    );
  }
  return (
    <LinkComponent href={item.href} className={cls}>
      {item.title}
    </LinkComponent>
  );
}
