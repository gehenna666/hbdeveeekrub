"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, KeyRound } from "lucide-react";
import { playSuccessSound, playSparkleSound, playPopSound } from "@/utils/audioSystem";
import confetti from "canvas-confetti";

interface HeartLockAnimationProps {
  onComplete: () => void;
}

export default function HeartLockAnimation({ onComplete }: HeartLockAnimationProps) {
  const [phase, setPhase] = useState<"key-approaching" | "key-insert" | "unlocking" | "open">("key-approaching");

  useEffect(() => {
    // 1. Key flies in
    const t1 = setTimeout(() => {
      setPhase("key-insert");
      playPopSound();
    }, 600);

    // 2. Key turns & unlocks
    const t2 = setTimeout(() => {
      setPhase("unlocking");
      playSparkleSound();
    }, 1200);

    // 3. Lock pops open with fireworks
    const t3 = setTimeout(() => {
      setPhase("open");
      playSuccessSound();

      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#FFD700", "#FF4D85", "#FFFFFF", "#FF69B4"],
      });
    }, 1800);

    // 4. Proceed to next step
    const t4 = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pink-950/40 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="clay-card p-8 sm:p-12 flex flex-col items-center text-center max-w-sm w-full relative overflow-hidden"
      >
        {/* Glow Ring Behind Lock */}
        <div className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-pink-300 to-amber-200 blur-2xl opacity-40 animate-pulse pointer-events-none" />

        {/* Title */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-100 text-[#FF4D85] text-xs font-bold mb-6 shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ปลดล็อกหัวใจด้วยความรัก 💖</span>
        </motion.div>

        {/* Heart Lock & Key Visual */}
        <div className="relative w-36 h-36 flex items-center justify-center my-2">
          {/* Shackle (หูกุญแจ) */}
          <motion.div
            className="absolute top-1 w-16 h-18 rounded-t-full border-8 border-amber-300 shadow-md"
            animate={
              phase === "open"
                ? { y: -16, rotate: -25, originX: 0, originY: 1 }
                : { y: 0, rotate: 0 }
            }
            transition={{ type: "spring", stiffness: 350, damping: 18 }}
            style={{
              borderColor: "#F6C85F",
              boxShadow: "inset 1px 1px 3px rgba(255,255,255,0.8), 2px 4px 10px rgba(0,0,0,0.15)",
            }}
          />

          {/* Heart Lock Body (ตัวแม่กุญแจรูปหัวใจ 3D) */}
          <motion.div
            animate={
              phase === "open"
                ? { scale: [1, 1.1, 1.05] }
                : { scale: 1 }
            }
            className="relative z-10 w-28 h-28 flex items-center justify-center"
          >
            {/* Heart 3D shape */}
            <div
              className="w-24 h-24 rounded-3xl rotate-45 relative flex items-center justify-center shadow-2xl border-4 border-white/80"
              style={{
                background: "linear-gradient(135deg, #FF6B97 0%, #FF3366 60%, #D81B60 100%)",
                boxShadow:
                  "8px 12px 24px rgba(255, 51, 102, 0.45), inset 3px 3px 6px rgba(255, 255, 255, 0.8), inset -4px -4px 8px rgba(150, 0, 50, 0.3)",
              }}
            >
              {/* Circular lobes for classic heart */}
              <div
                className="absolute -top-10 left-0 w-24 h-24 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #FF7FA6 0%, #FF3366 100%)",
                  boxShadow: "inset 2px 2px 5px rgba(255, 255, 255, 0.8)",
                }}
              />
              <div
                className="absolute top-0 -left-10 w-24 h-24 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #FF7FA6 0%, #FF3366 100%)",
                  boxShadow: "inset 2px 2px 5px rgba(255, 255, 255, 0.8)",
                }}
              />

              {/* Center Keyhole */}
              <div className="-rotate-45 relative z-20 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-[#3D1E2A] border border-amber-300/60 shadow-inner flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-75" />
                </div>
                <div className="w-2.5 h-4 bg-[#3D1E2A] -mt-1 rounded-b-md" />
              </div>
            </div>
          </motion.div>

          {/* Golden Key (ลูกกุญแจทองรูปโบว์คิตตี้) */}
          <motion.div
            className="absolute z-30"
            initial={{ x: 80, y: -40, rotate: 45, opacity: 0 }}
            animate={
              phase === "key-approaching"
                ? { x: 40, y: -20, rotate: 30, opacity: 1 }
                : phase === "key-insert"
                ? { x: 0, y: 0, rotate: 0, opacity: 1 }
                : phase === "unlocking"
                ? { x: 0, y: 0, rotate: 90, scale: 1.1 }
                : { x: 0, y: 0, rotate: 90, opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="relative flex items-center">
              {/* Bow Handle */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 border-2 border-white shadow-md flex items-center justify-center">
                <span className="text-xs">🎀</span>
              </div>
              {/* Key Shaft */}
              <div className="w-6 h-2 bg-gradient-to-r from-amber-400 to-amber-300 shadow-sm relative">
                {/* Teeth */}
                <div className="absolute right-1 top-2 w-1.5 h-2 bg-amber-400" />
                <div className="absolute right-3.5 top-2 w-1.5 h-1.5 bg-amber-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Status text */}
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mali text-base sm:text-lg font-bold text-[#4A3E3D] mt-6"
        >
          {phase === "open"
            ? "ปลดล็อกสำเร็จแล้วค่ะ! 💖✨"
            : phase === "unlocking"
            ? "กำลังไขกุญแจหัวใจ... 🗝️"
            : "กำลังนำกุญแจมาไขหัวใจ... 🎀"}
        </motion.p>
      </motion.div>
    </div>
  );
}
