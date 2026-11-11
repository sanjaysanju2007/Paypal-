import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

export default function AnimatedBackground() {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#060913]' : 'bg-gradient-to-b from-[#F0F6FF] via-[#EAF2FF] to-[#F5F9FF]'
    }`}>
      {/* Subtle Grid Matrix Texture */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${isDark ? 'opacity-[0.035]' : 'opacity-[0.045]'}`}
        style={{
          backgroundImage: `radial-gradient(${isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(37, 99, 235, 0.35)'} 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* Primary Ambient Cyan Orb - Top Right */}
      <motion.div
        className={`absolute -top-[15%] right-[5%] w-[580px] h-[580px] rounded-full blur-[130px] pointer-events-none transition-all duration-500 ${
          isDark ? 'opacity-25' : 'opacity-40'
        }`}
        style={{
          background: isDark
            ? 'radial-gradient(circle, #38BDF8 0%, #2563EB 40%, transparent 70%)'
            : 'radial-gradient(circle, #93C5FD 0%, #60A5FA 45%, transparent 70%)'
        }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, 40, -30, 0],
                y: [0, -35, 25, 0],
                scale: [1, 1.08, 0.95, 1]
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Secondary Deep Sapphire / Soft Blue Orb - Center Left */}
      <motion.div
        className={`absolute top-[35%] -left-[10%] w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none transition-all duration-500 ${
          isDark ? 'opacity-20' : 'opacity-35'
        }`}
        style={{
          background: isDark
            ? 'radial-gradient(circle, #2563EB 0%, #0D1527 50%, transparent 75%)'
            : 'radial-gradient(circle, #BFDBFE 0%, #DBEAFE 50%, transparent 75%)'
        }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, -30, 45, 0],
                y: [0, 40, -25, 0],
                scale: [1, 0.94, 1.06, 1]
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Third Ambient Orb - Bottom Right */}
      <motion.div
        className={`absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-500 ${
          isDark ? 'opacity-20' : 'opacity-35'
        }`}
        style={{
          background: isDark
            ? 'radial-gradient(circle, #38BDF8 0%, #1E40AF 60%, transparent 80%)'
            : 'radial-gradient(circle, #BAE6FD 0%, #93C5FD 60%, transparent 80%)'
        }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, -40, 20, 0],
                y: [0, -30, 30, 0],
                scale: [1, 1.1, 0.92, 1]
              }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Subtle Top-Center Lighting Vignette */}
      <div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[350px] blur-[100px] pointer-events-none transition-all duration-500 ${
          isDark ? 'opacity-15' : 'opacity-30'
        }`}
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at top, #38BDF8 0%, transparent 70%)'
            : 'radial-gradient(ellipse at top, #60A5FA 0%, transparent 70%)'
        }}
      />
    </div>
  );
}
