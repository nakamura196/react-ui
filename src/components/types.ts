import type * as React from "react";

/**
 * アプリ側のロケール対応リンク（next-intl の `Link` 等）を受け取るための型。
 * DS は next/next-intl に依存せず、内部リンクの描画だけ委譲する。
 */
export type LinkLike = React.ComponentType<{
  href: string;
  className?: string;
  children: React.ReactNode;
}>;
