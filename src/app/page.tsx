"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReelStore } from "@/store/useReelStore";
import { ReelEditor } from "@/components/ReelEditor";
import { CryptoDashboard } from "@/components/CryptoDashboard";

export default function Home() {
  const { text, fontSize, backgroundColor, textColor } = useReelStore();

  return (
    <div
      className="flex min-h-screen items-center justify-center transition-colors duration-500 overflow-hidden relative"
      style={{ backgroundColor }}
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />

      {/* Sidebar Editor */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <ReelEditor />
        </motion.div>
      </div>

      {/* Crypto Dashboard — right sidebar */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-72">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <CryptoDashboard />
        </motion.div>
      </div>

      <main className="relative z-10 text-center px-4 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.h1
            key={text + fontSize + textColor}
            className="font-extrabold tracking-tighter leading-tight"
            style={{
              fontSize: `${fontSize}px`,
              color: textColor,
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {text}
          </motion.h1>
        </AnimatePresence>

        <motion.p
          className="mt-6 text-zinc-400 text-lg md:text-xl font-medium tracking-wide opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          PREVIEW MODE
        </motion.p>
      </main>

      {/* Decorative elements */}
      <div className="absolute bottom-8 right-8 text-zinc-500 text-xs font-mono uppercase tracking-[0.3em]">
        Reels Maker v0.1
      </div>
    </div>
  );
}
