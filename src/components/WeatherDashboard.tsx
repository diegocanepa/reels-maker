"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Wifi,
  WifiOff,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Eye,
} from "lucide-react";
import type { WeatherResponse } from "@/app/api/weather/current/route";

const AUTO_REFRESH_MS = 10 * 60 * 1000; // 10 minutes

// Map OWM icon codes to friendly emoji
function weatherEmoji(icon: string): string {
  if (icon.startsWith("01")) return "☀️";
  if (icon.startsWith("02")) return "🌤️";
  if (icon.startsWith("03") || icon.startsWith("04")) return "☁️";
  if (icon.startsWith("09") || icon.startsWith("10")) return "🌧️";
  if (icon.startsWith("11")) return "⛈️";
  if (icon.startsWith("13")) return "❄️";
  if (icon.startsWith("50")) return "🌫️";
  return "🌡️";
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function WeatherSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Main temp card */}
      <div className="rounded-2xl border border-white/5 bg-white/3 backdrop-blur-sm p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white/10" />
          <div className="h-16 w-48 rounded-xl bg-white/10" />
          <div className="h-4 w-32 rounded bg-white/5" />
        </div>
      </div>
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-white/3 p-5">
            <div className="h-4 w-12 rounded bg-white/10 mb-2" />
            <div className="h-6 w-10 rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Countdown bar (same pattern as CryptoDashboard) ─────────────────────────
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
        className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/4 rounded-2xl p-5 border border-white/5 flex flex-col gap-2"
    >
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-sky-400" />
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
          {label}
        </p>
      </div>
      <p className="text-lg font-bold text-white font-mono">{value}</p>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function WeatherDashboard() {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchWeather = useCallback(
    async (manual = false) => {
      if (manual) setIsRefreshing(true);
      else if (!data) setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/weather/current");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error ?? "Failed to fetch weather data");
        }
        const json: WeatherResponse = await response.json();
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
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => fetchWeather(), AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  const weather = data?.data;

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xs font-bold text-zinc-400 tracking-widest uppercase">
            Live Weather · Córdoba, Argentina
          </h2>
          {lastFetched && (
            <p className="text-[10px] text-zinc-600 mt-0.5 font-mono">
              Updated {lastFetched.toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
            {error ? (
              <WifiOff className="w-3 h-3 text-red-500" />
            ) : (
              <Wifi className="w-3 h-3 text-emerald-500" />
            )}
          </div>

          <button
            onClick={() => fetchWeather(true)}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 text-zinc-400 hover:text-white transition-all duration-200 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            title="Refresh weather"
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

      {/* Loading skeleton */}
      {isLoading ? (
        <WeatherSkeleton />
      ) : weather ? (
        <div className="space-y-4">
          {/* Main temperature card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/15 to-cyan-500/8 backdrop-blur-sm p-8 overflow-hidden"
            style={{
              boxShadow:
                "0 0 60px rgba(14, 165, 233, 0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Background glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col items-center text-center gap-2">
              {/* Weather emoji */}
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-6xl leading-none select-none"
                role="img"
                aria-label={weather.description}
              >
                {weatherEmoji(weather.icon)}
              </motion.span>

              {/* Temperature */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-7xl font-extrabold text-white font-mono tracking-tight"
              >
                {Math.round(weather.temp)}°
                <span className="text-3xl text-sky-400 ml-1">C</span>
              </motion.p>

              {/* Condition */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-zinc-300 text-base font-medium"
              >
                {capitalize(weather.description)}
              </motion.p>

              {/* Feels like */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-zinc-500 text-sm"
              >
                Sensación térmica {Math.round(weather.feels_like)}°C
              </motion.p>
            </div>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Humedad"
              value={`${weather.humidity}%`}
              icon={Droplets}
            />
            <StatCard
              label="Viento"
              value={`${weather.wind_speed.toFixed(1)} m/s`}
              icon={Wind}
            />
            <StatCard
              label="Índice UV"
              value={String(Math.round(weather.uvi))}
              icon={Sun}
            />
            <StatCard
              label="Visibilidad"
              value={`${(weather.visibility / 1000).toFixed(1)} km`}
              icon={Eye}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
