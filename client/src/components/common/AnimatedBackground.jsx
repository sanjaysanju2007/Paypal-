import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#071512]">
      {/* Subtle Grid Matrix Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(rgba(124, 255, 178, 0.4) 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* Primary Ambient Mint Orb - Top Right */}
      <motion.div
        className="absolute -top-[15%] right-[5%] w-[580px] h-[580px] rounded-full blur-[130px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7CFFB2 0%, #20D995 40%, transparent 70%)'
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -35, 25, 0],
          scale: [1, 1.08, 0.95, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Secondary Deep Emerald Orb - Center Left */}
      <motion.div
        className="absolute top-[35%] -left-[10%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #20D995 0%, #0D211B 50%, transparent 75%)'
        }}
        animate={{
          x: [0, -30, 45, 0],
          y: [0, 40, -25, 0],
          scale: [1, 0.94, 1.06, 1]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Third Ambient Orb - Bottom Right */}
      <motion.div
        className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7CFFB2 0%, #0D211B 60%, transparent 80%)'
        }}
        animate={{
          x: [0, -40, 20, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.1, 0.92, 1]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Subtle Top-Center Lighting Vignette */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[350px] opacity-10 blur-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, #7CFFB2 0%, transparent 70%)'
        }}
      />
    </div>
  );
}
