"use client";

import { motion } from "framer-motion";
import { Delete, RotateCcw } from "lucide-react";
import { playPopSound } from "@/utils/audioSystem";

interface KeypadProps {
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  disabled?: boolean;
}

export default function Keypad({
  onDigitPress,
  onBackspace,
  onClear,
  disabled = false,
}: KeypadProps) {
  const handlePress = (val: string) => {
    if (disabled) return;
    playPopSound();
    onDigitPress(val);
  };

  const handleBackspacePress = () => {
    if (disabled) return;
    playPopSound();
    onBackspace();
  };

  const handleClearPress = () => {
    if (disabled) return;
    playPopSound();
    onClear();
  };

  const keys = [
    { label: "1", action: () => handlePress("1") },
    { label: "2", action: () => handlePress("2") },
    { label: "3", action: () => handlePress("3") },
    { label: "4", action: () => handlePress("4") },
    { label: "5", action: () => handlePress("5") },
    { label: "6", action: () => handlePress("6") },
    { label: "7", action: () => handlePress("7") },
    { label: "8", action: () => handlePress("8") },
    { label: "9", action: () => handlePress("9") },
    {
      label: "C",
      icon: <RotateCcw className="w-5 h-5 text-pink-400" />,
      action: handleClearPress,
      ariaLabel: "Clear PIN",
    },
    { label: "0", action: () => handlePress("0") },
    {
      label: "⌫",
      icon: <Delete className="w-5 h-5 text-rose-500" />,
      action: handleBackspacePress,
      ariaLabel: "Backspace",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-xs mx-auto w-full px-2">
      {keys.map((k, index) => (
        <motion.button
          key={index}
          type="button"
          disabled={disabled}
          onClick={k.action}
          aria-label={k.ariaLabel || k.label}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.92, y: 2 }}
          className="clay-keypad-btn h-13 sm:h-15 flex items-center justify-center font-fredoka font-semibold text-xl sm:text-2xl cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none"
        >
          {k.icon || k.label}
        </motion.button>
      ))}
    </div>
  );
}
