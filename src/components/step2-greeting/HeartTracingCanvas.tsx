"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { playSparkleSound, playSuccessSound } from "@/utils/audioSystem";
import confetti from "canvas-confetti";

interface HeartTracingCanvasProps {
  onUnlockCard: () => void;
}

export default function HeartTracingCanvas({ onUnlockCard }: HeartTracingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const hitPointsRef = useRef<boolean[]>([]);
  const userTrailRef = useRef<{ x: number; y: number }[]>([]);
  const totalTargetPoints = 36; // 36 well-spaced points around the heart

  // Generate target heart contour coordinates
  const getHeartPoints = useCallback((width: number, height: number) => {
    const points: { x: number; y: number }[] = [];
    const centerX = width / 2;
    const centerY = height / 2 - 10;
    const scale = Math.min(width, height) / 36;

    for (let i = 0; i < totalTargetPoints; i++) {
      const t = (i / totalTargetPoints) * Math.PI * 2;
      // Mathematical Heart parametric equation
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      points.push({
        x: centerX + x * scale,
        y: centerY + y * scale,
      });
    }
    return points;
  }, [totalTargetPoints]);

  // Redraw canvas with guidelines, completed glowing segments, and user brush stroke
  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const points = getHeartPoints(width, height);

    ctx.clearRect(0, 0, width, height);

    // 1. Draw dashed pink guideline for the remaining untraced parts
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 143, 177, 0.35)";
    ctx.lineWidth = 4;
    ctx.setLineDash([6, 6]);
    ctx.lineCap = "round";

    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();

    // 2. Draw glowing connected stroke through all hit points
    const hitIndices = hitPointsRef.current;
    ctx.save();
    for (let i = 0; i < totalTargetPoints; i++) {
      const nextIdx = (i + 1) % totalTargetPoints;
      if (hitIndices[i] && hitIndices[nextIdx]) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[nextIdx].x, points[nextIdx].y);
        ctx.strokeStyle = "#FF3366";
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.shadowColor = "#FF69B4";
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Inner white shine
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[nextIdx].x, points[nextIdx].y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.shadowBlur = 0;
        ctx.stroke();
      }
    }
    ctx.restore();

    // 3. Draw checkpoint dots
    points.forEach((pt, index) => {
      const isHit = hitIndices[index];
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isHit ? 7 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isHit ? "#FF3366" : "rgba(255, 182, 193, 0.6)";
      ctx.shadowColor = isHit ? "#FF4D85" : "transparent";
      ctx.shadowBlur = isHit ? 10 : 0;
      ctx.fill();

      if (isHit) {
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    });

    // 4. Draw recent active user brush trail
    if (userTrailRef.current.length > 1) {
      ctx.save();
      ctx.beginPath();
      const trail = userTrailRef.current;
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x, trail[i].y);
      }
      ctx.strokeStyle = "rgba(255, 77, 133, 0.85)";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "#FF3366";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();
    }
  }, [getHeartPoints, totalTargetPoints]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    hitPointsRef.current = new Array(totalTargetPoints).fill(false);
    drawGuide();
  }, [drawGuide, totalTargetPoints]);

  // Check collision with heart path
  const checkHit = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isUnlocked) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Add to active trail
    userTrailRef.current.push({ x, y });
    if (userTrailRef.current.length > 25) {
      userTrailRef.current.shift();
    }

    const points = getHeartPoints(rect.width, rect.height);
    const hitRadius = 32; // Comfortable hit radius for fingers and cursor

    let updated = false;
    points.forEach((pt, idx) => {
      const dist = Math.hypot(pt.x - x, pt.y - y);
      if (dist < hitRadius && !hitPointsRef.current[idx]) {
        hitPointsRef.current[idx] = true;
        updated = true;
      }
    });

    if (updated) {
      const hitCount = hitPointsRef.current.filter(Boolean).length;
      // Calculate true percentage
      let pct = Math.round((hitCount / totalTargetPoints) * 100);

      // Require full coverage: user must complete all or practically all points (>= 35 of 36)
      if (hitCount >= totalTargetPoints - 1) {
        pct = 100;
      }

      setProgress(pct);

      if (hitCount % 4 === 0) {
        playSparkleSound();
      }

      drawGuide();

      // Only unlock when fully drawn 100%!
      if (pct >= 100) {
        triggerUnlock();
      }
    } else {
      drawGuide();
    }
  };

  const triggerUnlock = () => {
    if (isUnlocked) return;
    setIsUnlocked(true);
    setProgress(100);
    playSuccessSound();

    // Fill all remaining points visually
    hitPointsRef.current.fill(true);
    drawGuide();

    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#FF4D85", "#FF85A2", "#FFFFFF", "#FF3366"],
    });

    setTimeout(() => {
      onUnlockCard();
    }, 1300);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDrawing(true);
    userTrailRef.current = [];
    checkHit(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    checkHit(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    userTrailRef.current = [];
    drawGuide();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center px-4 py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="clay-card w-full p-6 sm:p-8 flex flex-col items-center relative overflow-hidden"
      >
        {/* Kitty Wand Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-[#FF4D85] text-xs font-semibold mb-3 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          <span>วาดหัวใจให้เต็มดวงเพื่อเปิดการ์ด 🎀</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#4A3E3D] mb-1">
          ใช้หัวใจเปิดของขวัญ 💖
        </h2>
        <p className="text-xs sm:text-sm text-[#8A7A78] mb-4 max-w-xs">
          ใช้นิ้วหรือเมาส์วาดตามรอยเส้นประรูปหัวใจให้ครบเต็มดวง 100% เพื่อเปิดอ่านการ์ดอวยพร
        </p>

        {/* Tracing Canvas Box */}
        <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[320px] rounded-3xl bg-gradient-to-b from-white to-[#FFF0F5] border-2 border-pink-200 shadow-inner flex items-center justify-center touch-none select-none overflow-hidden cursor-crosshair">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-full"
          />

          {/* Center Status Info */}
          <div className="absolute pointer-events-none flex flex-col items-center">
            <span className="text-3xl sm:text-4xl select-none animate-bounce">
              {progress === 100 ? "💖" : "🎀"}
            </span>
            <span
              className={`text-xs font-bold mt-1 px-3 py-1 rounded-full ${
                progress === 100
                  ? "bg-pink-100 text-[#FF3366] shadow-sm animate-pulse"
                  : "text-pink-500 bg-white/80"
              }`}
            >
              {isUnlocked
                ? "หัวใจเต็มดวงแล้ว! กำลังเปิด... ✨"
                : progress === 100
                ? "ครบ 100% แล้ว! 🎉"
                : `วาดให้ครบเต็มดวง: ${progress}%`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-[280px] mt-4">
          <div className="flex justify-between text-[11px] font-bold text-pink-400 mb-1 px-1">
            <span>ความสมบูรณ์ของหัวใจ</span>
            <span className={progress === 100 ? "text-[#FF3366]" : ""}>{progress}% / 100%</span>
          </div>
          <div className="h-3.5 w-full bg-pink-100 rounded-full overflow-hidden p-0.5 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 via-[#FF4D85] to-[#FF3366] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>
        </div>

        {/* Instant Unlock Helper */}
        <div className="mt-4 pt-2">
          <button
            type="button"
            onClick={triggerUnlock}
            className="text-xs text-pink-400 hover:text-[#FF3366] flex items-center gap-1 transition-colors underline decoration-dotted underline-offset-4 cursor-pointer"
          >
            <Heart className="w-3 h-3" />
            <span>วาดไม่ถนัด? แตะตรงนี้เพื่อเปิดการ์ดทันที ✨</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
