import * as React from "react";
import ReactMarkdown from "react-markdown";

/**
 * prose + UTokyo トークンの共通クラス。about/privacy/help 等のドキュメントページを統一スタイルに。
 * 利用側は globals.css に `@plugin "@tailwindcss/typography";` が必要（Tailwind v4 はconfigレス）。
 */
export const proseClass =
  "prose prose-lg max-w-none " +
  "prose-headings:text-[var(--ds-fg)] prose-headings:[font-family:var(--ds-font-serif)] " +
  "prose-p:text-[var(--ds-fg-muted)] prose-li:text-[var(--ds-fg-muted)] " +
  "prose-a:text-[var(--ds-primary)] prose-strong:text-[var(--ds-fg)]";

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <article className={`${proseClass} ${className ?? ""}`.trim()}>{children}</article>;
}

export interface MarkdownContentProps {
  /** Markdown 文字列（ビルド時に各アプリが content/*.md を読み込んで渡す） */
  content: string;
  className?: string;
}

/** Markdown をUTokyoトークンの prose で描画。外部リンクは新規タブ。 */
export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <Prose className={className}>
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
            const external = !!href && /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Prose>
  );
}
