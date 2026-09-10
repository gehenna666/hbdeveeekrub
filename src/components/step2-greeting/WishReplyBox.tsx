"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, Heart, Sparkles, MessageCircleHeart } from "lucide-react";
import { playPopSound, playSparkleSound } from "@/utils/audioSystem";

export default function WishReplyBox() {
  const [wishText, setWishText] = useState("");
  const [savedWishes, setSavedWishes] = useState<string[]>([]);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hbd_wishes");
      if (stored) {
        setSavedWishes(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleAddEmoji = (emoji: string) => {
    playPopSound();
    setWishText((prev) => prev + emoji);
  };

  const handleSaveWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    playSparkleSound();
    const updated = [wishText.trim(), ...savedWishes];
    setSavedWishes(updated);
    try {
      localStorage.setItem("hbd_wishes", JSON.stringify(updated));
    } catch {
      // Ignore
    }

    setWishText("");
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  };

  const stickers = ["💖", "🎀", "🎂", "🍓", "✨", "🧸", "💌", "🌸"];

  return (
    <div className="w-full max-w-lg mx-auto mt-6 bg-white/90 backdrop-blur-md p-6 sm:p-7 rounded-3xl border-2 border-pink-200/80 shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircleHeart className="w-5 h-5 text-[#FF4D85]" />
        <h4 className="text-base sm:text-lg font-bold text-[#4A3E3D]">
          กล่องเขียนคำอธิษฐาน & ข้อความถึงปอนด์ 💌
        </h4>
      </div>
      <p className="text-xs text-[#8A7A78] mb-4">
        เขียนคำอวยพรให้ตัวเอง หรือพิมพ์ข้อความตอบกลับถึงคุณปอนด์ได้ที่นี่เลยนะคะ
      </p>

      {/* Emoji Stickers Bar */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
        <span className="text-xs text-pink-400 font-medium whitespace-nowrap mr-1">
          สติกเกอร์:
        </span>
        {stickers.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAddEmoji(s)}
            className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-sm transition-transform active:scale-90 border border-pink-100 shrink-0"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSaveWish} className="space-y-3">
        <div className="relative">
          <textarea
            value={wishText}
            onChange={(e) => setWishText(e.target.value)}
            placeholder="พิมพ์คำอธิษฐานวันเกิด หรือข้อความน่ารักๆ ส่งให้ปอนด์ตรงนี้ได้เลยน้า... 🎀"
            rows={3}
            className="clay-input w-full p-3.5 text-sm sm:text-base text-[#4A3E3D] placeholder:text-pink-300 resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-pink-400/80">
            {wishText.length > 0 ? `${wishText.length} ตัวอักษร` : "บันทึกเก็บไว้เปิดอ่านได้เสมอ"}
          </span>

          <button
            type="submit"
            disabled={!wishText.trim()}
            className="clay-button px-5 py-2 text-xs sm:text-sm font-medium flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>ส่งข้อความ 💖</span>
          </button>
        </div>
      </form>

      {/* Success Alert */}
      <AnimatePresence>
        {justSaved && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 p-2.5 rounded-2xl bg-pink-50 border border-pink-200 text-xs font-semibold text-[#FF3366] flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 text-emerald-500" />
            <span>บันทึกคำอวยพรเรียบร้อยแล้วค่ะ! ปอนด์รออ่านอยู่นะคะ 🎀</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Wishes List */}
      {savedWishes.length > 0 && (
        <div className="mt-5 pt-4 border-t border-pink-100">
          <p className="text-xs font-bold text-[#FF4D85] mb-2 flex items-center gap-1">
            <Heart className="w-3 h-3 fill-pink-500" />
            <span>ข้อความที่บันทึกไว้ ({savedWishes.length}):</span>
          </p>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {savedWishes.map((w, index) => (
              <div
                key={index}
                className="p-2.5 rounded-2xl bg-pink-50/70 border border-pink-100 text-xs text-[#4A3E3D] flex items-start gap-2"
              >
                <Sparkles className="w-3 h-3 text-pink-400 shrink-0 mt-0.5" />
                <p className="flex-1 break-words">{w}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
