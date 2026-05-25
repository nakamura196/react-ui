import * as React from "react";

export interface VideoEmbedProps {
  /** YouTube の動画ID */
  videoId: string;
  title?: string;
  className?: string;
}

/** YouTube(nocookie)埋め込み。16:9・lazy・プライバシー強化。各アプリの紹介動画で再利用。 */
export function VideoEmbed({ videoId, title = "Video", className }: VideoEmbedProps) {
  return (
    <div
      className={`mx-auto max-w-4xl overflow-hidden rounded-xl border border-[var(--ds-border)] bg-black shadow-md ${className ?? ""}`}
    >
      <iframe
        key={videoId}
        className="aspect-video w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
