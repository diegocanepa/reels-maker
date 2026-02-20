"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, TrendingUp, TrendingDown, Wifi, WifiOff } from "lucide-react";
import type { CryptoPricesResponse, CryptoData } from "@/app/api/crypto/prices/route";

const CRYPTO_CONFIG: Record<string, { color: string; gradient: string; bgGlow: string; icon: string }> = {
    BTC: {
        color: "#F7931A",
        gradient: "from-orange-500/20 to-yellow-500/10",
        bgGlow: "rgba(247, 147, 26, 0.15)",
        icon: "₿",
    },
    ETH: {
        color: "#627EEA",
        gradient: "from-indigo-500/20 to-blue-500/10",
        bgGlow: "rgba(98, 126, 234, 0.15)",
        icon: "Ξ",
    },
    ADA: {
        color: "#0033AD",
        gradient: "from-blue-600/20 to-cyan-500/10",
        bgGlow: "rgba(0, 51, 173, 0.15)",
        icon: "₳",
    },
};

const AUTO_REFRESH_MS = 2 * 60 * 1000; // 2 minutes

function formatPrice(price: number): string {
    if (price >= 1000) {
        return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 4 });
}

function formatMarketCap(value: number): string {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
}

function formatVolume(value: number): string {
    return formatMarketCap(value);
}

function SkeletonCard() {
    return (
        <div className="relative rounded-2xl border border-white/5 bg-white/3 backdrop-blur-sm overflow-hidden p-6 animate-pulse">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/10" />
                    <div className="space-y-2">
                        <div className="h-4 w-16 rounded bg-white/10" />
                        <div className="h-3 w-10 rounded bg-white/5" />
                    </div>
                </div>
                <div className="h-6 w-16 rounded-full bg-white/10" />
            </div>
            <div className="space-y-3">
                <div className="h-8 w-32 rounded bg-white/10" />
                <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 rounded-xl bg-white/5" />
                    <div className="h-12 rounded-xl bg-white/5" />
                </div>
            </div>
        </div>
    );
}

function CryptoCard({ symbol, data }: { symbol: string; data: CryptoData }) {
    const config = CRYPTO_CONFIG[symbol] ?? {
        color: "#ffffff",
        gradient: "from-white/10 to-white/5",
        bgGlow: "rgba(255,255,255,0.1)",
        icon: symbol[0],
    };

    const usd = data.quote.USD;
    const isPositive24h = usd.percent_change_24h >= 0;
    const isPositive1h = usd.percent_change_1h >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className={`relative rounded-2xl border border-white/8 bg-gradient-to-br ${config.gradient} backdrop-blur-sm overflow-hidden p-6 cursor-default`}
            style={{ boxShadow: `0 0 40px ${config.bgGlow}, inset 0 1px 0 rgba(255,255,255,0.06)` }}
        >
            {/* Background glow blob */}
            <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-30 pointer-events-none"
                style={{ background: config.color }}
            />

            {/* Header */}
            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg"
                        style={{ background: `${config.color}22`, border: `1px solid ${config.color}44`, color: config.color }}
                    >
                        {config.icon}
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm tracking-wide">{data.name}</p>
                        <p className="text-xs text-zinc-500 font-mono font-semibold">{symbol}</p>
                    </div>
                </div>

                {/* 24h badge */}
                <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isPositive24h
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/15 text-red-400 border border-red-500/20"
                        }`}
                >
                    {isPositive24h ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive24h ? "+" : ""}
                    {usd.percent_change_24h.toFixed(2)}%
                </div>
            </div>

            {/* Price */}
            <div className="mb-5">
                <p className="text-3xl font-extrabold text-white tracking-tight font-mono">
                    ${formatPrice(usd.price)}
                </p>
                <p className="text-xs text-zinc-500 mt-1">USD · Live price</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/4 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-semibold">1h Change</p>
                    <p className={`text-sm font-bold ${isPositive1h ? "text-emerald-400" : "text-red-400"}`}>
                        {isPositive1h ? "+" : ""}{usd.percent_change_1h.toFixed(2)}%
                    </p>
                </div>
                <div className="bg-white/4 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-semibold">7d Change</p>
                    <p className={`text-sm font-bold ${usd.percent_change_7d >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {usd.percent_change_7d >= 0 ? "+" : ""}{usd.percent_change_7d.toFixed(2)}%
                    </p>
                </div>
                <div className="bg-white/4 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-semibold">Market Cap</p>
                    <p className="text-sm font-bold text-white">{formatMarketCap(usd.market_cap)}</p>
                </div>
                <div className="bg-white/4 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-semibold">Vol 24h</p>
                    <p className="text-sm font-bold text-white">{formatVolume(usd.volume_24h)}</p>
                </div>
            </div>
        </motion.div>
    );
}

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
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>
    );
}

export function CryptoDashboard() {
    const [data, setData] = useState<CryptoPricesResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastFetched, setLastFetched] = useState<Date | null>(null);

    const fetchPrices = useCallback(async (manual = false) => {
        if (manual) setIsRefreshing(true);
        else if (!data) setIsLoading(true);

        setError(null);

        try {
            const response = await fetch("/api/crypto/prices");
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error ?? "Failed to fetch prices");
            }
            const json: CryptoPricesResponse = await response.json();
            setData(json);
            setLastFetched(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error occurred");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [data]);

    // Initial fetch
    useEffect(() => {
        fetchPrices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-refresh every 2 minutes
    useEffect(() => {
        const interval = setInterval(() => fetchPrices(), AUTO_REFRESH_MS);
        return () => clearInterval(interval);
    }, [fetchPrices]);

    const symbols = ["BTC", "ETH", "ADA"] as const;

    return (
        <div className="w-full">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xs font-bold text-zinc-400 tracking-widest uppercase">
                        Live Crypto Prices
                    </h2>
                    {lastFetched && (
                        <p className="text-[10px] text-zinc-600 mt-0.5 font-mono">
                            Updated {lastFetched.toLocaleTimeString()}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Online indicator */}
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                        {error ? (
                            <WifiOff className="w-3 h-3 text-red-500" />
                        ) : (
                            <Wifi className="w-3 h-3 text-emerald-500" />
                        )}
                    </div>

                    {/* Refresh button */}
                    <button
                        onClick={() => fetchPrices(true)}
                        disabled={isRefreshing || isLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 text-zinc-400 hover:text-white transition-all duration-200 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Refresh prices"
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

            {/* Error State */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                    >
                        <WifiOff className="w-3.5 h-3.5 shrink-0" />
                        <span>{error}. Retrying automatically…</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cards Grid — 3 columns on desktop to avoid vertical scroll */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {isLoading ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : (
                    symbols.map((symbol) => {
                        const coinData = data?.data?.[symbol];
                        if (!coinData) return null;
                        return (
                            <CryptoCard key={symbol} symbol={symbol} data={coinData} />
                        );
                    })
                )}
            </div>
        </div>
    );
}
