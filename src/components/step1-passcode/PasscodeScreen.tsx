"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { HelpCircle, Sparkles, Heart, Lock } from "lucide-react";
import { birthdayConfig } from "@/config/birthdayConfig";
import { playSuccessSound, playPopSound } from "@/utils/audioSystem";
import PinDisplay from "./PinDisplay";
import Keypad from "./Keypad";
import HeartLockAnimation from "./HeartLockAnimation";

interface PasscodeScreenProps {
  onUnlock: () => void;
}

export default function PasscodeScreen({ onUnlock }: PasscodeScreenProps) {
  const [pin, setPin] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const targetCode = birthdayConfig.passcode; // "1192004"

  const triggerSuccessConfetti = () => {
    playSuccessSound();
    // Confetti hearts and pink sparkles
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF4D85", "#FF85A2", "#FFB6C1", "#FFFFFF", "#FFE4EC"],
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FF3366", "#FF69B4", "#FFF0F5"],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FF3366", "#FF69B4", "#FFF0F5"],
      });
    }, 250);
  };

  const handleInputDigit = useCallback(
    (digit: string) => {
      if (pin.length >= targetCode.length || isSuccess) return;
      const nextPin = pin + digit;
      setPin(nextPin);

      if (nextPin.length === targetCode.length || nextPin === "1192569" || nextPin === "11092569") {
        if (nextPin === targetCode || nextPin === "11092569" || nextPin === "1192569") {
          setIsSuccess(true);
        } else {
          // Wrong passcode
          setIsError(true);
          setTimeout(() => {
            setPin("");
            setIsError(false);
          }, 800);
        }
      }
    },
    [pin, isSuccess, targetCode, onUnlock]
  );

  const handleBackspace = useCallback(() => {
    if (isSuccess) return;
    setPin((prev) => prev.slice(0, -1));
  }, [isSuccess]);

  const handleClear = useCallback(() => {
    if (isSuccess) return;
    setPin("");
  }, [isSuccess]);

  // Physical keyboard listener for desktop and laptop convenience
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        playPopSound();
        handleInputDigit(e.key);
      } else if (e.key === "Backspace") {
        playPopSound();
        handleBackspace();
      } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInputDigit, handleBackspace, handleClear]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="clay-card w-full max-w-md p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Kitty Birthday Princess Avatar */}
        <div className="relative mb-3">
          <motion.div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg relative bg-pink-100"
            animate={{ y: [0, -6, 0] }}
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
          {/* Sparkling Bow Badge */}
          <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md border border-pink-200">
            <span className="text-xl">🎀</span>
          </div>
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100/80 text-[#FF4D85] text-xs font-semibold mb-2 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Special Birthday Gift for You</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#4A3E3D] tracking-wide mb-1">
            Happy Birthday นะคะ 💖
          </h1>
          <p className="text-sm text-[#8A7A78] max-w-xs mx-auto">
            ใส่รหัสวันเกิดคนพิเศษ (7 หลัก) เพื่อเปิดกล่องความลับของปอนด์ 🎂
          </p>
        </motion.div>

        {/* PIN Display */}
        <PinDisplay
          pinLength={pin.length}
          totalDigits={targetCode.length}
          isError={isError}
          isSuccess={isSuccess}
        />

        {/* Error / Success Status Feedback */}
        <div className="h-6 -mt-2 mb-3 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isError && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs sm:text-sm font-semibold text-rose-500 flex items-center gap-1"
              >
                <span>รหัสยังไม่ถูกต้องน้า ลองใหม่อีกครั้งนะคะคนดี 🥺🎀</span>
              </motion.p>
            )}
            {isSuccess && (
              <motion.p
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs sm:text-sm font-bold text-[#FF3366] flex items-center gap-1"
              >
                <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                <span>รหัสถูกต้องแล้ว! กำลังเปิดของขวัญให้คนเก่ง... ✨</span>
              </motion.p>
            )}
            {!isError && !isSuccess && (
              <motion.p
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-pink-400/80 flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>ปลดล็อกด้วยความรัก</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* 3D Keypad */}
        <Keypad
          onDigitPress={handleInputDigit}
          onBackspace={handleBackspace}
          onClear={handleClear}
          disabled={isSuccess}
        />

        {/* Hint Trigger Button */}
        <div className="mt-4 pt-2 w-full flex justify-center">
          <button
            type="button"
            onClick={() => {
              playPopSound();
              setShowHint(!showHint);
            }}
            className="text-xs text-[#FF69B4] hover:text-[#FF3366] flex items-center gap-1.5 transition-colors font-medium cursor-pointer py-1 px-3 rounded-full hover:bg-pink-50"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ต้องการคำใบ้ไหมคะ?</span>
          </button>
        </div>

        {/* Hint Modal Popover */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 text-xs text-[#4A3E3D] shadow-sm max-w-xs"
            >
              <p className="font-semibold text-[#FF4D85] mb-1 flex items-center justify-center gap-1">
                <span>💡 คำใบ้จากปอนด์:</span>
              </p>
              <p>{birthdayConfig.hintMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 3D Heart Key Unlock Cutscene */}
      {isSuccess && <HeartLockAnimation onComplete={onUnlock} />}
    </div>
  );
}
