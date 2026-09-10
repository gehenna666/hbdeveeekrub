"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, ChevronUp, ChevronDown, HelpCircle, KeyRound, Fingerprint, Music } from "lucide-react";
import { playPopSound, playSparkleSound, playSuccessSound } from "@/utils/audioSystem";
import confetti from "canvas-confetti";
import HeartKeyLockStage from "./HeartKeyLockStage";

interface MagicVaultScreenProps {
  onUnlock: () => void;
}

const MONTHS = [
  "มกราคม (01)",
  "กุมภาพันธ์ (02)",
  "มีนาคม (03)",
  "เมษายน (04)",
  "พฤษภาคม (05)",
  "มิถุนายน (06)",
  "กรกฎาคม (07)",
  "สิงหาคม (08)",
  "กันยายน (09)",
  "ตุลาคม (10)",
  "พฤศจิกายน (11)",
  "ธันวาคม (12)",
];

export default function MagicVaultScreen({ onUnlock }: MagicVaultScreenProps) {
  // Stage state: "dial" -> "key" -> "biometric" -> "completed"
  const [stage, setStage] = useState<"dial" | "key" | "biometric" | "completed">("dial");

  // Stage 1: Birthday Dial Roller states
  // Initial slightly scrambled date
  const [day, setDay] = useState(10);
  const [monthIdx, setMonthIdx] = useState(7); // สิงหาคม (08)
  const [year, setYear] = useState(2568);
  const [showHint, setShowHint] = useState(false);

  // Randomize initial date values on mount
  useEffect(() => {
    const randomDays = Array.from({ length: 28 }, (_, i) => i + 1).filter((d) => d !== 11);
    const randomMonths = Array.from({ length: 12 }, (_, i) => i).filter((m) => m !== 8);
    const possibleYears = [2565, 2566, 2567, 2568, 2570, 2571, 2572];

    const rDay = randomDays[Math.floor(Math.random() * randomDays.length)];
    const rMonth = randomMonths[Math.floor(Math.random() * randomMonths.length)];
    const rYear = possibleYears[Math.floor(Math.random() * possibleYears.length)];

    setDay(rDay);
    setMonthIdx(rMonth);
    setYear(rYear);
  }, []);

  // Stage 3: Biometric Touch Scan states
  const [isHolding, setIsHolding] = useState(false);
  const [scanProgress, setScanProgress] = useState(0); // 0 to 100
  const [bpm, setBpm] = useState(75);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Check if date matches 11 September 2569 (11/09/2569)
  const isDateCorrect = day === 11 && monthIdx === 8 && year === 2569;

  // When date becomes correct, transition to Stage 2 (Key)
  useEffect(() => {
    if (isDateCorrect && stage === "dial") {
      playSuccessSound();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#FFD700", "#FF4D85", "#FFFFFF"],
      });

      const timer = setTimeout(() => {
        setStage("key");
        playSparkleSound();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isDateCorrect, stage]);

  // Quick helper: Set birthday date automatically
  const setExactBirthday = () => {
    playSparkleSound();
    setDay(11);
    setMonthIdx(8); // กันยายน (09)
    setYear(2569);
  };

  // Dial change handlers
  const changeDay = (dir: 1 | -1) => {
    playPopSound();
    setDay((prev) => {
      let next = prev + dir;
      if (next > 31) next = 1;
      if (next < 1) next = 31;
      return next;
    });
  };

  const changeMonth = (dir: 1 | -1) => {
    playPopSound();
    setMonthIdx((prev) => {
      let next = prev + dir;
      if (next >= MONTHS.length) next = 0;
      if (next < 0) next = MONTHS.length - 1;
      return next;
    });
  };

  const changeYear = (dir: 1 | -1) => {
    playPopSound();
    setYear((prev) => {
      let next = prev + dir;
      if (next > 2575) next = 2565;
      if (next < 2565) next = 2575;
      return next;
    });
  };


  // Stage 3: Biometric Touch Scanner
  const startScanning = () => {
    if (stage !== "biometric") return;
    playPopSound();
    setIsHolding(true);
    let startTime = Date.now();
    const duration = 2000; // 2 seconds

    const updateScan = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setScanProgress(pct);

      // Heart rate BPM rises from 75 to 143 (143 = I Love You!)
      const currentBpm = Math.round(75 + (pct / 100) * 68);
      setBpm(currentBpm);

      if (pct < 100) {
        animFrameRef.current = requestAnimationFrame(updateScan);
      } else {
        // Complete!
        setStage("completed");
        playSuccessSound();

        confetti({
          particleCount: 100,
          spread: 85,
          origin: { y: 0.5 },
          colors: ["#FF3366", "#FF69B4", "#FFD700", "#FFFFFF"],
        });

        setTimeout(() => {
          onUnlock();
        }, 1600);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateScan);
  };

  const stopScanning = () => {
    if (stage === "completed") return;
    setIsHolding(false);
    setScanProgress(0);
    setBpm(75);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="clay-card w-full max-w-md p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Hello Kitty Birthday Princess Avatar */}
        <div className="relative mb-3">
          <motion.div
            className="w-22 h-22 sm:w-26 sm:h-26 rounded-full overflow-hidden border-4 border-white shadow-lg relative bg-pink-100"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          >
            <Image
              src="/images/kitty-birthday.jpg"
              alt="Hello Kitty Birthday Princess"
              fill
              sizes="(max-width: 640px) 96px, 112px"
              className="object-cover"
              priority
            />
          </motion.div>
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-pink-200">
            <span className="text-lg">🎀</span>
          </div>
        </div>

        {/* Step Indicator Badges (1 -> 2 -> 3) */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              stage === "dial"
                ? "bg-[#FF4D85] text-white shadow-md scale-105"
                : "bg-pink-100 text-pink-500"
            }`}
          >
            1. ปริศนาวันเกิด
          </span>
          <span className="text-pink-300">→</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              stage === "key"
                ? "bg-[#FF4D85] text-white shadow-md scale-105"
                : "bg-pink-100 text-pink-500"
            }`}
          >
            2. ไขลานกุญแจ
          </span>
          <span className="text-pink-300">→</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              stage === "biometric" || stage === "completed"
                ? "bg-[#FF4D85] text-white shadow-md scale-105"
                : "bg-pink-100 text-pink-500"
            }`}
          >
            3. สแกนหัวใจ
          </span>
        </div>

        {/* ================= STAGE 1: BIRTHDAY DIAL ROLLERS ================= */}
        {stage === "dial" && (
          <motion.div
            key="stage-dial"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full flex flex-col items-center"
          >
            <h1 className="text-xl sm:text-2xl font-bold text-[#4A3E3D] mb-1">
              ตู้เซฟวันเกิดคนพิเศษ 🎂
            </h1>
            <p className="text-xs sm:text-sm text-[#8A7A78] mb-5 max-w-xs">
              หมุนวงล้อให้ตรงกับ **วัน เดือน และปีเกิด** ของคนเก่ง เพื่อปลดปล่อยกุญแจทองโบว์คิตตี้
            </p>

            {/* 3 Clay Rollers Container */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-xs mb-5">
              {/* Roller 1: Day */}
              <div className="flex flex-col items-center p-2 rounded-2xl bg-white/90 border-2 border-pink-200/80 shadow-sm">
                <span className="text-[10px] font-bold text-pink-400 mb-1">วันที่</span>
                <button
                  type="button"
                  onClick={() => changeDay(1)}
                  className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-500 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <span className="font-fredoka text-2xl font-bold text-[#FF3366] my-2">
                  {day.toString().padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => changeDay(-1)}
                  className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-500 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Roller 2: Month */}
              <div className="flex flex-col items-center p-2 rounded-2xl bg-white/90 border-2 border-pink-200/80 shadow-sm">
                <span className="text-[10px] font-bold text-pink-400 mb-1">เดือน</span>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-500 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <div className="h-10 flex items-center justify-center my-1 text-center">
                  <span className="font-mali text-xs sm:text-sm font-bold text-[#FF3366] leading-tight px-1">
                    {MONTHS[monthIdx].split(" ")[0]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-500 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Roller 3: Year */}
              <div className="flex flex-col items-center p-2 rounded-2xl bg-white/90 border-2 border-pink-200/80 shadow-sm">
                <span className="text-[10px] font-bold text-pink-400 mb-1">ปี พ.ศ.</span>
                <button
                  type="button"
                  onClick={() => changeYear(1)}
                  className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-500 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <span className="font-fredoka text-xl font-bold text-[#FF3366] my-2">
                  {year}
                </span>
                <button
                  type="button"
                  onClick={() => changeYear(-1)}
                  className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-500 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Target Alignment Status */}
            <div className="mb-4">
              {isDateCorrect ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="px-4 py-1.5 rounded-full bg-pink-100 text-[#FF3366] text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>วันเกิด 11 กันยายน 2569 ถูกต้อง! กำลังเสกกุญแจทอง... ✨</span>
                </motion.div>
              ) : (
                <span className="text-xs text-pink-400">
                  หมุนให้ตรง: 11 • กันยายน • 2569 🎂
                </span>
              )}
            </div>

            {/* Hint / Auto-Set Button */}
            <button
              type="button"
              onClick={setExactBirthday}
              className="text-xs text-pink-400 hover:text-[#FF3366] flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-3 rounded-full hover:bg-pink-50"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>ต้องการให้ช่วยหมุนวันเกิดทันทีไหมคะ? ✨</span>
            </button>
          </motion.div>
        )}

        {/* ================= STAGE 2: DRAG & WIND-UP KEY ================= */}
        {stage === "key" && (
          <motion.div
            key="stage-key"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="w-full flex flex-col items-center"
          >
            <HeartKeyLockStage onUnlocked={() => setStage("biometric")} />
          </motion.div>
        )}

        {/* ================= STAGE 3: BIOMETRIC HEART TOUCH SCAN ================= */}
        {(stage === "biometric" || stage === "completed") && (
          <motion.div
            key="stage-bio"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-[#FF3366] text-xs font-bold mb-2 shadow-inner">
              <Fingerprint className="w-3.5 h-3.5" />
              <span>ยืนยันตัวตนเจ้าของหัวใจ 💖</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#4A3E3D] mb-1">
              สแกนหัวใจคนพิเศษ ✨
            </h2>
            <p className="text-xs sm:text-sm text-[#8A7A78] mb-5 max-w-xs">
              {stage === "completed"
                ? "ตรวจพบลายนิ้วมือเจ้าของหัวใจปอนด์ Match 100%! 🎉"
                : "แตะนิ้วหรือกดเมาส์ค้างไว้ที่หัวใจ 2 วินาที เพื่อปลดล็อกกล่องความรัก"}
            </p>

            {/* Interactive Biometric Heart Touch Pad */}
            <div className="relative flex flex-col items-center my-3">
              {/* Circular Progress Ring */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="#FFE4EC"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="#FF3366"
                    strokeWidth="8"
                    strokeDasharray="402"
                    strokeDashoffset={402 - (402 * scanProgress) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Center Heart Touch Button */}
                <motion.button
                  type="button"
                  onPointerDown={startScanning}
                  onPointerUp={stopScanning}
                  onPointerLeave={stopScanning}
                  whileTap={{ scale: 0.92 }}
                  className={`absolute w-24 h-24 rounded-full flex flex-col items-center justify-center cursor-pointer select-none transition-all shadow-lg border-2 ${
                    isHolding
                      ? "bg-gradient-to-br from-rose-500 to-[#FF3366] border-white text-white shadow-rose-300"
                      : "bg-white border-pink-200 text-[#FF4D85] hover:bg-pink-50"
                  }`}
                  style={{
                    boxShadow: isHolding
                      ? "0 0 25px rgba(255, 51, 102, 0.6)"
                      : "4px 6px 14px rgba(255, 120, 160, 0.2)",
                  }}
                >
                  <Fingerprint
                    className={`w-9 h-9 ${
                      isHolding ? "animate-pulse text-white" : "text-[#FF4D85]"
                    }`}
                  />
                  <span className="text-[10px] font-bold mt-0.5">
                    {isHolding ? `${scanProgress}%` : "กดค้างไว้"}
                  </span>
                </motion.button>
              </div>

              {/* Heartbeat BPM Counter */}
              <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs font-semibold text-[#FF3366]">
                <Heart className={`w-3.5 h-3.5 fill-pink-500 ${isHolding ? "animate-ping" : "animate-pulse"}`} />
                <span>อัตราการเต้นของหัวใจ: {bpm} BPM {bpm >= 140 ? "(143 I Love You!)" : ""}</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
