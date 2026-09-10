"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/common/FloatingHearts";
import MusicPlayer from "@/components/common/MusicPlayer";
import SparkleCursor from "@/components/common/SparkleCursor";
import LoveRushButton from "@/components/common/LoveRushButton";
import MagicVaultScreen from "@/components/step1-passcode/MagicVaultScreen";
import GreetingCardScreen from "@/components/step2-greeting/GreetingCardScreen";
import WishScreen from "@/components/step3-wish/WishScreen";
import PortfolioScreen from "@/components/step3-portfolio/PortfolioScreen";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Scroll to top when changing steps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FFEBF2] to-[#FFF0F6]">
      {/* Ambient Floating Hearts & Sparkles */}
      <FloatingHearts />
      <SparkleCursor />

      {/* Floating 3D Vinyl Turntable Music Player */}
      <MusicPlayer />

      {/* Floating Love Rush Combo Button */}
      <LoveRushButton />

      {/* Multi-Step Story Container with Smooth Animated Transitions */}
      <AnimatePresence mode="wait">
        {/* Step 1: Magic Birthday Vault (11.09.2004 Puzzle + Key Wind-up + 143 BPM Heart Scan) */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <MagicVaultScreen onUnlock={() => setCurrentStep(2)} />
          </motion.div>
        )}

        {/* Step 2: Heart Tracing & Candle Blow & Letter Reveal */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            transition={{ duration: 0.55 }}
            className="w-full"
          >
            <GreetingCardScreen
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          </motion.div>
        )}

        {/* Step 3: Dedicated Wish & Reply Station */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            transition={{ duration: 0.55 }}
            className="w-full"
          >
            <WishScreen
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          </motion.div>
        )}

        {/* Step 4: Couple Photo Portfolio with Floating Photos in BG */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.55 }}
            className="w-full"
          >
            <PortfolioScreen
              onBackToWish={() => setCurrentStep(3)}
              onResetToStart={() => setCurrentStep(1)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
