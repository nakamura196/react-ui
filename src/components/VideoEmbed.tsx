"use client";
import * as React from "react";

export interface VideoEmbedProps {
  /** YouTube の動画ID */
  videoId: string;
  title?: string;
  className?: string;
  /** 字幕(CC)をデフォルトで表示する。新しい embed プレイヤーでは
   * `cc_load_policy=1` クエリだけだと無視されるケースがあるため、`captions` が true の場合は
   * IFrame Player API を読み込み `setOption('captions', 'track', ...)` を呼んで強制的に有効化する。 */
  captions?: boolean;
  /** 字幕の優先言語 (例: "ja", "en")。 `captions` と併用する。
   * IFrame API 側では `setOption('captions', 'track', {languageCode})` に渡される。 */
  ccLangPref?: string;
  /** プレイヤー UI 言語 (`hl=...`)。例: "ja", "en"。 */
  hl?: string;
  /** 追加の YouTube embed クエリパラメータ。上記オプションと衝突した場合はこちらが優先。 */
  params?: Record<string, string | number | boolean>;
}

declare global {
  // eslint-disable-next-line no-var
  var YT: { Player: new (el: Element | string, opts: unknown) => YtPlayer } | undefined;
  interface Window {
    YT?: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
    __reactUiYtApiCallbacks?: Array<() => void>;
  }
}

interface YtPlayer {
  loadModule(name: string): void;
  setOption(module: string, option: string, value: unknown): void;
  destroy(): void;
}

const API_SRC = "https://www.youtube.com/iframe_api";

function loadYouTubeApi(): Promise<NonNullable<typeof YT>> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("SSR"));
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    window.__reactUiYtApiCallbacks ??= [];
    window.__reactUiYtApiCallbacks.push(() => {
      if (window.YT) resolve(window.YT);
    });
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevCallback?.();
      const cbs = window.__reactUiYtApiCallbacks ?? [];
      window.__reactUiYtApiCallbacks = [];
      cbs.forEach((cb) => cb());
    };
    if (!document.querySelector(`script[src="${API_SRC}"]`)) {
      const tag = document.createElement("script");
      tag.src = API_SRC;
      tag.async = true;
      document.head.appendChild(tag);
    }
  });
}

function buildSrc(
  videoId: string,
  opts: Omit<VideoEmbedProps, "videoId" | "title" | "className">,
  withJsApi: boolean,
): string {
  const qs = new URLSearchParams();
  if (opts.captions) qs.set("cc_load_policy", "1");
  if (opts.ccLangPref) qs.set("cc_lang_pref", opts.ccLangPref);
  if (opts.hl) qs.set("hl", opts.hl);
  if (withJsApi) qs.set("enablejsapi", "1");
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
  const needsApi = !!captions;
  const src = buildSrc(videoId, { captions, ccLangPref, hl, params }, needsApi);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const playerRef = React.useRef<YtPlayer | null>(null);

  React.useEffect(() => {
    if (!needsApi) return;
    const iframe = iframeRef.current;
    if (!iframe) return;
    let cancelled = false;

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !iframeRef.current) return;
        playerRef.current = new YT.Player(iframeRef.current, {
          events: {
            onReady: (e: { target: YtPlayer }) => {
              try {
                // loadModule のスペリングは "captions" / "cc" 両方ありうるので両方叩く
                e.target.loadModule("captions");
                e.target.loadModule("cc");
                if (ccLangPref) {
                  e.target.setOption("captions", "track", { languageCode: ccLangPref });
                  e.target.setOption("cc", "track", { languageCode: ccLangPref });
                } else {
                  e.target.setOption("captions", "reload", true);
                }
              } catch {
                // 失敗しても致命傷ではない (字幕ボタンから手動で出せる)
              }
            },
          },
        });
      })
      .catch(() => {
        /* SSR / no window — skip */
      });

    return () => {
      cancelled = true;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          /* ignore */
        }
        playerRef.current = null;
      }
    };
  }, [needsApi, ccLangPref, videoId]);

  return (
    <div
      className={`mx-auto max-w-4xl overflow-hidden rounded-xl border border-[var(--ds-border)] bg-black shadow-md ${className ?? ""}`}
    >
      <iframe
        ref={iframeRef}
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
