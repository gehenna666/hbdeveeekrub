"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { birthdayConfig } from "@/config/birthdayConfig";

export default function TypewriterLetter() {
  const { letter } = birthdayConfig;
  const [displayedParagraphs, setDisplayedParagraphs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let currentPara = 0;
    let charIndex = 0;
    const paras = letter.paragraphs;
    const buildingText: string[] = ["", "", "", ""];

    const interval = setInterval(() => {
      if (currentPara < paras.length) {
        const fullPara = paras[currentPara];
        if (charIndex < fullPara.length) {
          buildingText[currentPara] = fullPara.substring(0, charIndex + 1);
          setDisplayedParagraphs([...buildingText]);
          charIndex += 2; // smooth reading speed
        } else {
          currentPara++;
          charIndex = 0;
        }
      } else {
        setIsCompleted(true);
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [letter.paragraphs]);

  const showAllImmediately = () => {
    setDisplayedParagraphs([...letter.paragraphs]);
    setIsCompleted(true);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto bg-gradient-to-b from-[#FFF9FB] to-[#FFF0F5] p-6 sm:p-8 rounded-3xl border-2 border-pink-200/80 shadow-md">
      {/* Kitty Bow Stamp Decor */}
      <div className="absolute -top-3.5 right-6 bg-white px-3 py-1 rounded-full border border-pink-200 shadow-sm flex items-center gap-1">
        <span className="text-sm">🎀</span>
        <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">
          From Pond
        </span>
      </div>

      {/* Greeting Title */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-pink-200/60">
        <Sparkles className="w-4 h-4 text-[#FF4D85]" />
        <h3 className="text-lg sm:text-xl font-bold text-[#4A3E3D]">
          {letter.greeting}
        </h3>
      </div>

      {/* Paragraphs */}
      <div className="space-y-3.5 text-sm sm:text-base text-[#5A4D4C] leading-relaxed font-mali">
        {displayedParagraphs.map((para, idx) => (
          <p key={idx} className="min-h-[1.5rem]">
            {para}
          </p>
        ))}
      </div>

      {/* Closing & Signature */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 pt-4 border-t border-pink-200/60 flex flex-col items-end text-right"
        >
          <p className="text-sm font-semibold text-[#FF4D85] flex items-center gap-1">
            <span>{letter.closing}</span>
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          </p>
          <p className="text-xs sm:text-sm font-medium text-[#8A7A78] mt-1 whitespace-pre-line">
            {letter.sign}
          </p>
        </motion.div>
      )}

      {/* Skip Button */}
      {!isCompleted && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={showAllImmediately}
            className="text-[11px] text-pink-400 hover:text-pink-600 underline cursor-pointer"
          >
            แสดงข้อความทั้งหมดทันที ✨
          </button>
        </div>
      )}
    </div>
  );
}
