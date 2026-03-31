'use client';

import React, { useState, useEffect, useRef } from "react";
import { Zap, ExternalLink, RefreshCw, Newspaper } from "lucide-react";
import { useGetNewsQuery } from "@/store/api/appApi";

interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate?: string;
}

interface NewsTickerProps {
  // Currently no props needed
}

const NewsTicker: React.FC<NewsTickerProps> = () => {
  const [paused, setPaused] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    data: news = [],
    isLoading: loading,
    isError: error,
    refetch,
  } = useGetNewsQuery(undefined, {
    pollingInterval: 6 * 60 * 60 * 1000,
  });

  // Auto-scroll effect
  useEffect(() => {
    if (!scrollRef.current || news.length === 0 || paused) return;

    const el = scrollRef.current;
    let animId: number;
    let lastTime = 0;
    const speed = 0.5; // pixels per frame (~30px/sec)

    const scroll = (timestamp: number): void => {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (delta < 100) { // skip large jumps (tab switch)
        el.scrollTop += speed;
      }

      // Loop back to top when reaching end
      if (el.scrollTop >= el.scrollHeight - el.clientHeight - 1) {
        el.scrollTop = 0;
      }

      animId = requestAnimationFrame(scroll);
    };

    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [news, paused]);

  const timeAgo = (dateStr?: string): string => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-5 shadow-sm h-[260px]">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper size={16} className="text-blue-500" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Tech & Jobs News</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full mb-1.5" />
              <div className="h-2.5 bg-gray-50 dark:bg-gray-900 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || news.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-5 shadow-sm h-[260px]">
        <div className="flex items-center gap-2 mb-3">
          <Newspaper size={16} className="text-blue-500" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Tech & Jobs News</h3>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">Unable to load news. Make sure the server is running.</p>
        <button
          onClick={refetch}
          className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 font-medium"
        >
          <RefreshCw size={12} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-5 shadow-sm h-[260px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-50 dark:bg-blue-950/50 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Live Tech & Jobs News</h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">Auto-updates every 6 hours</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-green-500 font-medium">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Live
        </span>
      </div>

      {/* Auto-scrolling news list */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="flex-1 overflow-hidden relative"
      >
        {news.map((item: NewsItem, i: number) => (
          <a
            key={`${item.link}-${i}`}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0 group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 px-1 rounded transition-colors"
          >
            <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] text-blue-500 font-medium">{item.source}</span>
                {item.pubDate && (
                  <>
                    <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">{timeAgo(item.pubDate)}</span>
                  </>
                )}
              </div>
            </div>
            <ExternalLink size={10} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-400 mt-1 flex-shrink-0 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
