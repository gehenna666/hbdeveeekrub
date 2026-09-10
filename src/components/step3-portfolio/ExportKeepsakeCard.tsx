"use client";

import { useState } from "react";
import { Download, Sparkles, Image as ImageIcon, Check } from "lucide-react";
import { playSuccessSound, playSparkleSound } from "@/utils/audioSystem";
import confetti from "canvas-confetti";

export default function ExportKeepsakeCard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const generateAndDownloadCard = () => {
    setIsGenerating(true);
    playSparkleSound();

    setTimeout(() => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1440;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          setIsGenerating(false);
          return;
        }

        // 1. Background Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1440);
        bgGrad.addColorStop(0, "#FFF0F5");
        bgGrad.addColorStop(0.3, "#FFE4EC");
        bgGrad.addColorStop(0.7, "#FFF5F7");
        bgGrad.addColorStop(1, "#FFD6E0");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1080, 1440);

        // 2. Decorative Gold & White Border
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 18;
        ctx.strokeRect(36, 36, 1080 - 72, 1440 - 72);

        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 4;
        ctx.strokeRect(54, 54, 1080 - 108, 1440 - 108);

        // 3. Header Crown & Bow
        ctx.fillStyle = "#FF3366";
        ctx.font = "bold 58px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("👑", 540, 150);

        ctx.font = "bold 32px sans-serif";
        ctx.fillStyle = "#B45309";
        ctx.fillText("OFFICIAL BIRTHDAY CERTIFICATE", 540, 210);

        ctx.font = "bold 56px sans-serif";
        ctx.fillStyle = "#FF1493";
        ctx.fillText("Happy Birthday My Princess", 540, 290);

        // 4. Date & Special One Ribbon
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.roundRect(240, 340, 600, 70, 35);
        ctx.fill();
        ctx.strokeStyle = "#FBCFE8";
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = "#FF3366";
        ctx.font = "bold 32px sans-serif";
        ctx.fillText("11 กันยายน 2004 • วันเกิดคนพิเศษ", 540, 388);

        // 5. Center Love Frame Box
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.beginPath();
        ctx.roundRect(100, 460, 880, 640, 40);
        ctx.fill();
        ctx.strokeStyle = "#FDA4AF";
        ctx.lineWidth = 4;
        ctx.stroke();

        // 6. Sweet Message
        ctx.fillStyle = "#4A3E3D";
        ctx.font = "bold 38px sans-serif";
        ctx.fillText("แด่แฟนสาวที่น่ารักที่สุดในโลกของปอนด์ 💖", 540, 560);

        ctx.font = "28px sans-serif";
        ctx.fillStyle = "#6B7280";
        const lines = [
          "ขอบคุณที่เกิดมาให้ปอนด์ได้รัก ได้ดูแลในทุกๆ วันนะ",
          "ขอให้วันเกิดปีนี้เต็มไปด้วยรอยยิ้ม ความสุข และความสดใส",
          "ไม่ว่าจะผ่านไปกี่ปี ปอนด์สัญญาว่าจะอยู่ข้างๆ เธอเสมอ",
          "รักแฟนที่สุดในโลกเลยนะเจ้าหญิง 🎂✨",
        ];

        lines.forEach((line, i) => {
          ctx.fillText(line, 540, 650 + i * 65);
        });

        // 7. Mini Stats Badges
        const badges = [
          "🎂 11.09.2004",
          "💖 143 BPM Love Match",
          "🎟️ Lifetime VIP Pass",
        ];
        badges.forEach((b, i) => {
          ctx.fillStyle = "#FFF1F2";
          ctx.beginPath();
          ctx.roundRect(140 + i * 270, 970, 240, 60, 30);
          ctx.fill();
          ctx.strokeStyle = "#FECDD3";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = "#E11D48";
          ctx.font = "bold 20px sans-serif";
          ctx.fillText(b, 260 + i * 270, 1008);
        });

        // 8. Gold Wax Seal
        ctx.beginPath();
        ctx.arc(540, 1220, 80, 0, Math.PI * 2);
        const goldGrad = ctx.createRadialGradient(520, 1200, 10, 540, 1220, 80);
        goldGrad.addColorStop(0, "#FEF08A");
        goldGrad.addColorStop(0.5, "#F59E0B");
        goldGrad.addColorStop(1, "#B45309");
        ctx.fillStyle = goldGrad;
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 44px sans-serif";
        ctx.fillText("POND", 540, 1225);
        ctx.font = "bold 20px sans-serif";
        ctx.fillText("FOREVER LOVE", 540, 1255);

        // 9. Footer Note
        ctx.fillStyle = "#9CA3AF";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText("Designed with endless love by Pond for Birthday Princess 2026 🎀", 540, 1370);

        // Trigger Download
        const link = document.createElement("a");
        link.download = "HBD-Princess-From-Pond.png";
        link.href = canvas.toDataURL("image/png");
        link.click();

        setIsGenerating(false);
        setDownloaded(true);
        playSuccessSound();

        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.7 },
          colors: ["#FFD700", "#FF4D85", "#FFFFFF"],
        });

        setTimeout(() => setDownloaded(false), 4000);
      } catch {
        setIsGenerating(false);
      }
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 p-5 rounded-3xl bg-white/90 border-2 border-pink-200 shadow-lg text-center select-none">
      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-[#FF3366] text-white flex items-center justify-center mx-auto mb-2 shadow-md">
        <ImageIcon className="w-6 h-6" />
      </div>

      <h4 className="text-base sm:text-lg font-bold text-[#4A3E3D] mb-1">
        บันทึกการ์ดวันเกิดเป็นภาพที่ระลึก 🖼️✨
      </h4>
      <p className="text-xs text-[#8A7A78] mb-4">
        ดาวน์โหลดภาพการ์ดวันเกิดความละเอียดสูง (1080x1440) ไว้เก็บในเครื่องหรือลง IG Story
      </p>

      <button
        type="button"
        onClick={generateAndDownloadCard}
        disabled={isGenerating}
        className="clay-button w-full py-3 px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
      >
        {downloaded ? (
          <>
            <Check className="w-4 h-4 text-emerald-600" />
            <span>บันทึกรูปลงเครื่องเรียบร้อยแล้ว! 🎉</span>
          </>
        ) : isGenerating ? (
          <>
            <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
            <span>กำลังเรนเดอร์ภาพการ์ดความคมชัดสูง...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลดภาพการ์ดวันเกิด (PNG) 📸</span>
          </>
        )}
      </button>
    </div>
  );
}
