import React from 'react';
import { motion } from 'framer-motion';

const INK = 'hsl(221 41% 12%)';
const MINT = 'hsl(150 62% 68%)';
const SUN = 'hsl(46 100% 62%)';
const CORAL = 'hsl(12 100% 67%)';
const TERMINAL = 'hsl(222 45% 7%)';

function Eyes({ emotion }) {
  if (emotion === 'happy')
    return (
      <g stroke={MINT} strokeWidth="4.5" fill="none" strokeLinecap="round">
        <path d="M38 62 Q46 50 54 62" />
        <path d="M66 62 Q74 50 82 62" />
      </g>
    );
  if (emotion === 'thinking')
    return (
      <g fill={MINT}>
        <rect x="44" y="48" width="9" height="16" rx="2" />
        <rect x="67" y="56" width="9" height="8" rx="2" />
      </g>
    );
  if (emotion === 'excited')
    return (
      <g fill={MINT}>
        <g transform="translate(40 48)">
          <rect x="0" y="4" width="17" height="5" rx="1.5" />
          <rect x="6" y="-2" width="5" height="17" rx="1.5" />
        </g>
        <g transform="translate(63 48)">
          <rect x="0" y="4" width="17" height="5" rx="1.5" />
          <rect x="6" y="-2" width="5" height="17" rx="1.5" />
        </g>
      </g>
    );
  if (emotion === 'sending')
    return (
      <g fill={MINT}>
        <rect x="44" y="52" width="9" height="11" rx="4.5" />
        <rect x="67" y="52" width="9" height="11" rx="4.5" />
      </g>
    );
  if (emotion === 'error')
    return (
      <g stroke={CORAL} strokeWidth="4.5" fill="none" strokeLinecap="round">
        <path d="M42 50 l8 8" />
        <path d="M50 50 l-8 8" />
        <path d="M70 50 l8 8" />
        <path d="M78 50 l-8 8" />
      </g>
    );
  if (emotion === 'sad')
    return (
      <g fill={MINT}>
        <rect x="44" y="54" width="9" height="8" rx="2" />
        <rect x="67" y="54" width="9" height="8" rx="2" />
      </g>
    );
  // idle — blinks
  return (
    <motion.g
      fill={MINT}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      animate={{ scaleY: [1, 0.1, 1] }}
      transition={{ duration: 0.22, repeat: Infinity, repeatDelay: 3.4 }}
    >
      <rect x="44" y="48" width="9" height="16" rx="2" />
      <rect x="67" y="48" width="9" height="16" rx="2" />
    </motion.g>
  );
}

function Mouth({ emotion }) {
  switch (emotion) {
    case 'happy':
      return <path d="M48 70 Q60 80 72 70" stroke={MINT} strokeWidth="4.5" fill="none" strokeLinecap="round" />;
    case 'thinking':
      return <rect x="54" y="71" width="9" height="5" rx="2.5" fill={MINT} />;
    case 'excited':
      return <ellipse cx="60" cy="74" rx="7" ry="6" fill={MINT} />;
    case 'sending':
      return (
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={{ scaleX: [1, 0.6, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <rect x="53" y="72" width="14" height="4.5" rx="2.25" fill={MINT} />
        </motion.g>
      );
    case 'error':
      return (
        <path
          d="M48 77 q3 -4.5 6 0 q3 4.5 6 0 q3 -4.5 6 0 q3 4.5 6 0"
          stroke={CORAL}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      );
    case 'sad':
      return <path d="M50 79 Q60 70 70 79" stroke={MINT} strokeWidth="4.5" fill="none" strokeLinecap="round" />;
    default:
      return <rect x="52" y="71" width="16" height="5" rx="2.5" fill={MINT} />;
  }
}

/**
 * DijiBot — retro arcade robot mascot.
 * Emotions: idle (blinks) · happy · thinking · excited · sending · error · sad.
 * Every emotion change triggers a spring pop; error shakes the whole robot.
 */
export default function RobotMascot({ emotion = 'idle', className = 'w-16 h-[70px]' }) {
  return (
    <svg viewBox="0 0 120 132" className={className} role="img" aria-label="DijiBot">
      <defs>
        <linearGradient id="dijibot-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={MINT} />
          <stop offset="100%" stopColor={SUN} />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="60" cy="126" rx="26" ry="5" fill="rgba(0,0,0,0.35)" />

      {/* error shake wrapper */}
      <motion.g animate={{ x: emotion === 'error' ? [0, -5, 5, -3, 3, -1, 0] : 0 }} transition={{ duration: 0.5 }}>
        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: emotion === 'sending' ? 1.2 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* spring pop on every emotion change */}
          <motion.g
            key={emotion}
            initial={{ scale: 0.86 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 14 }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            {/* antenna */}
            <motion.g
              style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
              animate={{ rotate: [-7, 7, -7] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <line x1="60" y1="28" x2="60" y2="13" stroke={INK} strokeWidth="3" strokeLinecap="round" />
              {emotion === 'sending' ? (
                <motion.g
                  style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                >
                  <circle cx="60" cy="10" r="8" fill="none" stroke={MINT} strokeWidth="2.5" strokeDasharray="9 6" />
                </motion.g>
              ) : emotion === 'error' ? (
                <motion.circle
                  cx="60"
                  cy="10"
                  r="5"
                  fill={CORAL}
                  stroke={INK}
                  strokeWidth="2"
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                />
              ) : (
                <circle cx="60" cy="10" r="5" fill={CORAL} stroke={INK} strokeWidth="2" />
              )}
            </motion.g>
            {emotion === 'thinking' && (
              <g>
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={i}
                    cx={90 + i * 9}
                    cy={22 - (i === 1 ? 6 : 0)}
                    r="2.5"
                    fill={MINT}
                    animate={{ opacity: [0.15, 1, 0.15] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
                  />
                ))}
              </g>
            )}
            {emotion === 'error' && (
              <motion.g
                style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                animate={{ rotate: [-8, 8, -8], y: [0, -2, 0] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              >
                <circle cx="97" cy="18" r="9" fill={CORAL} stroke={INK} strokeWidth="2" />
                <rect x="96" y="12" width="2" height="8" rx="1" fill={INK} />
                <rect x="96" y="22" width="2" height="2.5" rx="1" fill={INK} />
              </motion.g>
            )}
            {emotion === 'excited' && (
              <motion.g
                animate={{ scale: [0.9, 1.15, 0.9], rotate: [0, 15, 0] }}
                style={{ transformBox: 'fill-box' }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <path d="M98 24 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill={SUN} stroke={INK} strokeWidth="1.5" />
              </motion.g>
            )}

            {/* ears */}
            <rect x="9" y="54" width="10" height="24" rx="5" fill={MINT} stroke={INK} strokeWidth="2.5" />
            <rect x="101" y="54" width="10" height="24" rx="5" fill={MINT} stroke={INK} strokeWidth="2.5" />

            {/* head */}
            <rect x="18" y="26" width="84" height="72" rx="20" fill="url(#dijibot-body)" stroke={INK} strokeWidth="3" />
            {/* screen */}
            <rect x="28" y="36" width="64" height="50" rx="10" fill={TERMINAL} />
            {/* glass shine */}
            <rect x="34" y="41" width="18" height="5" rx="2.5" fill="#ffffff" opacity="0.4" />

            <Eyes emotion={emotion} />
            {(emotion === 'happy' || emotion === 'excited') && (
              <g fill={CORAL} opacity="0.4">
                <circle cx="34" cy="66" r="4" />
                <circle cx="86" cy="66" r="4" />
              </g>
            )}
            <Mouth emotion={emotion} />

            {/* body */}
            <rect x="40" y="100" width="40" height="24" rx="9" fill="url(#dijibot-body)" stroke={INK} strokeWidth="3" />
            <motion.circle
              cx="60"
              cy="112"
              r="4"
              fill={CORAL}
              stroke={INK}
              strokeWidth="1.5"
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: emotion === 'error' ? 0.4 : 1.6, repeat: Infinity }}
            />
          </motion.g>
        </motion.g>
      </motion.g>
    </svg>
  );
}