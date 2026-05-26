# @nakamura196/react-ui

中村の個人 React / Next.js アプリ群（dts-viewer / iiif-3d-viewer / next-fb-anno など）で
**デザインを統一し、コンポーネントを再利用する**ための共有 UI パッケージ。

配色・書体は **東京大学 Visual Identity Guidelines (2024-06)** に倣う
（方向性は "Structured" = 青+黄を差し色に、白黒を基調とした知的な配色）。
**ロゴ／シンボルマークは使用しない**（色とフォントのみを参考）。ロゴ素材は広報課への
事前申請が必要なため、本パッケージには含めない。

## 含まれるもの (v1)

| 種別 | 内容 |
|---|---|
| デザイントークン | `styles.css`（UTokyo Blue `#0B8BEE` / Yellow `#FFCD00`、青トーンスケール、light/dark のCSS変数、Noto Serif/Sans JP） |
| `Footer` | 4列フッター（①タイトル+説明 ②③④ 任意のリンク列）+ 著作権表記 |
| `Header` | スティッキーヘッダー（ブランド名 + ナビ + 右スロット） |
| `ThemeToggle` | next-themes によるライト/ダーク切替 |
| `LanguageSwitcher` | 言語切替（presentational・遷移はアプリの `onChange` に委譲） |
| `News` | お知らせ一覧（日付 + 見出し） |

設計方針: **props ベースの presentational コンポーネント**。内部で `next-intl` / `next` に
依存しないため、Next 15/16・next-intl 4.x のバージョン差を吸収できる。翻訳済み文字列や
ロケール対応 `Link` は各アプリが props で渡す。

## 配布・取り込み方（GitHub 参照）

各アプリの `package.json`:

```jsonc
{
  "dependencies": {
    "@nakamura196/react-ui": "github:nakamura196/react-ui#v0.1.0"
  }
}
```

> 開発中はローカル参照（`"file:../../nakamura196/react-ui"` 等）でも可。

### アプリ側のセットアップ（3手順）

1. **Next にソースをトランスパイルさせる**（本パッケージは TSX ソースを直接配布）

   ```ts
   // next.config.ts
   export default {
     transpilePackages: ["@nakamura196/react-ui"],
   };
   ```

2. **トークンCSSを読み込み、Tailwind v4 に DS のソースを走査させる**

   ```css
   /* app/globals.css */
   @import "tailwindcss";
   @import "@nakamura196/react-ui/styles.css";
   /* DS コンポーネント内の Tailwind クラスを検出させる */
   @source "../../node_modules/@nakamura196/react-ui/src";
   ```

3. **Noto フォントを読み込み、トークンを上書き（推奨）**

   ```ts
   // layout.tsx
   import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
   const sans = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto-sans", display: "swap" });
   const serif = Noto_Serif_JP({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-noto-serif", display: "swap" });
   // <html className={`${sans.variable} ${serif.variable}`}>
   ```

   ```css
   /* globals.css で DS のフォント変数を next/font に接続 */
   :root {
     --ds-font-sans: var(--font-noto-sans), "Noto Sans JP", sans-serif;
     --ds-font-serif: var(--font-noto-serif), "Noto Serif JP", serif;
   }
   body { font-family: var(--ds-font-sans); }
   ```

## 使用例

```tsx
import { Footer, Header, ThemeToggle, LanguageSwitcher, News } from "@nakamura196/react-ui";
import { Link, useRouter, usePathname } from "@/i18n/routing"; // next-intl

<Header
  title="DTS Viewer"
  homeHref="/"
  nav={[{ label: "About", href: "/about" }]}
  LinkComponent={Link}
  actions={<>
    <LanguageSwitcher locales={[{code:"ja",label:"日本語"},{code:"en",label:"English"}]} current={locale} onChange={(c)=>router.replace(pathname,{locale:c})} />
    <ThemeToggle />
  </>}
/>

<Footer
  title="DTS Viewer"
  description="DTS API でテキストコレクションを階層的に閲覧する Web アプリ。"
  columns={[
    { heading: "サイト案内", links: [{label:"ホーム",href:"/"},{label:"About",href:"/about"},{label:"プライバシー",href:"/privacy"}] },
    { heading: "機能", links: [{label:"コレクション閲覧",href:"/"},{label:"引用構造ナビ",href:"/"}] },
    { heading: "関連リンク", links: [{label:"DTS 仕様",href:"https://dtsapi.org/",external:true},{label:"GitHub",href:"https://github.com/nakamura196/dts-viewer",external:true}] },
  ]}
  copyright="© 2026 DTS Viewer"
  LinkComponent={Link}
/>
```

## 静的サイト(素の HTML)で使う

React/Next.js を使わないページ(GitHub Pages の `docs/index.html` 等)向けに、
`src/styles/static.css` と `src/snippets/*.html` を同梱している。jsDelivr 経由で
`<link>` 1 本読み込めば、トークン・Noto フォント・Header/Footer/Button/Input/Card・
DataTables テーマが全て使える。React 版コンポーネントと同じ見た目になる。

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/nakamura196/react-ui@v0.4.0/src/styles/static.css">
  </head>
  <body>
    <header class="ds-header">
      <div class="ds-header__inner">
        <a class="ds-header__brand" href="/">SITE TITLE</a>
        <nav class="ds-header__nav">
          <a class="ds-header__nav-link" href="/about">About</a>
        </nav>
      </div>
    </header>

    <main class="ds-container ds-section">
      <h1 class="ds-h1">タイトル</h1>
      <button class="ds-btn">Load</button>
    </main>

    <footer class="ds-footer"> ... </footer>
  </body>
</html>
```

スニペット雛形は `src/snippets/header.html` / `footer.html` / `page-shell.html`。
カラーモードは `<html class="dark">` で強制ダーク、`<html class="light">` で強制ライト、
何も付けなければ `prefers-color-scheme` に追従する。

提供している CSS クラス:

| 用途 | クラス |
|---|---|
| レイアウト | `.ds-container` `.ds-section` `.ds-stack` |
| 見出し | `.ds-h1` `.ds-h2` `.ds-lead` |
| ヘッダー | `.ds-header` `.ds-header__inner` `.ds-header__brand` `.ds-header__nav` `.ds-header__nav-link` `.ds-header__actions` |
| フッター | `.ds-footer` `.ds-footer__inner` `.ds-footer__grid` `.ds-footer__col` `.ds-footer__brand` `.ds-footer__brand-desc` `.ds-footer__heading` `.ds-footer__list` `.ds-footer__link` `.ds-footer__copyright` |
| フォーム | `.ds-field` `.ds-label` `.ds-input` `.ds-btn` (+ `--secondary` `--sm` `--lg`) |
| カード | `.ds-card` `.ds-card__title` |
| テーブル | `.ds-table-wrap`(内側に jQuery DataTables を置くと自動でテーマ適用) |

## リリース手順（メンテナ）

1. 変更をコミット
2. `git tag v0.x.y && git push --tags`
3. 各アプリの `package.json` を `#v0.x.y` に上げて `npm update @nakamura196/react-ui`

## ライセンス

MIT（本パッケージのコード）。配色・書体の指針は東京大学 Visual Identity Guidelines に基づく。
UTokyo のロゴ・シンボルマーク等の素材は含まない（使用には広報課への事前申請が必要）。
