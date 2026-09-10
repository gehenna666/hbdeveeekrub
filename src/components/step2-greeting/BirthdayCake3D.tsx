"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wind, Heart, Mic, MicOff } from "lucide-react";
import { playCandleBlowSound, playSparkleSound, playPopSound } from "@/utils/audioSystem";
import confetti from "canvas-confetti";

interface BirthdayCake3DProps {
  onBlowComplete?: () => void;
}

export default function BirthdayCake3D({ onBlowComplete }: BirthdayCake3DProps) {
  const [isBlown, setIsBlown] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const handleBlowCandle = useCallback(() => {
    if (isBlown) return;
    setIsBlown(true);
    playCandleBlowSound();

    // Stop mic if active
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsMicActive(false);

    // Multi-stage fireworks confetti
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.45 },
      colors: ["#FFD700", "#FF69B4", "#FF1493", "#FFFFFF", "#FF3366"],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.5 },
        colors: ["#FFD700", "#FF69B4", "#FFF0F5"],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.5 },
        colors: ["#FFD700", "#FF69B4", "#FFF0F5"],
      });
      playSparkleSound();
    }, 300);

    if (onBlowComplete) {
      setTimeout(() => {
        onBlowComplete();
      }, 1200);
    }
  }, [isBlown, onBlowComplete]);

  // Start microphone listener
  const toggleMicrophone = async () => {
    playPopSound();
    if (isMicActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setIsMicActive(false);
      return;
    }

    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      setIsMicActive(true);

      const checkBlow = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setMicLevel(normalized);

        // If strong breath / blow sound is detected (over 45 threshold)
        if (normalized > 42) {
          handleBlowCandle();
          return;
        }

        animFrameRef.current = requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch {
      setMicError("ไม่สามารถเข้าถึงไมโครโฟนได้ (แตะเค้กเพื่อเป่าได้เลยน้า)");
      setIsMicActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center my-6 relative">
      {/* 3D Clay Cake Container */}
      <div
        onClick={handleBlowCandle}
        className="relative cursor-pointer select-none group flex flex-col items-center"
      >
        {/* Candle Flame & Spectacular Magic Aura */}
        <div className="relative -mb-1 flex flex-col items-center">
          {!isBlown ? (
            <div className="relative flex items-center justify-center">
              {/* Pulsing Radial Light Aura */}
              <div className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-amber-300/40 via-pink-400/30 to-rose-400/20 blur-xl animate-pulse pointer-events-none" />

              {/* Orbiting Golden Star Dust */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute w-20 h-20 pointer-events-none"
              >
                <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs select-none">✨</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] select-none text-amber-300">⭐</span>
              </motion.div>

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                className="absolute w-24 h-24 pointer-events-none"
              >
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] select-none">💖</span>
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs select-none">✨</span>
              </motion.div>

              {/* Multi-layered Candle Flame */}
              <motion.div
                animate={{
                  scale: isMicActive && micLevel > 15 ? [1.1, 0.8, 1.2] : [1, 1.18, 0.95, 1.08, 1],
                  y: [0, -2, 1, -1, 0],
                  filter: [
                    "drop-shadow(0 0 10px #FF8C00) drop-shadow(0 0 20px #FF4500)",
                    "drop-shadow(0 0 16px #FFA500) drop-shadow(0 0 30px #FF1493)",
                    "drop-shadow(0 0 10px #FF8C00) drop-shadow(0 0 20px #FF4500)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                className="w-5 h-8 rounded-full bg-gradient-to-t from-[#FF3300] via-[#FFA500] to-[#FFFFFF] relative flex items-center justify-center shadow-lg"
              >
                {/* Inner Incandescent Core */}
                <div className="w-2.5 h-4 rounded-full bg-white/90 blur-[1px]" />
              </motion.div>
            </div>
          ) : (
            /* Smoke and Sweet Heart Wisps */
            <AnimatePresence>
              <div className="relative flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 1, y: 0, scale: 0.5 }}
                  animate={{ opacity: 0, y: -45, scale: 2.2 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-base select-none flex items-center gap-1"
                >
                  <span>💭</span>
                  <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                  <span>✨</span>
                </motion.div>
              </div>
            </AnimatePresence>
          )}

          {/* Candle Body */}
          <div className="w-3 h-8 rounded-sm bg-gradient-to-r from-pink-300 via-white to-pink-200 shadow-md border border-pink-100 flex flex-col justify-between py-1 relative z-10">
            <span className="w-full h-0.5 bg-rose-400 opacity-60" />
            <span className="w-full h-0.5 bg-rose-400 opacity-60" />
            <span className="w-full h-0.5 bg-rose-400 opacity-60" />
          </div>
        </div>

        {/* Cake Top Layer (Strawberry Frosting & Cream) */}
        <div
          className="w-40 sm:w-48 h-13 rounded-t-3xl relative z-10 flex items-center justify-around px-3 border-2 border-white"
          style={{
            background: "linear-gradient(180deg, #FFE8F0 0%, #FFD1E0 100%)",
            boxShadow: "inset 0 4px 6px rgba(255, 255, 255, 0.9), 0 4px 12px rgba(255, 107, 151, 0.25)",
          }}
        >
          {/* Strawberries on cake */}
          <span className="text-lg sm:text-xl -mt-4 animate-bounce">🍓</span>
          <span className="text-sm text-pink-500 font-bold -mt-3">🎀</span>
          <span className="text-lg sm:text-xl -mt-4 animate-bounce" style={{ animationDelay: "0.2s" }}>🍓</span>
        </div>

        {/* Cake Bottom Layer (Vanilla Sponge & Cream Fill) */}
        <div
          className="w-48 sm:w-56 h-16 -mt-2 rounded-b-3xl relative flex items-center justify-center border-2 border-white overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #FFF0F5 0%, #FFE0EB 60%, #FFCADB 100%)",
            boxShadow:
              "inset 0 2px 5px rgba(255, 255, 255, 0.95), 0 10px 22px rgba(255, 140, 170, 0.28)",
          }}
        >
          {/* Cake Decorative Piping */}
          <div className="absolute top-1 w-full flex justify-around text-xs opacity-70">
            <span>🤍</span>
            <span>🤍</span>
            <span>🤍</span>
            <span>🤍</span>
            <span>🤍</span>
            <span>🤍</span>
          </div>

          <span className="text-xs sm:text-sm font-bold text-[#FF4D85] tracking-wider mt-2">
            HBD 11.09.2569 🎂
          </span>
        </div>

        {/* Cake Plate */}
        <div
          className="w-56 sm:w-64 h-4.5 rounded-full -mt-1 bg-white border-2 border-pink-100"
          style={{
            boxShadow: "0 8px 18px rgba(255, 143, 177, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.9)",
          }}
        />
      </div>

      {/* Blow Candle Action Buttons & Microphone Toggle */}
      <div className="mt-5 flex flex-col items-center gap-2.5">
        {!isBlown ? (
          <>
            <motion.button
              onClick={handleBlowCandle}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="clay-button px-6 py-2.5 text-xs sm:text-sm flex items-center gap-2 font-bold cursor-pointer shadow-lg animate-bounce"
            >
              <Wind className="w-4 h-4 animate-pulse" />
              <span>อธิษฐานในใจแล้วแตะเพื่อเป่าเทียน 🎂💨</span>
            </motion.button>

            {/* Microphone Blow Detector Button */}
            <button
              type="button"
              onClick={toggleMicrophone}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isMicActive
                  ? "bg-rose-50 text-rose-600 border-rose-300 shadow-inner"
                  : "bg-white/80 text-pink-500 border-pink-200 hover:bg-pink-50"
              }`}
            >
              {isMicActive ? (
                <>
                  <Mic className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>กำลังฟังเสียงลม... เป่าใส่ไมค์ได้เลยค่ะ! ({micLevel}%)</span>
                </>
              ) : (
                <>
                  <MicOff className="w-3.5 h-3.5 text-pink-400" />
                  <span>เปิดไมค์เพื่อเป่าลมใส่จอจริง 🎙️</span>
                </>
              )}
            </button>

            {/* Live Mic Level Bar when active */}
            {isMicActive && (
              <div className="w-44 h-1.5 bg-pink-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${micLevel}%` }}
                />
              </div>
            )}

            {micError && (
              <p className="text-[11px] text-rose-500">{micError}</p>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-5 py-2 rounded-full bg-pink-100 text-[#FF3366] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-inner"
          >
            <Sparkles className="w-4 h-4" />
            <span>คำอธิษฐานส่งถึงดวงดาวแล้วนะคะ ✨ จดหมายรักกำลังเปิดออก...</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
