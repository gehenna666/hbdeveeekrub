"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Sparkles, Heart } from "lucide-react";
import { MemoryItem } from "@/config/birthdayConfig";
import { playPopSound } from "@/utils/audioSystem";

interface MemoryModalProps {
  memory: MemoryItem | null;
  memories: MemoryItem[];
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
}

export default function MemoryModal({
  memory,
  memories,
  onClose,
  onNavigate,
}: MemoryModalProps) {
  if (!memory) return null;

  const currentIndex = memories.findIndex((m) => m.id === memory.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playPopSound();
            onClose();
          }}
          className="absolute inset-0 bg-[#3D2633]/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="clay-card relative z-10 w-full max-w-lg p-5 sm:p-7 flex flex-col bg-white overflow-hidden max-h-[90vh]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#FF4D85] text-xs font-bold shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ความทรงจำที่ {currentIndex + 1} จาก {memories.length}</span>
            </div>

            <button
              onClick={() => {
                playPopSound();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-[#4A3E3D] flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Photo Display */}
          <div className="relative w-full aspect-square max-h-[340px] rounded-2xl overflow-hidden bg-pink-50 border-2 border-pink-100 shadow-inner mb-4">
            <Image
              src={memory.image}
              alt={memory.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 500px"
              priority
            />
          </div>

          {/* Memory Details */}
          <div className="space-y-2 overflow-y-auto pr-1">
            <h3 className="font-mali text-xl sm:text-2xl font-bold text-[#4A3E3D]">
              {memory.title}
            </h3>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-[#8A7A78]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-pink-500" />
                {memory.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-pink-500" />
                {memory.location}
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#5A4D4C] leading-relaxed pt-2 font-mali border-t border-pink-100">
              &quot;{memory.caption}&quot;
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-5 pt-3 border-t border-pink-100">
            <button
              onClick={() => {
                playPopSound();
                onNavigate("prev");
              }}
              className="clay-button-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>รูปก่อนหน้า</span>
            </button>

            <span className="text-xs text-pink-400 font-bold flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>Pond & Special One</span>
            </span>

            <button
              onClick={() => {
                playPopSound();
                onNavigate("next");
              }}
              className="clay-button px-4 py-2 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>รูปถัดไป</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
