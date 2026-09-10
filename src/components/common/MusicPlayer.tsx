"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Heart, Music } from "lucide-react";
import { musicBoxSynth, playPopSound } from "@/utils/audioSystem";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    playPopSound();
    if (isPlaying) {
      // Pause
      musicBoxSynth.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Play
      musicBoxSynth.start(0.25);
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    // Attempt auto-start on first user interaction anywhere on the window
    const handleFirstInteraction = () => {
      if (!isPlaying) {
        musicBoxSynth.start(0.25);
        setIsPlaying(true);
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      musicBoxSynth.stop();
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2">
      {/* Fallback audio element for custom MP3 if user adds one in public/audio/bgm.mp3 */}
      <audio ref={audioRef} loop src="/audio/bgm.mp3" preload="none" />

      {/* Floating Notes when playing */}
      <AnimatePresence>
        {isPlaying && (
          <div className="relative pointer-events-none">
            <motion.span
              className="absolute -top-6 -left-4 text-xs select-none"
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], y: -26, x: -10, scale: 1.2 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
            >
              🎵
            </motion.span>
            <motion.span
              className="absolute -top-8 left-1 text-xs select-none"
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], y: -30, x: 12, scale: 1 }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0.8, ease: "easeOut" }}
            >
              💖
            </motion.span>
          </div>
        )}
      </AnimatePresence>

      {/* Current Song Title Pill */}
      <AnimatePresence>
        {(showTooltip || isPlaying) && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-pink-100 text-xs text-[#4A3E3D] whitespace-nowrap font-medium"
          >
            <Music className="w-3 h-3 text-[#FF4D85] animate-spin-slow" />
            <span>Happy Birthday Music Box 🎂</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Claymorphic Turntable Button */}
      <motion.button
        onClick={toggleMusic}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative group p-2.5 sm:p-3 rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
        style={{
          background: isPlaying
            ? "linear-gradient(145deg, #FFE1EC 0%, #FFB6D0 100%)"
            : "linear-gradient(145deg, #FFFFFF 0%, #FFF0F5 100%)",
          boxShadow: isPlaying
            ? "6px 8px 18px rgba(255, 107, 151, 0.35), -4px -4px 12px rgba(255, 255, 255, 0.95), inset 2px 2px 4px rgba(255, 255, 255, 0.8)"
            : "5px 6px 14px rgba(255, 150, 180, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.95)",
          border: "2px solid rgba(255, 255, 255, 0.9)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Toggle Birthday Music"
      >
        {/* Animated Outer Pulse Ring */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-full border-2 border-pink-400 animate-ping opacity-30 pointer-events-none" />
        )}

        {/* Vinyl Disc */}
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2A1E26] flex items-center justify-center relative overflow-hidden shadow-inner ${
            isPlaying ? "animate-spin-slow" : ""
          }`}
          style={{
            background: "radial-gradient(circle, #3D2B35 25%, #1F151B 70%, #4D3342 100%)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Vinyl Grooves */}
          <div className="absolute inset-1 rounded-full border border-pink-400/20" />
          <div className="absolute inset-2 rounded-full border border-pink-400/15" />

          {/* Vinyl Center Pink Label */}
          <div className="w-4 h-4 rounded-full bg-[#FF69B4] flex items-center justify-center border border-white/60">
            <Heart className="w-2.5 h-2.5 text-white fill-white" />
          </div>
        </div>

        {/* Small Volume Icon Badge */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#FF4D85] text-white flex items-center justify-center shadow-md border border-white">
          {isPlaying ? (
            <Volume2 className="w-3 h-3 animate-pulse" />
          ) : (
            <VolumeX className="w-3 h-3" />
          )}
        </div>
      </motion.button>
    </div>
  );
}
