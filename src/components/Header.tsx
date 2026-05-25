import * as React from "react";
import type { LinkLike } from "./types";

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface HeaderProps {
  /** サイト名（左上ブランド） */
  title: string;
  /** ブランドのリンク先（既定 "/"） */
  homeHref?: string;
  nav?: NavLink[];
  /** 右側スロット（ThemeToggle / LanguageSwitcher 等） */
  actions?: React.ReactNode;
  LinkComponent?: LinkLike;
  className?: string;
}

const navCls =
  "text-sm text-[var(--ds-fg-muted)] hover:text-[var(--ds-primary)] transition-colors";

/** UTokyo VI に倣った共通ヘッダー。ブランド名はセリフ・UTokyo Blue。 */
export function Header({
  title,
  homeHref = "/",
  nav = [],
  actions,
  LinkComponent,
  className,
}: HeaderProps) {
  const brandCls = "text-lg font-semibold text-[var(--ds-primary)]";
  const brandInner = (
    <span style={{ fontFamily: "var(--ds-font-serif)" }}>{title}</span>
  );

  return (
    <header
      className={`sticky top-0 z-40 border-b border-[var(--ds-border)] bg-[var(--ds-bg)] ${className ?? ""}`}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {LinkComponent ? (
          <LinkComponent href={homeHref} className={brandCls}>
            {brandInner}
          </LinkComponent>
        ) : (
          <a href={homeHref} className={brandCls}>
            {brandInner}
          </a>
        )}

        <div className="flex items-center gap-5">
          {nav.length > 0 ? (
            <nav className="hidden items-center gap-5 sm:flex">
              {nav.map((item, i) =>
                item.external || !LinkComponent ? (
                  <a
                    key={i}
                    href={item.href}
                    className={navCls}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {item.label}
                  </a>
                ) : (
                  <LinkComponent key={i} href={item.href} className={navCls}>
                    {item.label}
                  </LinkComponent>
                ),
              )}
            </nav>
          ) : null}
          {actions}
        </div>
      </div>
    </header>
  );
}
