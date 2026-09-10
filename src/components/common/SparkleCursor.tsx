"use client";

import { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  symbol: string;
}

const SYMBOLS = ["✨", "💖", "🌸", "⭐", "🎀"];

let sparkleCounter = 0;

export default function SparkleCursor() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Only enable on fine pointer devices (desktop/laptop with mouse)
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let counter = 0;
    const handleMouseMove = (e: MouseEvent) => {
      counter++;
      if (counter % 3 !== 0) return; // Throttle to reduce DOM updates

      const newSparkle: Sparkle = {
        id: ++sparkleCounter,
        x: e.clientX + (Math.random() * 12 - 6),
        y: e.clientY + (Math.random() * 12 - 6),
        size: Math.floor(Math.random() * 8) + 10,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      };

      setSparkles((prev) => [...prev.slice(-18), newSparkle]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
      }, 700);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute select-none transition-all duration-700 ease-out animate-ping pointer-events-none"
          style={{
            left: s.x,
            top: s.y,
            fontSize: `${s.size}px`,
            opacity: 0.85,
            transform: "translate(-50%, -50%)",
          }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
}
