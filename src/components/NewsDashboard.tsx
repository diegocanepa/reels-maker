"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    RefreshCw,
    Wifi,
    WifiOff,
    ExternalLink,
    Calendar,
    Globe,
    Newspaper,
} from "lucide-react";
import type { NewsArticle, NewsResponse } from "@/app/api/news/top/route";

const AUTO_REFRESH_MS = 15 * 60 * 1000; // 15 minutes

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
    try {
        return new Date(dateString).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return dateString;
    }
}

function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + "…";
}

// ─── Countdown Bar ────────────────────────────────────────────────────────────

function CountdownBar({ lastFetched }: { lastFetched: Date | null }) {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!lastFetched) return;
        const interval = setInterval(() => {
            const elapsed = Date.now() - lastFetched.getTime();
            const remaining = Math.max(0, 100 - (elapsed / AUTO_REFRESH_MS) * 100);
            setProgress(remaining);
        }, 1000);
        return () => clearInterval(interval);
    }, [lastFetched]);

    return (
        <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function NewsSkeleton() {
    return (
        <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="rounded-2xl border border-white/5 bg-white/3 backdrop-blur-sm p-5"
                >
                    <div className="flex gap-4">
                        {/* Thumbnail placeholder */}
                        <div className="w-20 h-20 rounded-xl bg-white/10 shrink-0 hidden sm:block" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/10 rounded w-3/4" />
                            <div className="h-3 bg-white/5 rounded w-full" />
                            <div className="h-3 bg-white/5 rounded w-5/6" />
                            <div className="flex gap-3 mt-2">
                                <div className="h-3 w-16 bg-white/5 rounded" />
                                <div className="h-3 w-24 bg-white/5 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── News Card ────────────────────────────────────────────────────────────────

function NewsCard({
    article,
    index,
}: {
    article: NewsArticle;
    index: number;
}) {
    const summary = article.summary ?? truncate(article.text, 140);

    return (
        <motion.a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="group flex gap-4 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] hover:border-amber-500/20 backdrop-blur-sm p-4 transition-all duration-200 cursor-pointer"
            style={{
                boxShadow: "0 0 0 0 rgba(251,146,60,0)",
            }}
            whileHover={{
                boxShadow: "0 0 24px rgba(251,146,60,0.06)",
            }}
        >
            {/* Thumbnail */}
            {article.image && (
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 hidden sm:block bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />
                </div>
            )}
            {!article.image && (
                <div className="w-20 h-20 rounded-xl shrink-0 hidden sm:flex items-center justify-center bg-amber-500/10 border border-amber-500/15">
                    <Newspaper className="w-6 h-6 text-amber-500/60" />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Index + Title */}
                <div className="flex items-start gap-2 mb-1">
                    <span className="text-[10px] font-bold text-amber-500/60 font-mono mt-0.5 shrink-0 w-5">
                        #{index + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors duration-200 leading-snug line-clamp-2">
                        {article.title}
                    </h3>
                </div>

                {/* Summary */}
                {summary && (
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-2 ml-7">
                        {summary}
                    </p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-3 ml-7 flex-wrap">
                    {article.source_country && (
                        <span className="flex items-center gap-1 text-[10px] text-zinc-600 font-medium uppercase tracking-wider">
                            <Globe className="w-2.5 h-2.5" />
                            {article.source_country}
                        </span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] text-zinc-600 font-mono">
                        <Calendar className="w-2.5 h-2.5" />
                        {formatDate(article.publish_date)}
                    </span>
                    {article.author && (
                        <span className="text-[10px] text-zinc-600 truncate max-w-[120px]">
                            {article.author}
                        </span>
                    )}
                    <ExternalLink className="w-2.5 h-2.5 text-zinc-700 group-hover:text-amber-500/60 transition-colors ml-auto shrink-0" />
                </div>
            </div>
        </motion.a>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function NewsDashboard() {
    const [data, setData] = useState<NewsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastFetched, setLastFetched] = useState<Date | null>(null);

    const fetchNews = useCallback(
        async (manual = false) => {
            if (manual) setIsRefreshing(true);
            else if (!data) setIsLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/news/top");
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error ?? "Failed to fetch news");
                }
                const json: NewsResponse = await response.json();
                setData(json);
                setLastFetched(new Date());
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error occurred");
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [data]
    );

    // Initial fetch
    useEffect(() => {
        fetchNews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-refresh every 15 minutes
    useEffect(() => {
        const interval = setInterval(() => fetchNews(), AUTO_REFRESH_MS);
        return () => clearInterval(interval);
    }, [fetchNews]);

    return (
        <div className="w-full">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xs font-bold text-zinc-400 tracking-widest uppercase">
                        Top World News · Live
                    </h2>
                    {lastFetched && (
                        <p className="text-[10px] text-zinc-600 mt-0.5 font-mono">
                            Updated {lastFetched.toLocaleTimeString()}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Connection status */}
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                        {error ? (
                            <WifiOff className="w-3 h-3 text-red-500" />
                        ) : (
                            <Wifi className="w-3 h-3 text-emerald-500" />
                        )}
                    </div>

                    {/* Refresh button */}
                    <button
                        onClick={() => fetchNews(true)}
                        disabled={isRefreshing || isLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 text-zinc-400 hover:text-white transition-all duration-200 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Refresh news"
                    >
                        <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
                        {isRefreshing ? "Updating…" : "Refresh"}
                    </button>
                </div>
            </div>

            {/* Countdown progress bar */}
            <div className="mb-4">
                <CountdownBar lastFetched={lastFetched} />
            </div>

            {/* Error state */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mb-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                    >
                        <WifiOff className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading skeleton */}
            {isLoading ? (
                <NewsSkeleton />
            ) : data && data.articles.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                >
                    {/* Header stats */}
                    <div className="flex items-center gap-2 mb-2">
                        <Newspaper className="w-3.5 h-3.5 text-amber-500/70" />
                        <p className="text-[10px] text-zinc-600 font-medium">
                            Showing {data.articles.length} top stories
                        </p>
                    </div>

                    {/* Articles */}
                    {data.articles.map((article, i) => (
                        <NewsCard key={article.id} article={article} index={i} />
                    ))}
                </motion.div>
            ) : !error ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <Newspaper className="w-10 h-10 text-zinc-700 mb-3" />
                    <p className="text-zinc-500 text-sm">No news articles available</p>
                    <p className="text-zinc-600 text-xs mt-1">
                        Check your WORLD_NEWS_API_KEY configuration
                    </p>
                </motion.div>
            ) : null}
        </div>
    );
}
