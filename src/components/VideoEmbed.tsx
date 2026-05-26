import * as React from "react";

export interface VideoEmbedProps {
  /** YouTube の動画ID */
  videoId: string;
  title?: string;
  className?: string;
  /** 字幕(CC)をデフォルトで表示する (`cc_load_policy=1`)。動画側に字幕が登録されている必要がある。 */
  captions?: boolean;
  /** 字幕の優先言語 (`cc_lang_pref=...`)。例: "ja", "en"。`captions` と併用する。 */
  ccLangPref?: string;
  /** プレイヤー UI 言語 (`hl=...`)。例: "ja", "en"。 */
  hl?: string;
  /** 追加の YouTube embed クエリパラメータ。上記オプションと衝突した場合はこちらが優先。 */
  params?: Record<string, string | number | boolean>;
}

function buildSrc(
  videoId: string,
  opts: Omit<VideoEmbedProps, "videoId" | "title" | "className">,
): string {
  const qs = new URLSearchParams();
  if (opts.captions) qs.set("cc_load_policy", "1");
  if (opts.ccLangPref) qs.set("cc_lang_pref", opts.ccLangPref);
  if (opts.hl) qs.set("hl", opts.hl);
  if (opts.params) {
    for (const [k, v] of Object.entries(opts.params)) {
      qs.set(k, String(v));
    }
  }
  const query = qs.toString();
  const base = `https://www.youtube-nocookie.com/embed/${videoId}`;
  return query ? `${base}?${query}` : base;
}

/** YouTube(nocookie)埋め込み。16:9・lazy・プライバシー強化。各アプリの紹介動画で再利用。 */
export function VideoEmbed({
  videoId,
  title = "Video",
  className,
  captions,
  ccLangPref,
  hl,
  params,
}: VideoEmbedProps) {
  const src = buildSrc(videoId, { captions, ccLangPref, hl, params });
  return (
    <div
      className={`mx-auto max-w-4xl overflow-hidden rounded-xl border border-[var(--ds-border)] bg-black shadow-md ${className ?? ""}`}
    >
      <iframe
        key={src}
        className="aspect-video w-full"
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
