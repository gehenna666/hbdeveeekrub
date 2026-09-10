"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Ticket, CheckCircle2, Sparkles, Gift, Lock, RotateCcw } from "lucide-react";
import { playPopSound, playSparkleSound, playSuccessSound } from "@/utils/audioSystem";
import confetti from "canvas-confetti";

interface Coupon {
  id: string;
  icon: string;
  title: string;
  desc: string;
  tag: string;
  color: string;
}

const COUPONS_DATA: Coupon[] = [
  {
    id: "buffet",
    icon: "🥩",
    title: "บุฟเฟต์ตามใจคุณ 1 มื้อ",
    desc: "ปอนด์พาไปกินชาบู ปิ้งย่าง หรือโอมากาเสะตามใจ เลือกร้านได้เลย ปอนด์เลี้ยงเองเต็มที่!",
    tag: "Dining Treat",
    color: "from-rose-50 to-pink-50 border-rose-200",
  },
  {
    id: "massage",
    icon: "💆",
    title: "นวดไหล่ & เอาใจ 1 วันเต็ม",
    desc: "เมื่อยตรงไหนปอนด์นวดให้ ห้ามบ่น ห้ามดื้อ",
    tag: "Princess Care",
    color: "from-purple-50 to-pink-50 border-purple-200",
  },
  {
    id: "forgive",
    icon: "🥺",
    title: "ง้อทันทีไม่มีเงื่อนไข",
    desc: "ใช้เมื่อไหร่ปปต้องยอมขอโทษและง้อทันที ไม่เถียงแม้แต่คำเดียว",
    tag: "Instant Peace",
    color: "from-pink-50 to-rose-50 border-pink-200",
  },
  {
    id: "photographer",
    icon: "📸",
    title: "ตากล้องส่วนตัว VIP 20 รูป",
    desc: "ถ่ายรูปให้จนกว่าอ้วนจะพอใจ ปรับมุม หามุมสวย ถือกระเป๋าให้ ไม่บ่นแม้แต่คำเดียว",
    tag: "Photo Session",
    color: "from-amber-50 to-pink-50 border-amber-200",
  },
  {
    id: "movie",
    icon: "🎬",
    title: "ดูหนังเรื่องโปรด & ป้อนขนม",
    desc: "อ้วนเลือกหนังเรื่องที่อยากดู พร้อมป้อนป๊อปคอร์นตลอดเรื่อง",
    tag: "Movie Date",
    color: "from-sky-50 to-pink-50 border-sky-200",
  },
  {
    id: "trip",
    icon: "🚗",
    title: "Road Trip ทะเลหรือภูเขา",
    desc: "อยากไปสูดอากาศที่ไหน เปิดเพลงหวานๆ นอนกอดกันน",
    tag: "Road Trip",
    color: "from-emerald-50 to-pink-50 border-emerald-200",
  },
];

const MAX_COUPONS = 2;

export default function LoveCoupons() {
  const [redeemed, setRedeemed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hbd_love_coupons_v2");
      if (stored) {
        setRedeemed(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const usedCount = Object.values(redeemed).filter(Boolean).length;

  const handleRedeem = (id: string) => {
    if (usedCount >= MAX_COUPONS && !redeemed[id]) return;

    playSuccessSound();
    playSparkleSound();

    const nextState = { ...redeemed, [id]: true };
    setRedeemed(nextState);
    try {
      localStorage.setItem("hbd_love_coupons_v2", JSON.stringify(nextState));
    } catch {
      // Ignore
    }

    confetti({
      particleCount: usedCount + 1 >= MAX_COUPONS ? 80 : 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#FF4D85", "#FFD700", "#FF69B4", "#FFFFFF"],
    });
  };

  const handleResetCoupons = () => {
    playPopSound();
    setRedeemed({});
    try {
      localStorage.removeItem("hbd_love_coupons_v2");
    } catch {
      // Ignore
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-6 sm:p-8 rounded-3xl clay-card text-center flex flex-col items-center">
      {/* Top Tag & Reset Button */}
      <div className="flex items-center gap-2 mb-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-[#FF4D85] text-xs font-bold shadow-inner">
          <Ticket className="w-3.5 h-3.5" />
          <span>Pond&apos;s Love Coupons • เลือกได้สูงสุด {MAX_COUPONS} ใบ 🎟️</span>
        </div>

        {usedCount > 0 && (
          <button
            type="button"
            onClick={handleResetCoupons}
            className="text-[11px] text-pink-400 hover:text-pink-600 flex items-center gap-1 transition-colors cursor-pointer underline py-1 px-2"
            title="รีเซ็ตเพื่อเลือกใหม่ 2 ใบ"
          >
            <RotateCcw className="w-3 h-3" />
            <span>เลือกใหม่</span>
          </button>
        )}
      </div>

      <h3 className="font-mali text-2xl sm:text-3xl font-bold text-[#4A3E3D] mb-1">
        คูปองตามใจแฟนตลอดปี 💖
      </h3>
      <p className="text-xs sm:text-sm text-[#8A7A78] max-w-md mb-3">
        ของขวัญพิเศษจากปอนด์ กำหนดให้เลือกใช้ได้ <b>{MAX_COUPONS} ใบ</b> ที่ชอบที่สุดนะคะ สัญญาว่าจะทำให้เต็มที่เลยค่ะ!
      </p>

      {/* Quota Progress Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-pink-200 text-xs font-bold mb-6 shadow-sm">
        <span className="text-[#FF4D85]">
          เลือกไปแล้ว {usedCount} / {MAX_COUPONS} ใบ
        </span>
        {usedCount >= MAX_COUPONS ? (
          <span className="text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>เลือกครบ 2 ใบแล้ว 🎉</span>
          </span>
        ) : (
          <span className="text-pink-400 font-normal">
            (ยังเลือกได้อีก {MAX_COUPONS - usedCount} ใบ)
          </span>
        )}
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full text-left">
        {COUPONS_DATA.map((coupon) => {
          const isUsed = !!redeemed[coupon.id];
          const isLocked = !isUsed && usedCount >= MAX_COUPONS;

          return (
            <div
              key={coupon.id}
              className={`relative p-5 rounded-2xl border-2 bg-gradient-to-br ${coupon.color} shadow-sm flex flex-col justify-between overflow-hidden transition-transform duration-300 ${
                isLocked ? "opacity-60" : "hover:scale-[1.02]"
              }`}
              style={{
                boxShadow: isUsed
                  ? "inset 0 0 10px rgba(0,0,0,0.04)"
                  : "6px 8px 16px rgba(255, 120, 160, 0.12), -4px -4px 10px rgba(255, 255, 255, 0.9)",
              }}
            >
              {/* Ticket Dotted Border Line */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-6 h-6 rounded-full bg-[#FFF5F8] border-r-2 border-pink-200" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-6 h-6 rounded-full bg-[#FFF5F8] border-l-2 border-pink-200" />

              {/* Coupon Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{coupon.icon}</span>
                  <span className="text-[10px] font-bold text-pink-500 uppercase px-2 py-0.5 rounded-full bg-white/80 border border-pink-100">
                    {coupon.tag}
                  </span>
                </div>

                <h4 className="font-mali font-bold text-base text-[#4A3E3D] mb-1">
                  {coupon.title}
                </h4>
                <p className="text-xs text-[#6A5A58] leading-relaxed font-mali">
                  {coupon.desc}
                </p>
              </div>

              {/* Action / Stamp */}
              <div className="mt-4 pt-3 border-t border-pink-200/50 flex items-center justify-between">
                <span className="text-[10px] text-[#8A7A78] font-medium flex items-center gap-1">
                  <Gift className="w-3 h-3 text-pink-400" />
                  <span>ใช้ได้ไม่จำกัดวันหมดอายุ</span>
                </span>

                {isUsed ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: -8 }}
                    className="px-3 py-1 rounded-xl bg-rose-500 text-white font-fredoka font-bold text-xs tracking-wider shadow-md flex items-center gap-1 border border-white/60"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>REDEEMED ✨</span>
                  </motion.div>
                ) : isLocked ? (
                  <div
                    className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-400 text-xs font-semibold flex items-center gap-1 border border-gray-200 cursor-not-allowed select-none"
                    title="ครบโควตา 2 ใบแล้ว หากต้องการเปลี่ยนให้กด 'เลือกใหม่' ด้านบนค่ะ"
                  >
                    <Lock className="w-3 h-3 text-gray-400" />
                    <span>ครบ 2 ใบแล้ว 🔒</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRedeem(coupon.id)}
                    className="clay-button px-3.5 py-1.5 text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>ใช้คูปองนี้ 💖</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
