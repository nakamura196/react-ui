import * as React from "react";

export interface SectionHeadingProps {
  children: React.ReactNode;
  /** 左の UTokyo Blue アクセントバーを表示（既定 true） */
  accent?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/** セリフ見出し + 左アクセントバーの共通見出し（News/各セクションで再利用）。 */
export function SectionHeading({
  children,
  accent = true,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div className={`mb-6 flex items-center gap-3 ${className ?? ""}`}>
      {accent ? (
        <span
          className="h-6 w-1 shrink-0 rounded bg-[var(--ds-primary)]"
          aria-hidden="true"
        />
      ) : null}
      <Tag
        className="text-2xl font-semibold text-[var(--ds-fg)] sm:text-3xl"
        style={{ fontFamily: "var(--ds-font-serif)" }}
      >
        {children}
      </Tag>
    </div>
  );
}
