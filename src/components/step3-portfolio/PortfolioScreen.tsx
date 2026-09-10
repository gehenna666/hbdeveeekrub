"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Heart, Camera, RotateCcw } from "lucide-react";
import { birthdayConfig, MemoryItem } from "@/config/birthdayConfig";
import { playPopSound } from "@/utils/audioSystem";
import LoveCounter from "./LoveCounter";
import PolaroidCard from "./PolaroidCard";
import MemoryModal from "./MemoryModal";
import FloatingPhotosBg from "./FloatingPhotosBg";
import LoveCoupons from "./LoveCoupons";
import RomanticScratchCard from "./RomanticScratchCard";

interface PortfolioScreenProps {
  onBackToWish: () => void;
  onResetToStart: () => void;
}

export default function PortfolioScreen({
  onBackToWish,
  onResetToStart,
}: PortfolioScreenProps) {
  const { memories, girlfriendName, boyfriendName } = birthdayConfig;
  const [activeMemory, setActiveMemory] = useState<MemoryItem | null>(null);

  const handleModalNavigate = (direction: "prev" | "next") => {
    if (!activeMemory) return;
    const currentIndex = memories.findIndex((m) => m.id === activeMemory.id);
    let nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= memories.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = memories.length - 1;

    setActiveMemory(memories[nextIndex]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 sm:py-12 relative z-10">
      {/* Floating Couple Photos in the Background */}
      <FloatingPhotosBg />

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center relative z-10">
        {/* Top Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          {/* Kitty Ribbon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-[#FF4D85] text-xs font-bold mb-3 shadow-inner">
            <Camera className="w-3.5 h-3.5" />
            <span>Our Precious Love Story • อัลบั้มความทรงจำของเรา 🎀</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-[#4A3E3D] mb-2 flex items-center justify-center gap-2 flex-wrap">
            <span>{boyfriendName}</span>
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 fill-pink-500 text-pink-500 animate-pulse inline" />
            <span>{girlfriendName}</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#8A7A78] max-w-md mx-auto">
            ทุกรูปคือความทรงจำที่ปอนด์บันทึกไว้ด้วยความรัก แตะรูปเพื่อเปิดดูรูปใหญ่ได้เลยนะคะ 💖
          </p>
        </motion.div>

        {/* Realtime Love Days Counter */}
        <LoveCounter />

        {/* Polaroid Grid Layout - All photos directly without category filter */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 w-full max-w-5xl my-6">
          {memories.map((memory, index) => (
            <PolaroidCard
              key={memory.id}
              memory={memory}
              index={index}
              onSelect={(m) => setActiveMemory(m)}
            />
          ))}
        </div>

        {/* Love Coupons Station (ตั๋วตามใจคนพิเศษ) */}
        <LoveCoupons />

        {/* Romantic Golden Scratch Ticket */}
        <RomanticScratchCard />

        {/* Lightbox Modal */}
        <MemoryModal
          memory={activeMemory}
          memories={memories}
          onClose={() => setActiveMemory(null)}
          onNavigate={handleModalNavigate}
        />

        {/* Bottom Romantic Footer & Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-xl my-12 p-6 sm:p-8 rounded-3xl clay-card text-center flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-200 mb-3 relative shadow-md">
            <Image
              src="/images/kitty-birthday.jpg"
              alt="Hello Kitty Love"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>

          <h4 className="font-mali text-lg sm:text-xl font-bold text-[#4A3E3D] mb-1">
            สุขสันต์วันเกิดอีกครั้งนะคะคนดี 🎂💖
          </h4>
          <p className="text-xs sm:text-sm text-[#8A7A78] max-w-sm mb-6">
            ปอนด์รักเธอมากๆ เลยนะ หวังว่าของขวัญชิ้นนี้จะทำให้เธอยิ้มได้กว้างที่สุดในวันนี้!
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <button
              onClick={() => {
                playPopSound();
                onBackToWish();
              }}
              className="clay-button-secondary w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับไปหน้าเขียนคำอธิษฐาน</span>
            </button>

            <button
              onClick={() => {
                playPopSound();
                onResetToStart();
              }}
              className="clay-button w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>เริ่มเล่นใหม่ตั้งแต่ต้น ✨</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
