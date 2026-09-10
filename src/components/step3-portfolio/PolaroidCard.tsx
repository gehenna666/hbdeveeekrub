"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Calendar, Sparkles } from "lucide-react";
import { MemoryItem } from "@/config/birthdayConfig";
import { playPopSound, playSparkleSound } from "@/utils/audioSystem";

interface PolaroidCardProps {
  memory: MemoryItem;
  index: number;
  onSelect: (memory: MemoryItem) => void;
}

let heartCounter = 0;

export default function PolaroidCard({
  memory,
  index,
  onSelect,
}: PolaroidCardProps) {
  const [likes, setLikes] = useState(index * 3 + 12);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);

  const rotations = [-2.5, 1.8, -1.5, 2.2, -1.2, 2.5];
  const rot = rotations[index % rotations.length];

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound();
    setLikes((prev: number) => prev + 1);

    const newHeart = { id: ++heartCounter, x: (Math.random() - 0.5) * 40 };
    setFloatingHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  };

  const handleCardClick = () => {
    playSparkleSound();
    onSelect(memory);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: -25, right: 25, top: -25, bottom: 25 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.05, zIndex: 30 }}
      whileHover={{ scale: 1.03, y: -6 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, rotate: rot }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={handleCardClick}
      className="clay-polaroid relative cursor-pointer select-none group w-full max-w-[290px] sm:max-w-[310px] mx-auto flex flex-col min-h-[420px]"
    >
      {/* Cute Washi Tape at the top */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-3 py-0.5 rounded-sm bg-pink-200/90 shadow-sm border-t border-b border-pink-300 text-[11px] font-bold text-pink-700 flex items-center gap-1 backdrop-blur-sm">
        <span>🎀</span>
        <span>{memory.tag}</span>
      </div>

      {/* Photo Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-pink-50 border border-pink-100/80 mb-3 shadow-inner">
        <Image
          src={memory.image}
          alt={memory.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 280px, 320px"
        />

        {/* Hover Hint Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-[#FF4D85] flex items-center gap-1 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>แตะดูรูปใหญ่</span>
          </div>
        </div>
      </div>

      {/* Handwritten Caption Area */}
      <div className="px-1 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-mali font-bold text-base sm:text-lg text-[#4A3E3D] leading-tight mb-1">
            {memory.title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-[#8A7A78]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-pink-400" />
              {memory.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-pink-400" />
              {memory.location}
            </span>
          </div>
          {memory.caption && (
            <p className="font-mali text-xs text-[#6B5E5D] mt-2 line-clamp-2 leading-relaxed">
              {memory.caption}
            </p>
          )}
        </div>

        {/* Bottom Interactive Area */}
        <div className="mt-3 pt-2 border-t border-pink-100 flex items-center justify-between relative">
          <span className="text-[11px] text-[#FF4D85] font-bold flex items-center gap-1 group-hover:text-[#FF3366] transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            <span>แตะดูรูปใหญ่ 📸</span>
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={handleLike}
              className="px-2.5 py-1 rounded-full bg-pink-50 hover:bg-pink-100 border border-pink-200 text-xs font-semibold text-[#FF3366] flex items-center gap-1.5 transition-all active:scale-90 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>{likes}</span>
            </button>

            {/* Floating Hearts Animation */}
            <AnimatePresence>
              {floatingHearts.map((h) => (
                <motion.span
                  key={h.id}
                  initial={{ opacity: 1, y: 0, scale: 0.8, x: h.x }}
                  animate={{ opacity: 0, y: -45, scale: 1.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute -top-3 left-1/2 pointer-events-none text-sm select-none"
                >
                  💖
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
