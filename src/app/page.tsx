"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black overflow-hidden relative">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full" />

      <main className="relative z-10 text-center">
        <motion.h1
          className="text-7xl md:text-9xl font-extrabold tracking-tighter text-gradient animate-float"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          Reels Maker
        </motion.h1>

        <motion.p
          className="mt-6 text-zinc-400 text-lg md:text-xl font-medium tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          MAKING MAGIC IN EVERY SECOND
        </motion.p>
      </main>
    </div>
  );
}
