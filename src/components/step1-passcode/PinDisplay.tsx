"use client";

import { motion } from "framer-motion";

interface PinDisplayProps {
  pinLength: number;
  totalDigits: number;
  isError: boolean;
  isSuccess: boolean;
}

export default function PinDisplay({
  pinLength,
  totalDigits,
  isError,
  isSuccess,
}: PinDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-4 sm:my-6">
      {Array.from({ length: totalDigits }).map((_, index) => {
        const isFilled = index < pinLength;
        return (
          <motion.div
            key={index}
            animate={
              isError
                ? { x: [-8, 8, -6, 6, -3, 3, 0], backgroundColor: "#FFE5EC" }
                : isSuccess
                ? { scale: [1, 1.25, 1], backgroundColor: "#FFD1E3" }
                : {}
            }
            transition={{ duration: 0.4 }}
            className={`w-9 h-11 sm:w-11 sm:h-13 rounded-2xl flex items-center justify-center border-2 transition-all duration-200 ${
              isFilled
                ? "border-[#FF4D85] bg-white shadow-md scale-105"
                : "border-pink-200 bg-[#FFF5F8] shadow-inner"
            }`}
          >
            {isFilled ? (
              <motion.span
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-lg sm:text-xl select-none"
              >
                🎀
              </motion.span>
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-pink-200 opacity-60" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
