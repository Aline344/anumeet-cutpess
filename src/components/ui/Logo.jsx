import React from 'react';

export default function Logo({ className = "h-9 w-9", ...props }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Outer double rings with elegant gold border gradient */}
      <circle 
        cx="50" 
        cy="50" 
        r="44" 
        stroke="url(#goldGradientLogo)" 
        strokeWidth="2.5" 
        className="drop-shadow-[0_2px_4px_rgba(212,175,55,0.2)]" 
      />
      <circle 
        cx="50" 
        cy="50" 
        r="39" 
        stroke="url(#goldGradientLogo)" 
        strokeWidth="0.75" 
        strokeDasharray="3 2" 
        opacity="0.8" 
      />
      
      {/* Intertwined Monogram A and K paths */}
      {/* Letter A */}
      <path 
        d="M 32 68 L 47 30 H 51 L 66 68" 
        stroke="url(#goldGradientLogo)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M 38 54 H 56" 
        stroke="url(#goldGradientLogo)" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
      
      {/* Letter K stem and arms overlapping A */}
      <path 
        d="M 52.5 30 V 68" 
        stroke="url(#goldGradientLogo)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M 52.5 49 L 66.5 32" 
        stroke="url(#goldGradientLogo)" 
        strokeWidth="3.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M 52.5 49 L 67.5 68" 
        stroke="url(#goldGradientLogo)" 
        strokeWidth="3.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Sparkle emblem decoration */}
      <path 
        d="M 50 16 L 51 21 L 56 22 L 51 23 L 50 28 L 49 23 L 44 22 L 49 21 Z" 
        fill="url(#goldGradientLogo)" 
        opacity="0.9" 
      />

      <defs>
        <linearGradient id="goldGradientLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#BF953F" />
          <stop offset="25%" stopColor="#FCF6BA" />
          <stop offset="50%" stopColor="#B38728" />
          <stop offset="75%" stopColor="#FBF5B7" />
          <stop offset="100%" stopColor="#AA771C" />
        </linearGradient>
      </defs>
    </svg>
  );
}
