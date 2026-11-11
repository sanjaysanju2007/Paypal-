import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function AnimatedBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#060913]">
      {/* Subtle Grid Matrix Texture */}
      <div 
        className="absolute inset-0 opacity-[0.035]" 
        style={{
          backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.45) 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* Primary Ambient Cyan Orb - Top Right */}
      <motion.div
        className="absolute -top-[15%] right-[5%] w-[580px] h-[580px] rounded-full blur-[130px] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #38BDF8 0%, #2563EB 40%, transparent 70%)'
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

      {/* Secondary Deep Sapphire Orb - Center Left */}
      <motion.div
        className="absolute top-[35%] -left-[10%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #2563EB 0%, #0D1527 50%, transparent 75%)'
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
        className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #38BDF8 0%, #1E40AF 60%, transparent 80%)'
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
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[350px] opacity-15 blur-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, #38BDF8 0%, transparent 70%)'
        }}
      />
    </div>
  );
}
