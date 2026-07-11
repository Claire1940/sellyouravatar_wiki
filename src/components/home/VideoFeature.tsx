"use client";

import { useEffect, useRef, useState } from "react";
import { Play, ExternalLink } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

/**
 * 视频区域组件
 *
 * 自动播放策略：
 * - 默认只渲染缩略图 + 播放按钮（节省流量，避免首屏 iframe）
 * - IntersectionObserver 监测视频进入视口（threshold 0.4）时自动加载 iframe
 *   并以 autoplay=1&mute=1&loop=1&playlist=<id> 静音循环播放
 * - 点击播放按钮作为后备（同时用于 prefers-reduced-motion 场景）
 * - 缩略图 maxresdefault 加载失败时回退到 hqdefault
 */
export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [useHqThumb, setUseHqThumb] = useState(false);

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  // loop=1 对单视频必须带 playlist=<同一 videoId> 才会循环
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playsinline=1&rel=0&playlist=${videoId}`;
  const thumbBase = useHqThumb ? "hqdefault" : "maxresdefault";
  const thumbUrl = `https://i.ytimg.com/vi/${videoId}/${thumbBase}.jpg`;

  useEffect(() => {
    if (active) return;

    const node = containerRef.current;
    if (!node) return;

    // 尊重用户的减少动画偏好：不自动播放，仅保留手动点击
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black/40"
        style={{ paddingBottom: "56.25%" }}
      >
        {active ? (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute top-0 left-0 h-full w-full"
          >
            {/* 缩略图 */}
            <img
              src={thumbUrl}
              alt={title}
              loading="lazy"
              onError={() => setUseHqThumb(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {/* 半透明遮罩 */}
            <span
              className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/20"
              aria-hidden="true"
            />
            {/* 播放按钮 */}
            <span
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full
                         bg-[hsl(var(--nav-theme)/0.95)] text-white shadow-lg ring-4 ring-white/30
                         transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            >
              <Play className="h-7 w-7 fill-white" />
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
