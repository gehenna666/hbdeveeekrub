"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Heart, Gift, Award, CheckCircle } from "lucide-react";
import { playScratchSound, playSuccessSound, playSparkleSound } from "@/utils/audioSystem";
import confetti from "canvas-confetti";

export default function RomanticScratchCard() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastSoundTimeRef = useRef(0);

  // Initialize Golden Scratch Foil
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw rich metallic gold foil with sparkles
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#FFE89C");
    grad.addColorStop(0.3, "#F59E0B");
    grad.addColorStop(0.7, "#D97706");
    grad.addColorStop(1, "#92400E");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Pattern
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Border
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, width - 12, height - 12);

    // Overlay Text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 18px Mali, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ ขูดตรงนี้เพื่อเปิดความลับ ✨", width / 2, height / 2 - 8);

    ctx.font = "bold 13px Mali, sans-serif";
    ctx.fillStyle = "#FFFBEB";
    ctx.fillText("🎟️ สลากทองคำนำโชคของคุณปอนด์", width / 2, height / 2 + 18);
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Play scratch sound throttled
    const now = Date.now();
    if (now - lastSoundTimeRef.current > 70) {
      playScratchSound();
      lastSoundTimeRef.current = now;
    }

    // Check scratch progress occasionally
    if (Math.random() < 0.25) {
      checkProgress();
    }
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentCount += 4;
      }
    }

    const pct = Math.min(100, Math.round((transparentCount / totalPixels) * 100));
    setScratchPercent(pct);

    if (pct > 45) {
      revealFullTicket();
    }
  };

  const revealFullTicket = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    playSuccessSound();
    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FF4D85", "#FFFFFF"],
    });
  };

  return (
    <div className="w-full max-w-md mx-auto my-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white via-pink-50 to-amber-50/50 border-2 border-amber-200/80 shadow-xl relative overflow-hidden text-center">
      {/* Header */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2 shadow-inner border border-amber-200">
        <Trophy className="w-3.5 h-3.5 text-amber-600" />
        <span>สลากรางวัลที่ 1 แห่งความรัก 🎟️✨</span>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-[#4A3E3D] mb-1">
        การ์ดขูดความลับบอกรักคุณปอนด์
      </h3>
      <p className="text-xs text-[#8A7A78] mb-4">
        {!isRevealed
          ? "ใช้นิ้วหรือเมาส์ถูขูดแผ่นฟอยล์ทองคำเพื่อเปิดความลับ"
          : "เปิดเผยข้อความสัญญาใจเรียบร้อยแล้ว! 💖"}
      </p>

      {/* The Scratch Card Container */}
      <div className="relative w-full max-w-xs mx-auto rounded-2xl overflow-hidden shadow-inner border-2 border-amber-300 bg-amber-50 flex items-center justify-center min-h-[160px]">
        {/* Hidden Content Underneath */}
        <div className="absolute inset-0 p-4 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-pink-100 text-center select-none">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-md mb-1.5 border border-white">
            <Award className="w-5 h-5" />
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800">
            ★ POND'S LIFETIME LOVE GUARANTEE ★
          </span>

          <p className="text-xs sm:text-sm font-bold text-[#FF3366] leading-relaxed mt-1 px-1">
            "ปอนด์ขอสัญญาว่าจะรัก ดูแล เอาใจใส่ และเป็นแฟนที่ดีที่สุดของเธอตลอดไป... ไม่มีวันหมดอายุนะเจ้าหญิง 💖"
          </p>

          <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>รางวัลความรักตลอดชีพ 100% Verified</span>
          </div>
        </div>

        {/* Scratchable Canvas Layer */}
        <canvas
          ref={canvasRef}
          width={320}
          height={170}
          className={`relative z-10 w-full h-full cursor-crosshair touch-none transition-opacity duration-700 ${
            isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          onMouseDown={(e) => {
            isDrawingRef.current = true;
            scratch(e.clientX, e.clientY);
          }}
          onMouseMove={(e) => {
            if (isDrawingRef.current) scratch(e.clientX, e.clientY);
          }}
          onMouseUp={() => {
            isDrawingRef.current = false;
          }}
          onTouchStart={(e) => {
            isDrawingRef.current = true;
            if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (isDrawingRef.current && e.touches[0]) {
              scratch(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchEnd={() => {
            isDrawingRef.current = false;
          }}
        />
      </div>

      {/* Progress & Quick Reveal Button */}
      <div className="mt-3 flex items-center justify-between text-xs px-2">
        <span className="text-[11px] text-amber-700 font-bold">
          {isRevealed
            ? "✨ ขูดครบ 100% แล้ว!"
            : `ความคืบหน้า: ${scratchPercent}%`}
        </span>

        {!isRevealed && (
          <button
            type="button"
            onClick={revealFullTicket}
            className="text-[11px] text-pink-500 hover:text-[#FF3366] font-bold underline cursor-pointer"
          >
            เปิดดูทันที ✨
          </button>
        )}
      </div>
    </div>
  );
}
