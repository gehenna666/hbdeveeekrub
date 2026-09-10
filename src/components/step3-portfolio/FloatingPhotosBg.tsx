"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { birthdayConfig } from "@/config/birthdayConfig";

export default function FloatingPhotosBg() {
  const { memories } = birthdayConfig;

  // Configuration for floating background photo positions
  const floatConfigs = [
    { x: "3%", y: "10%", rot: -10, duration: 18, delay: 0, scale: 0.8 },
    { x: "83%", y: "15%", rot: 12, duration: 22, delay: 2, scale: 0.85 },
    { x: "4%", y: "45%", rot: 8, duration: 20, delay: 4, scale: 0.75 },
    { x: "82%", y: "50%", rot: -12, duration: 24, delay: 1, scale: 0.8 },
    { x: "5%", y: "78%", rot: -8, duration: 19, delay: 3, scale: 0.78 },
    { x: "81%", y: "82%", rot: 10, duration: 23, delay: 2, scale: 0.82 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {memories.map((item, idx) => {
        const cfg = floatConfigs[idx % floatConfigs.length];
        return (
          <motion.div
            key={item.id}
            className="absolute hidden md:block opacity-25 hover:opacity-40 transition-opacity"
            style={{
              left: cfg.x,
              top: cfg.y,
              transform: `scale(${cfg.scale}) rotate(${cfg.rot}deg)`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [cfg.rot, cfg.rot + 4, cfg.rot - 4, cfg.rot],
            }}
            transition={{
              duration: cfg.duration,
              delay: cfg.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Mini Floating Polaroid Frame */}
            <div className="w-36 sm:w-44 p-2 bg-white rounded-2xl shadow-xl border-2 border-pink-200/60 backdrop-blur-sm">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-pink-50">
                <Image
                  src={item.image}
                  alt="floating memory"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
              <div className="pt-1.5 pb-0.5 text-center">
                <span className="text-[10px] font-bold text-pink-400 font-mali">
                  🎀 {item.title}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
