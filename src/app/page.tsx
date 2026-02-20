"use client";

import { motion } from "framer-motion";
import { CryptoDashboard } from "@/components/CryptoDashboard";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 overflow-hidden relative">
      {/* Background glows */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-orange-500/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[140px] rounded-full pointer-events-none" />

      <main className="relative z-10 w-full max-w-6xl px-6 py-10">
        {/* Page header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Crypto Portfolio
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Live prices · Auto-refresh every 2 min
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <CryptoDashboard />
        </motion.div>
      </main>
    </div>
  );
}
