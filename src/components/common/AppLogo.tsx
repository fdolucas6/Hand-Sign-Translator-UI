import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = 'w-9 h-9', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Hand Sign Translator Logo"
    >
      <rect width="100" height="100" rx="24" fill="#2563EB" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="url(#logoGrad)" />

      {/* Main Stylized Hand Shape (White 5.5px stroke) */}
      <path
        d="M28 50 V 62 C 28 75  38 84  52 84 C 64 84  66 75 66 57 C 66 52  61 52 61 55 C 61 46  56 46 56 25 C 56 19  50 19 50 25 C 50 40  50 49 50 49 C 50 33  44 26  44 26 C 41 24  38 27  38 33 C 38 43  38 51 38 51 C 38 40  34 32  34 32 C 31 30  28 34 28 42 Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Hand Palm Contour */}
      <path
        d="M28 50 C 28 72  36 84 52 84 C 66 84  66 68 66 55"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5.5"
        strokeLinecap="round"
      />

      {/* Fingers */}
      {/* Pinky / Thumb */}
      <path
        d="M28 50 V 62"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      {/* Middle Finger Extended */}
      <path
        d="M53 49 V 24 C 53 20  48 20 48 24 V 49"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      {/* Ring Finger Extended */}
      <path
        d="M44 50 V 29 C 44 25  39 25 39 29 V 51"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      {/* Index Finger Extended */}
      <path
        d="M37 51 V 35"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Speech / Human Communicator Figure (Light Blue #93C5FD) */}
      <circle cx="77" cy="31" r="6" fill="#93C5FD" />
      <path
        d="M69 49 C 74 46  81 44 84 36"
        stroke="#93C5FD"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M80 43 C 82 48  80 50 78 51"
        stroke="#93C5FD"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M75 46 C 70 47  68 49 68 50"
        stroke="#93C5FD"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};
