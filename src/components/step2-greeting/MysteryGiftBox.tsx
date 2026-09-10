"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Crown, Gift, Heart } from "lucide-react";
import { playRibbonUntieSound, playSuccessSound, playSparkleSound } from "@/utils/audioSystem";
import confetti from "canvas-confetti";

export default function MysteryGiftBox() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenBox = () => {
    if (isOpen) return;
    playRibbonUntieSound();
    setIsOpen(true);

    setTimeout(() => {
      playSuccessSound();
      playSparkleSound();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FF69B4", "#FFF0F5", "#FF1493"],
      });
    }, 450);
  };

  return (
    <div className="w-full max-w-sm mx-auto my-6 p-5 rounded-3xl bg-gradient-to-br from-pink-50/80 via-white to-amber-50/80 border-2 border-pink-200/80 shadow-lg text-center select-none relative overflow-hidden">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-100 text-[#FF3366] text-xs font-bold mb-2 shadow-inner border border-pink-200">
        <Gift className="w-3.5 h-3.5" />
        <span>ของขวัญเซอร์ไพรส์จากปอนด์ 🎁✨</span>
      </div>

      <h4 className="text-base sm:text-lg font-bold text-[#4A3E3D] mb-1">
        กล่องของขวัญปริศนา 🎀
      </h4>
      <p className="text-xs text-[#8A7A78] mb-4">
        {!isOpen
          ? "แตะที่กล่องหรือโบว์เพื่อแกะริบบิ้นเปิดของขวัญ"
          : "เปิดกล่องของขวัญสำเร็จแล้ว! ✨"}
      </p>

      {/* Interactive 3D Gift Box */}
      <div className="relative h-44 flex items-center justify-center">
        {/* Floating Crown when opened */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.3 }}
              animate={{ opacity: 1, y: -25, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 18,
                delay: 0.3,
              }}
              className="absolute z-30 flex flex-col items-center"
            >
              {/* Floating Princess Crown */}
              <div className="relative">
                <motion.div
                  animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 via-amber-300 to-yellow-500 border-2 border-white shadow-xl flex items-center justify-center text-amber-950"
                  style={{
                    boxShadow:
                      "0 0 25px rgba(251, 191, 36, 0.7), inset 0 2px 4px rgba(255,255,255,0.8)",
                  }}
                >
                  <Crown className="w-10 h-10 text-amber-900 fill-amber-300" />
                </motion.div>
                <div className="absolute -top-1 -right-1 text-base animate-bounce">
                  ✨
                </div>
              </div>

              {/* Message from Pond */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-3 px-4 py-2 rounded-2xl bg-white/95 border-2 border-pink-200 shadow-md max-w-xs"
              >
                <span className="text-xs font-bold text-[#FF3366] block">
                  👑 มงกุฎเจ้าหญิงอีฟ 👑
                </span>
                <span className="text-[11px] text-[#4A3E3D] font-semibold leading-relaxed">
                  "สุขสันต์วันเกิดนะเจ้าหญิงคนเก่งของปป เค้าขอยกให้เธอเป็นเจ้าหญิงของเค้าไปอีกนานๆ 💖"
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Gift Box Graphic */}
        <motion.div
          onClick={handleOpenBox}
          whileHover={!isOpen ? { scale: 1.05 } : {}}
          whileTap={!isOpen ? { scale: 0.95 } : {}}
          className={`cursor-pointer relative flex flex-col items-center justify-center transition-all ${isOpen ? "opacity-75" : ""
            }`}
        >
          {/* Lid */}
          <motion.div
            animate={
              isOpen
                ? { y: -45, rotate: -25, opacity: 0.3 }
                : { y: 0, rotate: 0, opacity: 1 }
            }
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-32 h-10 rounded-t-xl bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 border-2 border-white shadow-md relative z-20 flex items-center justify-center"
          >
            {/* Ribbon on Lid */}
            <div className="w-5 h-full bg-gradient-to-b from-amber-200 to-yellow-400 border-x border-amber-500/40" />

            {/* Big Hello Kitty Satin Ribbon Bow on Top */}
            {!isOpen && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-5 flex items-center justify-center"
              >
                <span className="text-3xl drop-shadow-md">🎀</span>
              </motion.div>
            )}
          </motion.div>

          {/* Box Body */}
          <div className="w-28 h-24 rounded-b-xl bg-gradient-to-b from-pink-300 via-pink-400 to-rose-500 border-2 border-t-0 border-white shadow-xl relative flex items-center justify-center overflow-hidden">
            {/* Vertical Golden Ribbon */}
            <div className="w-5 h-full bg-gradient-to-b from-amber-200 to-yellow-400 border-x border-amber-500/40" />
            {/* Horizontal Golden Ribbon */}
            <div className="absolute w-full h-5 bg-gradient-to-r from-amber-200 to-yellow-400 border-y border-amber-500/40" />

            {/* Sparkles on Box */}
            <div className="absolute top-2 left-2 text-xs opacity-70">✨</div>
            <div className="absolute bottom-2 right-2 text-xs opacity-70">💖</div>
          </div>
        </motion.div>
      </div>

      {/* Untie Hint */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpenBox}
          className="mt-2 text-xs text-pink-500 font-bold hover:underline cursor-pointer flex items-center gap-1 mx-auto"
        >
          <Sparkles className="w-3 h-3" />
          <span>แตะตรงนี้เพื่อเปิดของขวัญทันที</span>
        </button>
      )}
    </div>
  );
}
