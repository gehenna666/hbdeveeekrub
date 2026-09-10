"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Clock, Calendar } from "lucide-react";
import { birthdayConfig } from "@/config/birthdayConfig";

export default function LoveCounter() {
  const [timePassed, setTimePassed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const parseRelationshipDate = (dateStr: string) => {
    const parts = dateStr.split("-").map(Number);
    if (parts.length === 3) {
      let [year, month, day] = parts;
      if (year > 2400) year -= 543;
      return new Date(year, month - 1, day).getTime();
    }
    return new Date(dateStr).getTime();
  };

  const formatThaiDate = (dateStr: string) => {
    const parts = dateStr.split("-").map(Number);
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const months = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
      ];
      const beYear = year < 2400 ? year + 543 : year;
      return `${day} ${months[month - 1]} ${beYear}`;
    }
    return dateStr;
  };

  useEffect(() => {
    const startDate = parseRelationshipDate(birthdayConfig.relationshipStartDate);

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, now - startDate);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimePassed({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: "วัน", value: timePassed.days, icon: <Calendar className="w-3.5 h-3.5" /> },
    { label: "ชั่วโมง", value: timePassed.hours, icon: <Clock className="w-3.5 h-3.5" /> },
    { label: "นาที", value: timePassed.minutes, icon: <Clock className="w-3.5 h-3.5" /> },
    { label: "วินาที", value: timePassed.seconds, icon: <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" /> },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-6 p-5 sm:p-7 rounded-3xl clay-card text-center relative overflow-hidden">
      {/* Decorative Ribbon */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-[#FF4D85] text-xs font-bold mb-3 shadow-inner">
        <Heart className="w-3.5 h-3.5 fill-pink-500" />
        <span>Love Days Counter • เวลาแห่งความรักของเรา</span>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-[#4A3E3D] mb-1">
        เรารักและมีกันมาแล้ว 💖
      </h3>
      <p className="text-xs text-[#8A7A78] mb-5">
        นับตั้งแต่วันแรกที่หัวใจสองดวงได้มาเจอกัน ({formatThaiDate(birthdayConfig.relationshipStartDate)})
      </p>

      {/* 4 Counter Pills */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3.5">
        {timeUnits.map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-2xl bg-gradient-to-b from-white to-[#FFF0F5] border border-pink-200/90 shadow-sm"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <span className="font-fredoka text-xl sm:text-3xl font-bold text-[#FF3366] leading-none mb-1">
              {item.value.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[#8A7A78] font-medium">
              {item.icon}
              <span>{item.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
