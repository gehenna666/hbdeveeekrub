"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Flame } from "lucide-react";
import { playComboSound, playSparkleSound } from "@/utils/audioSystem";
import confetti from "canvas-confetti";

interface FlyingParticle {
  id: number;
  symbol: string;
  x: number;
  y: number;
  scale: number;
}

let particleCounter = 0;

export default function LoveRushButton() {
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState<FlyingParticle[]>([]);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    playComboSound(nextCombo);

    // Get click position
    const rect = e.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top;

    // Spawn flying particles
    const emojis = ["💖", "🎀", "🍓", "✨", "💕", "🌸", "🧁", "👑", "🎂"];
    const count = nextCombo > 20 ? 4 : 2;
    const newParticles: FlyingParticle[] = [];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: ++particleCounter,
        symbol: emojis[Math.floor(Math.random() * emojis.length)],
        x: (Math.random() - 0.5) * 120,
        y: -40 - Math.random() * 80,
        scale: 0.8 + Math.random() * 0.6,
      });
    }

    setParticles((prev) => [...prev.slice(-25), ...newParticles]);

    // Milestones (every 25 combo: mini confetti burst)
    if (nextCombo % 25 === 0) {
      playSparkleSound();
      confetti({
        particleCount: 40,
        spread: 70,
        origin: {
          x: originX / window.innerWidth,
          y: originY / window.innerHeight,
        },
        colors: ["#FF3366", "#FF69B4", "#FFD700"],
      });
    }

    // Reset combo timer
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setCombo(0);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-20 sm:right-24 z-50 select-none">
      {/* Flying Particle Layer */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, scale: p.scale, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              scale: p.scale * 1.5,
              x: p.x,
              y: p.y - 60,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute left-6 bottom-14 text-2xl pointer-events-none drop-shadow-md z-50"
          >
            {p.symbol}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Combo Badge Floating above button */}
      <AnimatePresence>
        {combo > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[11px] font-black whitespace-nowrap shadow-lg flex items-center gap-1 border border-white ${
              combo >= 50
                ? "bg-gradient-to-r from-red-500 to-amber-500 text-white animate-bounce"
                : combo >= 20
                ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white"
                : "bg-pink-100 text-[#FF3366]"
            }`}
          >
            <Flame className="w-3 h-3 animate-pulse" />
            <span>
              {combo}x {combo >= 50 ? "SUPER LOVE!" : combo >= 20 ? "LOVE RUSH!" : "LOVE!"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The 3D Love Button */}
      <motion.button
        type="button"
        onClick={handleClick}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#FF3366] via-[#FF5E8E] to-rose-400 border-2 border-white shadow-xl flex flex-col items-center justify-center cursor-pointer relative group"
        style={{
          boxShadow:
            combo > 0
              ? "0 0 20px rgba(255, 51, 102, 0.7), inset 0 2px 4px rgba(255,255,255,0.7)"
              : "0 8px 20px rgba(255, 51, 102, 0.35), inset 0 2px 4px rgba(255,255,255,0.7)",
        }}
        title="ปั๊มหัวใจบอกรักปอนด์ 💖 (กดย้ำๆ เพื่อสะสมคอมโบ)"
      >
        <Heart
          className={`w-6 h-6 text-white fill-white transition-transform ${
            combo > 0 ? "scale-125 animate-pulse" : "group-hover:scale-110"
          }`}
        />
        <span className="text-[8px] font-bold text-white tracking-tighter -mt-0.5">
          {combo > 0 ? combo : "รักปอนด์"}
        </span>

        {/* Hello Kitty Bow floating on button */}
        <span className="absolute -top-1.5 -right-1 text-sm drop-shadow">🎀</span>
      </motion.button>
    </div>
  );
}
