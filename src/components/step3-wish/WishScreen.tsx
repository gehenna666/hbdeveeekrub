"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, Heart, Sparkles, ArrowRight, ArrowLeft, Stamp, Award } from "lucide-react";
import { playPopSound, playSparkleSound, playSuccessSound } from "@/utils/audioSystem";
import confetti from "canvas-confetti";

interface WishScreenProps {
  onNext: () => void;
  onBack: () => void;
}

interface StoredWish {
  id: string;
  text: string;
  badge?: string;
  date: string;
}

const BADGES = [
  { id: "princess", label: "เจ้าหญิงคนสวย 👑", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { id: "best-gf", label: "แฟนดีเด่นตลอดกาล 🏆", color: "bg-pink-100 text-pink-700 border-pink-300" },
  { id: "love-pond", label: "รักปอนด์ที่สุดในโลก 💖", color: "bg-rose-100 text-rose-700 border-rose-300" },
  { id: "rich-pretty", label: "ขอให้รวยและสวยมาก ✨", color: "bg-purple-100 text-purple-700 border-purple-300" },
  { id: "travel", label: "เที่ยวรอบโลกด้วยกัน ✈️", color: "bg-sky-100 text-sky-700 border-sky-300" },
  { id: "eat-happy", label: "กินของอร่อยไม่อ้วน 🍰", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
];

const STICKERS = ["💖", "🎀", "🎂", "🍓", "✨", "🧸", "💌", "🌸", "🍭", "🐱"];

export default function WishScreen({ onNext, onBack }: WishScreenProps) {
  const [wishText, setWishText] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<string>(BADGES[0].label);
  const [savedWishes, setSavedWishes] = useState<StoredWish[]>([]);
  const [justSent, setJustSent] = useState(false);

  useEffect(() => {
    try {
      // Clear legacy storage containing mockup wish
      localStorage.removeItem("hbd_wishes_v2");
      const stored = localStorage.getItem("hbd_wishes_v3");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedWishes(Array.isArray(parsed) ? parsed.filter((w: StoredWish) => w.id !== "1") : []);
      } else {
        setSavedWishes([]);
      }
    } catch {
      setSavedWishes([]);
    }
  }, []);

  const handleAddEmoji = (emoji: string) => {
    playPopSound();
    setWishText((prev) => prev + emoji);
  };

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    playSuccessSound();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#FF4D85", "#FF85A2", "#FFD700", "#FFFFFF"],
    });

    const newWish: StoredWish = {
      id: Date.now().toString(),
      text: wishText.trim(),
      badge: selectedBadge,
      date: new Date().toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    const updated = [newWish, ...savedWishes];
    setSavedWishes(updated);
    try {
      localStorage.setItem("hbd_wishes_v3", JSON.stringify(updated));
    } catch {
      // Ignore
    }

    setWishText("");
    setJustSent(true);
    setTimeout(() => setJustSent(false), 3500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="clay-card w-full max-w-2xl p-6 sm:p-10 flex flex-col items-center relative overflow-hidden"
      >
        {/* Top Header Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-[#FF4D85] text-xs font-bold mb-3 shadow-inner">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Birthday Wishing Station • หน้าเขียนคำอธิษฐาน 🎀</span>
        </div>

        {/* Kitty Avatar */}
        <div className="relative mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-md relative bg-pink-50">
            <Image
              src="/images/kitty-birthday.jpg"
              alt="Kitty Princess"
              fill
              sizes="(max-width: 640px) 80px, 96px"
              className="object-cover"
            />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#4A3E3D] text-center mb-1">
          กล่องความปรารถนา & ส่งใจถึงปอนด์ 💌
        </h2>
        <p className="text-xs sm:text-sm text-[#8A7A78] text-center max-w-md mb-6">
          เลือกตราประทับแห่งความสุข และเขียนคำอธิษฐานวันเกิดที่อยากให้เป็นจริง ส่งถึงคุณปอนด์ได้ที่นี่เลยนะคะ
        </p>

        {/* Badge Stamps Selector */}
        <div className="w-full mb-5">
          <p className="text-xs font-bold text-[#4A3E3D] mb-2.5 flex items-center gap-1.5">
            <Stamp className="w-3.5 h-3.5 text-pink-500" />
            <span>เลือกตราประทับพิเศษสำหรับคำอวยพร:</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BADGES.map((b) => {
              const isSelected = selectedBadge === b.label;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setSelectedBadge(b.label);
                  }}
                  className={`px-3 py-2 rounded-2xl text-xs font-semibold border-2 transition-all cursor-pointer flex items-center justify-center text-center ${
                    isSelected
                      ? `${b.color} scale-105 shadow-md border-pink-400 font-bold`
                      : "bg-white/80 text-[#8A7A78] border-pink-100 hover:bg-pink-50"
                  }`}
                >
                  <span>{b.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stickers Bar */}
        <div className="w-full mb-3 flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs text-pink-400 font-medium whitespace-nowrap mr-1">
            สติกเกอร์ดุ๊กดิ๊ก:
          </span>
          {STICKERS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAddEmoji(s)}
              className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-sm transition-transform active:scale-90 border border-pink-100 shrink-0 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSendWish} className="w-full space-y-4">
          <div className="relative">
            <textarea
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="พิมพ์คำอธิษฐานวันเกิดปีนี้ หรือข้อความหวานๆ ที่อยากบอกปอนด์... 🎀✨"
              rows={4}
              className="clay-input w-full p-4 text-sm sm:text-base text-[#4A3E3D] placeholder:text-pink-300 resize-none font-mali"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-pink-400 font-medium flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>ตราประทับที่เลือก: {selectedBadge}</span>
            </span>

            <button
              type="submit"
              disabled={!wishText.trim()}
              className="clay-button w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" />
              <span>ผนึกคำอธิษฐานส่งให้ปอนด์ 💌</span>
            </button>
          </div>
        </form>

        {/* Success Alert Banner */}
        <AnimatePresence>
          {justSent && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-300 text-xs sm:text-sm font-bold text-[#FF3366] flex items-center gap-2 shadow-sm w-full"
            >
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>ส่งคำอธิษฐานใส่ขวดแก้วความทรงจำแล้วนะคะ! ขอให้สมหวังทุกประการ 💖</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved Wishing Capsules List */}
        {savedWishes.length > 0 && (
          <div className="w-full mt-6 pt-5 border-t border-pink-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs sm:text-sm font-bold text-[#FF4D85] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-pink-500" />
                <span>แคปซูลคำอวยพรที่บันทึกไว้ ({savedWishes.length} ข้อความ)</span>
              </h4>
              <span className="text-[11px] text-pink-400">เก็บไว้ในไดอารี่หัวใจ 🎀</span>
            </div>

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {savedWishes.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-gradient-to-br from-pink-50/90 to-white border border-pink-200/80 shadow-sm flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    {item.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-[#FF4D85] font-bold">
                        {item.badge}
                      </span>
                    )}
                    <span className="text-[#8A7A78] font-medium">{item.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4A3E3D] font-mali break-words leading-relaxed">
                    &quot;{item.text}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-pink-100">
          <button
            onClick={() => {
              playPopSound();
              onBack();
            }}
            className="clay-button-secondary w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับไปดูการ์ดอวยพร</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              playSparkleSound();
              onNext();
            }}
            className="clay-button w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <span>ไปดูอัลบั้มรูปคู่ของเรา</span>
            <ArrowRight className="w-4 h-4" />
            <Heart className="w-4 h-4 fill-white" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
