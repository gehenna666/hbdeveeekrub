"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  symbol: string;
  color: string;
}

const SYMBOLS = ["💖", "✨", "🎀", "🌸", "🤍", "🍓", "⭐", "💫", "🌟"];
const COLORS = ["text-pink-300", "text-pink-400", "text-rose-300", "text-pink-200", "text-amber-200", "text-white"];

export default function FloatingHearts() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate initial gentle floating particles
    const items: Particle[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 95, // percentage
      size: Math.floor(Math.random() * 16) + 14,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 8,
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setParticles(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute select-none opacity-40 ${p.color}`}
          style={{
            left: `${p.x}%`,
            fontSize: `${p.size}px`,
            bottom: "-40px",
          }}
          animate={{
            y: [0, -1100],
            x: [0, (p.id % 2 === 0 ? 1 : -1) * (20 + (p.id % 15) * 2), 0],
            rotate: [0, (p.id % 2 === 0 ? 45 : -45), 0],
            opacity: [0, 0.6, 0.8, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
}
