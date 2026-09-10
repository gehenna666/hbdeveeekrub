"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Music, RotateCw, Check } from "lucide-react";
import {
  playSparkleSound,
  playSuccessSound,
  playKeyInsertSound,
  playKeyWindRatchetSound,
} from "@/utils/audioSystem";
import confetti from "canvas-confetti";

interface HeartKeyLockStageProps {
  onUnlocked: () => void;
}

/**
 * Reusable High-Fidelity 3D Golden Kitty Key Graphic
 */
function GoldenKittyKeySVG({
  className = "w-20 h-40",
  style = {},
  isDocked = false,
}: {
  className?: string;
  style?: React.CSSProperties;
  isDocked?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 90 180"
      className={className}
      style={{
        filter: isDocked
          ? "drop-shadow(4px 10px 18px rgba(0, 0, 0, 0.45)) drop-shadow(0 0 14px rgba(251, 191, 36, 0.6))"
          : "drop-shadow(0 8px 16px rgba(217, 119, 6, 0.4))",
        ...style,
      }}
    >
      <defs>
        {/* Multi-stop Luxury Gold Gradient */}
        <linearGradient id="gkGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFDF0" />
          <stop offset="20%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="75%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        {/* Polished Cylindrical Shaft Gradient with center shine */}
        <linearGradient id="gkShaftGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="25%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#FFFDF0" />
          <stop offset="75%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        {/* Faceted Pink Ruby Heart Gemstone */}
        <radialGradient id="gkRubyCenter" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FF80AB" />
          <stop offset="35%" stopColor="#FF1744" />
          <stop offset="75%" stopColor="#D50000" />
          <stop offset="100%" stopColor="#880E4F" />
        </radialGradient>
      </defs>

      {/* ================= KEY BOW (HANDLE) ================= */}
      <g transform="translate(45, 38)">
        {/* Hello Kitty Ears with cute pink inner pads */}
        <path
          d="M -22 -14 L -28 -28 L -12 -20 Z"
          fill="url(#gkGoldGrad)"
          stroke="#FFFDF0"
          strokeWidth="1.2"
        />
        <path d="M -23 -16 L -26 -25 L -15 -20 Z" fill="#FF80AB" />

        <path
          d="M 22 -14 L 28 -28 L 12 -20 Z"
          fill="url(#gkGoldGrad)"
          stroke="#FFFDF0"
          strokeWidth="1.2"
        />
        <path d="M 23 -16 L 26 -25 L 15 -20 Z" fill="#FF80AB" />

        {/* Left Bow Loop */}
        <path
          d="M 0 0 C -18 -22 -38 -15 -34 6 C -30 24 -12 18 0 4 Z"
          fill="url(#gkGoldGrad)"
          stroke="#FFFDF0"
          strokeWidth="1.5"
        />
        <ellipse cx="-18" cy="2" rx="4.5" ry="7.5" fill="#78350F" opacity="0.35" />

        {/* Right Bow Loop */}
        <path
          d="M 0 0 C 18 -22 38 -15 34 6 C 30 24 12 18 0 4 Z"
          fill="url(#gkGoldGrad)"
          stroke="#FFFDF0"
          strokeWidth="1.5"
        />
        <ellipse cx="18" cy="2" rx="4.5" ry="7.5" fill="#78350F" opacity="0.35" />

        {/* Center Knot Ring & Ruby Heart */}
        <circle cx="0" cy="2" r="10.5" fill="url(#gkGoldGrad)" stroke="#FFFDF0" strokeWidth="1.5" />
        <circle cx="0" cy="2" r="6.5" fill="url(#gkRubyCenter)" stroke="#FFF" strokeWidth="1" />
        {/* Specular Glint */}
        <circle cx="-1.8" cy="0.2" r="2" fill="#FFF" opacity="0.9" />
      </g>

      {/* ================= KEY COLLAR ================= */}
      {/* Upper Ring */}
      <rect
        x="36"
        y="70"
        width="18"
        height="5"
        rx="2.5"
        fill="url(#gkGoldGrad)"
        stroke="#FFFDF0"
        strokeWidth="0.8"
      />
      {/* Lower Ring */}
      <rect
        x="34"
        y="76"
        width="22"
        height="6"
        rx="3"
        fill="url(#gkGoldGrad)"
        stroke="#FFFDF0"
        strokeWidth="0.8"
      />

      {/* ================= KEY SHAFT ================= */}
      <rect
        x="40"
        y="82"
        width="10"
        height="74"
        rx="5"
        fill="url(#gkShaftGrad)"
        stroke="#78350F"
        strokeWidth="0.8"
      />

      {/* ================= KEY BIT / TEETH ================= */}
      <g transform="translate(49, 120)">
        {/* Antique Stepped Wards with Heart Cutout */}
        <path
          d="M 0 0 L 23 0 L 23 10 L 15 10 L 15 16 L 23 16 L 23 32 L 0 32 Z"
          fill="url(#gkGoldGrad)"
          stroke="#78350F"
          strokeWidth="1"
        />
        {/* Heart Cutout in Key Bit */}
        <path
          d="M 8 18 C 8 16 6 14 4 14 C 2 14 0 16 0 18 C 0 21 4 24 8 26 C 12 24 16 21 16 18 C 16 16 14 14 12 14 C 10 14 8 16 8 18 Z"
          fill="#FFFDF0"
          transform="scale(0.55) translate(14, 14)"
        />
      </g>

      {/* Rounded Key Tip */}
      <circle cx="45" cy="158" r="4.5" fill="url(#gkGoldGrad)" />
    </svg>
  );
}

let noteIdCounter = 0;

export default function HeartKeyLockStage({ onUnlocked }: HeartKeyLockStageProps) {
  const [isDocked, setIsDocked] = useState(false);
  const [windCount, setWindCount] = useState(0); // 0, 1, 2, 3
  const [isWinding, setIsWinding] = useState(false);
  const [floatingNotes, setFloatingNotes] = useState<
    { id: number; symbol: string; x: number; y: number }[]
  >([]);

  const lockZoneRef = useRef<HTMLDivElement | null>(null);

  // Trigger key insertion
  const dockKey = () => {
    if (isDocked) return;
    playKeyInsertSound();
    playSparkleSound();
    setIsDocked(true);

    // Celebratory sparkles around keyhole
    confetti({
      particleCount: 30,
      spread: 55,
      origin: { y: 0.45 },
      colors: ["#FFD700", "#FF69B4", "#FFF0F5"],
      ticks: 150,
      gravity: 0.8,
    });
  };

  // Handle winding key turn
  const handleTurnKey = () => {
    if (!isDocked || windCount >= 3 || isWinding) return;

    setIsWinding(true);
    const nextCount = windCount + 1;
    setWindCount(nextCount);
    playKeyWindRatchetSound(nextCount);

    // Spawn floating musical notes
    const symbols = ["🎵", "🎶", "💖", "✨", "🎀"];
    const newNote = {
      id: ++noteIdCounter,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      x: (Math.random() - 0.5) * 80,
      y: -30 - Math.random() * 40,
    };
    setFloatingNotes((prev) => [...prev.slice(-8), newNote]);

    setTimeout(() => {
      setIsWinding(false);
    }, 450);

    // When 3 winds completed -> unlock!
    if (nextCount === 3) {
      setTimeout(() => {
        playSuccessSound();
        confetti({
          particleCount: 90,
          spread: 85,
          origin: { y: 0.5 },
          colors: ["#FF3366", "#FFD700", "#FF69B4", "#FFFFFF"],
        });

        setTimeout(() => {
          onUnlocked();
        }, 1300);
      }, 500);
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Stage Title & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-pink-100 text-amber-800 text-xs font-bold mb-1.5 shadow-inner border border-amber-200/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>
            {!isDocked
              ? "กุญแจทองคำโบว์คิตตี้พร้อมแล้ว ✨"
              : `ไขลานหัวใจ (${windCount}/3 รอบ) 🎵`}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#4A3E3D] mb-0.5">
          {!isDocked ? "ไขลานกล่องดนตรีหัวใจ 🎀" : "หมุนกุญแจเพื่อไขลาน 🗝️"}
        </h2>
        <p className="text-xs sm:text-sm text-[#8A7A78] max-w-xs mx-auto">
          {!isDocked
            ? "ลากลูกกุญแจทองไปเสียบตรงกลางหัวใจ หรือแตะที่กุญแจ"
            : windCount < 3
            ? "แตะที่ตัวกุญแจตรงกลางเพื่อหมุนไขลานให้ครบ 3 รอบ"
            : "ปลดล็อกกล่องดนตรีสำเร็จแล้ว! กำลังเข้าสู่การสแกนหัวใจ... 🎉"}
        </p>
      </motion.div>

      {/* ========================================================= */}
      {/* 3D HEART MUSIC BOX & KEYHOLE ESCUTCHEON */}
      {/* ========================================================= */}
      <div
        ref={lockZoneRef}
        className="relative my-3 flex items-center justify-center"
        style={{ width: 270, height: 260 }}
      >
        {/* Ambient Magical Glow */}
        <motion.div
          animate={{
            scale: isDocked ? [1, 1.1, 1] : [1, 1.04, 1],
            opacity: isDocked ? [0.45, 0.75, 0.45] : [0.3, 0.5, 0.3],
          }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute inset-4 rounded-full bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-200 blur-2xl -z-10"
        />

        {/* 3D SVG Heart Padlock */}
        <svg
          viewBox="0 0 260 250"
          className="w-full h-full drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 14px 28px rgba(233, 30, 99, 0.28))" }}
        >
          <defs>
            {/* Gold metallic rim gradient */}
            <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF4D0" />
              <stop offset="25%" stopColor="#FACC15" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="75%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#854D0E" />
            </linearGradient>

            {/* Glossy Rose-Pink Enamel Heart body */}
            <radialGradient id="heartBody" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FF7597" />
              <stop offset="40%" stopColor="#FF3366" />
              <stop offset="75%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9F1239" />
            </radialGradient>

            {/* Specular high-gloss sheen reflection */}
            <linearGradient id="heartSheen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Keyhole Escutcheon Medallion */}
            <radialGradient id="escutcheonGold" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#A16207" />
            </radialGradient>

            {/* Keyhole Interior Shadow */}
            <radialGradient id="keyholeDeep" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#1E0713" />
              <stop offset="60%" stopColor="#2E0A1D" />
              <stop offset="100%" stopColor="#4A102E" />
            </radialGradient>

            {/* Golden Internal Light Beam */}
            <radialGradient id="internalLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
              <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Gold Padlock Bezel */}
          <path
            d="M 130 55 C 130 30 102 12 70 12 C 34 12 12 40 12 80 C 12 135 72 185 130 236 C 188 185 248 135 248 80 C 248 40 226 12 190 12 C 158 12 130 30 130 55 Z"
            fill="url(#goldRim)"
            stroke="#FEF08A"
            strokeWidth="3"
          />

          {/* Inner Glossy Enamel Heart Body */}
          <path
            d="M 130 62 C 130 38 104 22 74 22 C 42 22 22 47 22 82 C 22 132 78 178 130 225 C 182 178 238 132 238 82 C 238 47 218 22 186 22 C 156 22 130 38 130 62 Z"
            fill="url(#heartBody)"
          />

          {/* Curved Glass Specular Highlight (Top Left Shoulder) */}
          <path
            d="M 74 26 C 48 26 30 46 30 76 C 30 105 50 135 78 160 C 65 135 52 105 52 76 C 52 50 64 32 82 28 Z"
            fill="url(#heartSheen)"
          />

          {/* Hello Kitty Bow Accent at top cleft */}
          <g transform="translate(130, 48)">
            {/* Left Bow Loop */}
            <path
              d="M 0 0 C -12 -12 -28 -8 -26 6 C -24 18 -10 14 0 4 Z"
              fill="url(#goldRim)"
              stroke="#FFF"
              strokeWidth="0.8"
            />
            {/* Right Bow Loop */}
            <path
              d="M 0 0 C 12 -12 28 -8 26 6 C 24 18 10 14 0 4 Z"
              fill="url(#goldRim)"
              stroke="#FFF"
              strokeWidth="0.8"
            />
            {/* Center Knot Gem */}
            <circle cx="0" cy="2" r="5" fill="#FF1493" stroke="#FFF" strokeWidth="1" />
          </g>

          {/* =================================================== */}
          {/* ORNATE CENTER ESCUTCHEON (KEYHOLE MEDALLION) */}
          {/* Center coordinate: (130, 125) */}
          {/* =================================================== */}
          <g transform="translate(130, 125)">
            {/* Outer embossed gold scalloped ring */}
            <circle
              cx="0"
              cy="0"
              r="34"
              fill="url(#goldRim)"
              stroke="#FFF"
              strokeWidth="1.5"
              filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
            />
            {/* Inner recessed ring */}
            <circle
              cx="0"
              cy="0"
              r="28"
              fill="url(#escutcheonGold)"
              stroke="#92400E"
              strokeWidth="1"
            />

            {/* 8 Golden Rivet Dots around escutcheon */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <circle
                  key={i}
                  cx={Math.cos(rad) * 31}
                  cy={Math.sin(rad) * 31}
                  r="1.8"
                  fill="#FEF08A"
                  stroke="#854D0E"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* Glowing Keyhole Internal Light */}
            <circle cx="0" cy="0" r="20" fill="url(#internalLight)" />

            {/* The Keyhole Slot (Traditional Antique Keyhole Shape) */}
            <path
              d="M -5 -8 A 8 8 0 1 1 5 -8 L 4 9 C 4 11 2 13 0 13 C -2 13 -4 11 -4 9 Z"
              fill="url(#keyholeDeep)"
              stroke="#FDE047"
              strokeWidth="1"
            />
          </g>
        </svg>

        {/* ========================================================= */}
        {/* WHEN NOT DOCKED: GUIDING PULSE RINGS OVER KEYHOLE */}
        {/* ========================================================= */}
        {!isDocked && (
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            <motion.div
              animate={{ scale: [1, 1.45, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
              className="w-20 h-20 rounded-full border-2 border-amber-300 bg-amber-300/20"
            />
            <div className="absolute text-[10px] font-bold text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-full shadow border border-amber-300 mt-14 whitespace-nowrap">
              เสียบตรงนี้ ✨
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* WHEN DOCKED: FULL REALISTIC KEY PLUGGED INTO THE CENTER */}
        {/* ========================================================= */}
        {isDocked && (
          <div
            className="absolute flex items-center justify-center z-20"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Winding Progress Indicator Ring (3 Petals / Destination Notches: 120°, 240°, 360°) */}
            <div className="absolute w-52 h-52 pointer-events-none">
              {[120, 240, 0].map((deg, idx) => {
                const notchNum = idx + 1;
                const isPassed = windCount >= notchNum;
                const isCurrent = windCount === idx;
                const rad = ((deg - 90) * Math.PI) / 180;
                const x = Math.cos(rad) * 78;
                const y = Math.sin(rad) * 78;

                return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: isCurrent ? [1, 1.2, 1] : isPassed ? 1.1 : 1,
                    }}
                    transition={{
                      repeat: isCurrent ? Infinity : 0,
                      duration: 1.2,
                    }}
                    className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full flex items-center justify-center font-bold text-xs shadow-lg border transition-all ${
                      isPassed
                        ? "bg-gradient-to-br from-emerald-400 to-green-500 text-white border-white scale-110 ring-2 ring-emerald-300"
                        : isCurrent
                        ? "bg-gradient-to-br from-amber-300 to-yellow-500 text-amber-950 border-white ring-2 ring-amber-300 scale-105"
                        : "bg-white/95 text-pink-400 border-pink-200"
                    }`}
                    style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  >
                    {isPassed ? <Check className="w-4 h-4" /> : notchNum}
                  </motion.div>
                );
              })}
            </div>

            {/* Floating Musical Notes spawned when turning */}
            <AnimatePresence>
              {floatingNotes.map((note) => (
                <motion.span
                  key={note.id}
                  initial={{ opacity: 1, scale: 0.6, x: 0, y: 0 }}
                  animate={{
                    opacity: 0,
                    scale: 1.4,
                    x: note.x,
                    y: note.y - 45,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="absolute text-2xl pointer-events-none z-30 drop-shadow-md"
                >
                  {note.symbol}
                </motion.span>
              ))}
            </AnimatePresence>

            {/* Glowing halo where key enters the keyhole */}
            <div className="absolute w-12 h-12 rounded-full bg-amber-400/30 blur-md pointer-events-none animate-pulse" />

            {/* THE ACTUAL REALISTIC GOLDEN KEY PLUGGED RIGHT IN THE CENTER */}
            {/* Pivots around keyhole center (50% 75%) so turning looks like turning in the lock */}
            <motion.div
              onClick={handleTurnKey}
              animate={{
                rotate: windCount * 120,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 18,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer relative z-20 flex flex-col items-center justify-center group"
              style={{
                transformOrigin: "50% 75%", // Pivot around keyhole entry!
              }}
              title="แตะที่ตัวกุญแจเพื่อหมุนไขลาน"
            >
              {/* The exact full realistic 3D Golden Kitty Key */}
              <GoldenKittyKeySVG
                className="w-20 h-36 sm:w-22 sm:h-40 drop-shadow-2xl"
                isDocked={true}
              />

              {/* Rotate hint badge attached to the key handle */}
              {windCount < 3 && (
                <motion.div
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -top-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 border border-amber-300 whitespace-nowrap"
                >
                  <RotateCw className={`w-3 h-3 ${isWinding ? "animate-spin" : ""}`} />
                  <span>แตะเพื่อหมุน ↻</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* REALISTIC 3D GOLDEN KEY WAITING TO BE INSERTED */}
      {/* ========================================================= */}
      {!isDocked && (
        <div className="mt-1 flex flex-col items-center">
          {/* Draggable & Clickable 3D Golden Key Graphic */}
          <motion.div
            drag
            dragSnapToOrigin={false}
            dragConstraints={{ top: -220, bottom: 30, left: -100, right: 100 }}
            onDragEnd={(_, info) => {
              // If dragged upwards towards the heart lock
              if (info.offset.y < -40 || Math.abs(info.offset.x) > 30) {
                dockKey();
              }
            }}
            whileHover={{ scale: 1.08 }}
            whileDrag={{ scale: 1.2, cursor: "grabbing" }}
            onClick={dockKey}
            animate={{
              y: [-5, 5, -5],
              rotate: [-2, 2, -2],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            }}
            className="cursor-grab active:cursor-grabbing relative flex flex-col items-center px-6 py-3 rounded-3xl bg-gradient-to-b from-white/95 to-pink-50/90 border-2 border-amber-200/90 shadow-xl"
            style={{
              boxShadow:
                "0 12px 28px -4px rgba(245, 158, 11, 0.35), inset 0 2px 4px rgba(255,255,255,0.9)",
            }}
          >
            {/* Sparkle Badge */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 p-1 rounded-full shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            {/* FULL REALISTIC 3D GOLDEN KITTY KEY SVG */}
            <GoldenKittyKeySVG className="w-16 h-32 sm:w-18 sm:h-36" isDocked={false} />

            {/* Instruction Label */}
            <div className="mt-1.5 text-center">
              <span className="text-xs font-bold text-amber-900 block">
                กุญแจทองคำโบว์คิตตี้ 🗝️
              </span>
              <span className="text-[10px] text-pink-500 font-semibold">
                (ลากขึ้นไปเสียบตรงกลางหัวใจ หรือแตะที่นี่)
              </span>
            </div>
          </motion.div>

          {/* Direct Tap Button Helper */}
          <button
            type="button"
            onClick={dockKey}
            className="mt-3 px-4 py-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-pink-200 shadow-sm active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>แตะตรงนี้เพื่อเสียบกุญแจทันที ✨</span>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* WINDING CONTROLS WHEN DOCKED */}
      {/* ========================================================= */}
      {isDocked && (
        <div className="mt-3 flex flex-col items-center">
          <button
            type="button"
            onClick={handleTurnKey}
            disabled={windCount >= 3 || isWinding}
            className={`clay-button px-6 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95 ${
              windCount >= 3
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                : "animate-pulse"
            }`}
          >
            {windCount < 3 ? (
              <>
                <Music className="w-4 h-4 text-pink-500" />
                <span>แตะหมุนไขลานกุญแจ (รอบที่ {windCount + 1}/3) 🎵</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>ไขลานสำเร็จแล้ว! กำลังเปิดกล่อง... ✨</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
