"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CryptoDashboard } from "@/components/CryptoDashboard";
import { WeatherDashboard } from "@/components/WeatherDashboard";

type Tab = "crypto" | "weather";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "crypto", label: "Crypto Data", emoji: "📈" },
  { id: "weather", label: "Weather Data", emoji: "🌤️" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("crypto");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 overflow-hidden relative">
      {/* Background glows */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-orange-500/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[140px] rounded-full pointer-events-none" />
      {/* Weather-specific glow — only visible on weather tab */}
      <AnimatePresence>
        {activeTab === "weather" && (
          <motion.div
            key="weather-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-sky-500/5 blur-[140px] rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>

      <main className="relative z-10 w-full max-w-6xl px-6 py-10">
        {/* Page header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Reels Maker Dashboard
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Live data · Auto-refresh
          </p>
        </motion.div>

        {/* Tab selector */}
        <motion.div
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/8 backdrop-blur-sm">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {/* Active pill */}
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="active-tab-pill"
                    className="absolute inset-0 rounded-lg bg-white/10 border border-white/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 text-base leading-none">{tab.emoji}</span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Dashboard content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            {activeTab === "crypto" ? <CryptoDashboard /> : <WeatherDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
