"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Heart, Sparkles, MailOpen } from "lucide-react";
import { playPopSound } from "@/utils/audioSystem";
import HeartTracingCanvas from "./HeartTracingCanvas";
import BirthdayCake3D from "./BirthdayCake3D";
import TypewriterLetter from "./TypewriterLetter";
import MysteryGiftBox from "./MysteryGiftBox";

interface GreetingCardScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export default function GreetingCardScreen({ onNext, onBack }: GreetingCardScreenProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCandleBlown, setIsCandleBlown] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 py-12">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="canvas"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full flex flex-col items-center"
          >
            <HeartTracingCanvas onUnlockCard={() => setIsUnlocked(true)} />

            {/* Back Button */}
            <button
              onClick={() => {
                playPopSound();
                onBack();
              }}
              className="mt-2 text-xs text-pink-400 hover:text-pink-600 flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ย้อนกลับไปหน้าใส่รหัส</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.85, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="clay-card w-full max-w-2xl p-6 sm:p-10 flex flex-col items-center relative"
          >
            {/* Top Kitty Ribbon Banner */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 text-[#FF4D85] text-xs font-bold mb-4 shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Happy 22th Birthday Princess 🎂🎀</span>
            </div>

            {/* Kitty Avatar Header */}
            <div className="relative mb-2">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-md relative bg-pink-50">
                <Image
                  src="/images/kitty-birthday.jpg"
                  alt="Kitty"
                  fill
                  sizes="(max-width: 640px) 80px, 96px"
                  className="object-cover"
                />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#4A3E3D] text-center mb-1">
              เค้กวันเกิดของคนเก่ง 🎂✨
            </h2>
            <p className="text-xs sm:text-sm text-[#8A7A78] text-center max-w-sm mb-2">
              {isCandleBlown
                ? "คำอธิษฐานส่งถึงดวงดาวแล้ว! อ่านจดหมายจากคุณปอนด์ด้านล่างได้เลยนะคะ 💖"
                : "ตั้งจิตอธิษฐานขอพรสิ่งที่ดีที่สุด แล้วแตะเค้กเพื่อเป่าเทียนนะคะ 💨"}
            </p>

            {/* 3D Birthday Cake with Spectacular Flame */}
            <BirthdayCake3D onBlowComplete={() => setIsCandleBlown(true)} />

            {/* Typewriter Letter from Pond — Appears ONLY after blowing the candle! */}
            <AnimatePresence>
              {isCandleBlown && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                  className="w-full flex flex-col items-center mt-6"
                >
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-[#FF3366] mb-4">
                    <MailOpen className="w-4 h-4 text-pink-500 animate-bounce" />
                    <span>จดหมายรักฉบับพิเศษเปิดออกแล้ว 💌</span>
                  </div>

                  <TypewriterLetter />

                  {/* Surprise Interactive 3D Gift Box Unboxing */}
                  <MysteryGiftBox />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-pink-100">
              <button
                onClick={() => {
                  playPopSound();
                  setIsUnlocked(false);
                }}
                className="clay-button-secondary w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>วาดรูปหัวใจอีกครั้ง</span>
              </button>

              <button
                onClick={() => {
                  playPopSound();
                  onNext();
                }}
                className="clay-button w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>ไปเขียนคำอธิษฐาน & ส่งความในใจ</span>
                <ArrowRight className="w-4 h-4" />
                <Heart className="w-4 h-4 fill-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
