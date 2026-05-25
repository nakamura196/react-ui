import * as React from "react";
import type { LinkLike } from "./types";

export interface FooterLink {
  label: string;
  /** 省略時はリンクではなく単なるテキスト項目として描画（機能一覧など）。 */
  href?: string;
  /** 外部リンクは新規タブ + plain <a>。内部は LinkComponent があればそれで描画。 */
  external?: boolean;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export interface FooterProps {
  /** 1列目: サイト名 */
  title: string;
  /** 1列目: 説明文 */
  description?: string;
  /** 2〜4列目: 見出し + リンク群（最大3列） */
  columns?: FooterColumn[];
  /** 最下部の著作権表記 */
  copyright?: string;
  /** ロケール対応の内部リンクコンポーネント（next-intl の Link 等） */
  LinkComponent?: LinkLike;
  className?: string;
}

const linkCls =
  "text-[var(--ds-fg-muted)] hover:text-[var(--ds-primary)] transition-colors";

// グリッド列数 = タイトル列(1) + リンク列数。リンク列が少ないときに
// 4列固定だと右端が空いて左寄りに見えるため、列数に合わせて均等配置する。
const mdColsClass: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

/** UTokyo VI(Structured)に倣った最大4列フッター。色/書体は tokens.css のCSS変数を参照。
 *  リンク列数に応じてグリッドを 2〜4 列に動的調整し、横幅いっぱいに均等配置する。 */
export function Footer({
  title,
  description,
  columns = [],
  copyright,
  LinkComponent,
  className,
}: FooterProps) {
  const visibleColumns = columns.slice(0, 3);
  const gridColsClass = mdColsClass[1 + visibleColumns.length] ?? "md:grid-cols-4";
  const renderLink = (link: FooterLink, key: React.Key) => {
    if (!link.href) {
      return (
        <span key={key} className="text-[var(--ds-fg-muted)]">
          {link.label}
        </span>
      );
    }
    if (link.external || !LinkComponent) {
      return (
        <a
          key={key}
          href={link.href}
          className={linkCls}
          {...(link.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {link.label}
        </a>
      );
    }
    return (
      <LinkComponent key={key} href={link.href} className={linkCls}>
        {link.label}
      </LinkComponent>
    );
  };

  return (
    <footer
      className={`border-t-2 border-[var(--ds-primary)] bg-[var(--ds-surface)] text-[var(--ds-fg)] ${className ?? ""}`}
    >
      <div className="container mx-auto px-4 py-12">
        <div className={`grid grid-cols-1 gap-8 ${gridColsClass}`}>
          {/* 1列目: タイトル + 説明 */}
          <div className="md:pr-6">
            <p
              className="text-lg font-semibold text-[var(--ds-fg)]"
              style={{ fontFamily: "var(--ds-font-serif)" }}
            >
              {title}
            </p>
            {description ? (
              <p className="mt-3 text-sm leading-relaxed text-[var(--ds-fg-muted)]">
                {description}
              </p>
            ) : null}
          </div>

          {/* 2〜4列目: 任意のリンク列 */}
          {visibleColumns.map((col, i) => (
            <div key={i}>
              <h2 className="text-sm font-semibold tracking-wide text-[var(--ds-fg)]">
                {col.heading}
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((link, j) => (
                  <li key={j}>{renderLink(link, j)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {copyright ? (
          <div className="mt-10 border-t border-[var(--ds-border)] pt-6 text-center text-sm text-[var(--ds-fg-muted)]">
            {copyright}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
